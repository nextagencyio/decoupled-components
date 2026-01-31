import { NextRequest, NextResponse } from 'next/server'

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL
const CLIENT_ID = process.env.DRUPAL_CLIENT_ID
const CLIENT_SECRET = process.env.DRUPAL_CLIENT_SECRET

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken
  }

  if (!DRUPAL_URL || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Drupal credentials not configured')
  }

  const response = await fetch(`${DRUPAL_URL}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to obtain access token')
  }

  const data = await response.json()
  accessToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000

  return accessToken!
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!DRUPAL_URL) {
      return NextResponse.json(
        { errors: [{ message: 'Drupal URL not configured' }] },
        { status: 500 }
      )
    }

    const token = await getAccessToken()

    const response = await fetch(`${DRUPAL_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('GraphQL proxy error:', error)
    return NextResponse.json(
      { errors: [{ message: 'GraphQL request failed' }] },
      { status: 500 }
    )
  }
}
