import { NextRequest, NextResponse } from 'next/server'
import { createSession, COOKIE_NAME, cleanupSessions } from '@/lib/puck-auth'

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

/**
 * Validates a Puck editor signed token against Drupal.
 * On success, creates a server-side session and sets an httpOnly cookie.
 */
export async function POST(request: NextRequest) {
  try {
    if (!DRUPAL_URL) {
      return NextResponse.json({ error: 'Drupal URL not configured' }, { status: 500 })
    }

    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }

    // Validate against Drupal.
    const res = await fetch(`${DRUPAL_URL}/api/puck/validate-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || 'Token validation failed' },
        { status: res.status }
      )
    }

    // Create a server-side session (stores the token for forwarding to Drupal).
    cleanupSessions()
    const sessionId = createSession(
      data.user.uid,
      data.user.name,
      data.node.nid,
      token
    )

    // Return user info and set httpOnly cookie.
    const response = NextResponse.json({
      success: true,
      user: { uid: data.user.uid, name: data.user.name },
      node: data.node,
    })

    response.cookies.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    })

    // Also set the raw token as a cookie — serverless functions don't share
    // in-memory sessions across instances, so the save proxy needs the token
    // available via cookie as a fallback.
    response.cookies.set('puck_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 8 * 60 * 60,
    })

    return response
  } catch (error: any) {
    console.error('Auth validation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
