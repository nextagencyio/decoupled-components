import { getSession, getOtherEditors, touchSession, COOKIE_NAME } from '@/lib/puck-auth'

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (!match) {
    return Response.json({ editors: [] })
  }

  const sessionId = match[1]
  const session = getSession(sessionId)
  if (!session) {
    return Response.json({ editors: [] })
  }

  // Heartbeat — mark this session as still active
  touchSession(sessionId)

  const others = getOtherEditors(session.nid, sessionId)
  return Response.json({ editors: others })
}
