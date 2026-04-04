import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest, cleanupSessions } from '@/lib/puck-auth'

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

/**
 * Proxy to Drupal's /api/puck/* endpoints.
 * GET requests (load, mapping) are open.
 * POST requests (save) require a valid Puck session and forward the auth token.
 */
async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  try {
    if (!DRUPAL_URL) {
      return NextResponse.json({ error: 'Drupal URL not configured' }, { status: 500 })
    }

    const params = await context.params
    const puckPath = params.path.join('/')
    const drupalUrl = `${DRUPAL_URL}/api/puck/${puckPath}`

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }

    let body: string | undefined

    if (method === 'POST') {
      // Extract Puck token from cookie (most reliable on serverless)
      // or fall back to in-memory session
      const cookieHeader = request.headers.get('cookie') || ''
      const tokenMatch = cookieHeader.match(/puck_token=([^;]+)/)
      const puckToken = tokenMatch
        ? decodeURIComponent(tokenMatch[1])
        : getSessionFromRequest(request)?.token || ''

      if (!puckToken) {
        return NextResponse.json(
          { error: 'Unauthorized. Please open the editor from Drupal.' },
          { status: 401 }
        )
      }

      headers['Content-Type'] = 'application/json'
      headers['X-Puck-Token'] = puckToken
      const rawBody = await request.json()
      body = JSON.stringify(rawBody)
    }

    // Retry logic for saves — Drupal pods may be waking from hibernation
    const maxAttempts = method === 'POST' ? 3 : 1
    let lastError: string = ''

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const drupalResponse = await fetch(drupalUrl, {
          method,
          headers,
          body,
          signal: AbortSignal.timeout(30000),
        })

        const responseData = await drupalResponse.json()

        if (drupalResponse.ok || attempt === maxAttempts) {
          return NextResponse.json(responseData, { status: drupalResponse.status })
        }

        // Retry on server errors (5xx) — pod might be waking up
        if (drupalResponse.status >= 500) {
          lastError = `HTTP ${drupalResponse.status}`
          console.warn(`Puck save attempt ${attempt}/${maxAttempts} failed: ${lastError}, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
          continue
        }

        // Don't retry client errors (4xx)
        return NextResponse.json(responseData, { status: drupalResponse.status })
      } catch (fetchError: any) {
        lastError = fetchError.message
        if (attempt < maxAttempts) {
          console.warn(`Puck save attempt ${attempt}/${maxAttempts} error: ${lastError}, retrying...`)
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
        }
      }
    }

    return NextResponse.json(
      { error: `Puck save failed after ${maxAttempts} attempts: ${lastError}` },
      { status: 502 }
    )
  } catch (error: any) {
    console.error('Puck proxy error:', error)
    return NextResponse.json(
      { error: `Puck proxy error: ${error.message}` },
      { status: 502 }
    )
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context, 'GET')
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context, 'POST')
}
