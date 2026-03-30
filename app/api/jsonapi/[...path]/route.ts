import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest, cleanupSessions } from '@/lib/puck-auth'

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
const CLIENT_ID = process.env.DRUPAL_WRITE_CLIENT_ID || process.env.DRUPAL_CLIENT_ID
const CLIENT_SECRET = process.env.DRUPAL_WRITE_CLIENT_SECRET || process.env.DRUPAL_CLIENT_SECRET

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  const response = await fetch(`${DRUPAL_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  })

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return accessToken!
}

async function handleRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  try {
    if (!DRUPAL_URL) {
      return NextResponse.json({ error: 'Drupal URL not configured' }, { status: 500 })
    }

    // Write operations require a valid Puck session.
    if (method !== 'GET') {
      cleanupSessions()
      const session = getSessionFromRequest(request)
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized. Please open the editor from Drupal.' },
          { status: 401 }
        )
      }
    }

    const token = await getAccessToken()
    const params = await context.params
    const jsonApiPath = params.path.join('/')
    const url = new URL(request.url)
    const drupalUrl = `${DRUPAL_URL}/jsonapi/${jsonApiPath}${url.search}`

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.api+json',
    }

    let body: string | undefined
    if (method === 'POST' || method === 'PATCH') {
      headers['Content-Type'] = 'application/vnd.api+json'
      body = await request.text()
    }

    const drupalResponse = await fetch(drupalUrl, {
      method,
      headers,
      body,
      signal: AbortSignal.timeout(30000),
    })

    if (drupalResponse.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const responseData = await drupalResponse.json()
    return NextResponse.json(responseData, { status: drupalResponse.status })
  } catch (error: any) {
    console.error('JSON:API proxy error:', error)
    return NextResponse.json(
      { error: `JSON:API proxy error: ${error.message}` },
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

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context, 'PATCH')
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return handleRequest(request, context, 'DELETE')
}
