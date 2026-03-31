/**
 * Server-side Puck auth session management.
 *
 * Flow:
 * 1. User arrives at /editor/[nid]?token=SIGNED_TOKEN
 * 2. Editor calls /api/auth/validate with the token
 * 3. Server validates against Drupal, generates a session ID, stores it in memory
 * 4. Server returns session ID as an httpOnly cookie
 * 5. All subsequent API calls (/api/jsonapi, /api/upload) check the session cookie
 */

import crypto from 'crypto'

interface PuckSession {
  uid: number
  name: string
  nid: number
  token: string
  createdAt: number
  lastSeen: number
}

// In-memory session store. In production, use Redis or similar.
const sessions = new Map<string, PuckSession>()

// Session lifetime: 8 hours (matches token lifetime).
const SESSION_LIFETIME_MS = 8 * 60 * 60 * 1000

export const COOKIE_NAME = 'puck_session'

export function createSession(uid: number, name: string, nid: number, token: string): string {
  const sessionId = crypto.randomBytes(32).toString('hex')
  const now = Date.now()
  sessions.set(sessionId, { uid, name, nid, token, createdAt: now, lastSeen: now })
  return sessionId
}

export function touchSession(sessionId: string): void {
  const session = sessions.get(sessionId)
  if (session) session.lastSeen = Date.now()
}

export function getSession(sessionId: string): PuckSession | null {
  const session = sessions.get(sessionId)
  if (!session) return null

  // Check expiry.
  if (Date.now() - session.createdAt > SESSION_LIFETIME_MS) {
    sessions.delete(sessionId)
    return null
  }

  return session
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId)
}

/**
 * Extract and validate the Puck session from a request's cookies.
 * Returns the session if valid, null otherwise.
 */
export function getSessionFromRequest(request: Request): PuckSession | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (!match) return null
  return getSession(match[1])
}

/**
 * Get other editors on the same node — detected by different tokens.
 * Same user opening the same link in two tabs won't trigger a warning.
 * Only warns when a genuinely different editor session exists.
 */
const PRESENCE_TIMEOUT_MS = 30_000

export function getOtherEditors(nid: number, currentToken: string): { uid: number; name: string }[] {
  cleanupSessions()
  const now = Date.now()
  const editors = new Map<number, string>()
  for (const [, session] of sessions) {
    if (session.nid === nid && session.token !== currentToken) {
      if (now - session.lastSeen < PRESENCE_TIMEOUT_MS) {
        editors.set(session.uid, session.name)
      }
    }
  }
  return Array.from(editors, ([uid, name]) => ({ uid, name }))
}

// Periodic cleanup of expired sessions (runs lazily).
let lastCleanup = 0
export function cleanupSessions(): void {
  const now = Date.now()
  if (now - lastCleanup < 60000) return // At most once per minute.
  lastCleanup = now
  for (const [id, session] of sessions) {
    if (now - session.createdAt > SESSION_LIFETIME_MS) {
      sessions.delete(id)
    }
  }
}
