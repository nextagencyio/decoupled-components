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
      // Require valid session for writes.
      cleanupSessions()
      const session = getSessionFromRequest(request)
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized. Please open the editor from Drupal.' },
          { status: 401 }
        )
      }

      headers['Content-Type'] = 'application/json'
      // Forward the Puck token from the session to Drupal for save validation.
      headers['X-Puck-Token'] = session.token
      const rawBody = await request.json()
      body = JSON.stringify(rawBody)
    }

    const drupalResponse = await fetch(drupalUrl, {
      method,
      headers,
      body,
      signal: AbortSignal.timeout(30000),
    })

    const responseData = await drupalResponse.json()
    return NextResponse.json(responseData, { status: drupalResponse.status })
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
