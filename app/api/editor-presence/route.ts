import { getOtherEditors, COOKIE_NAME } from '@/lib/puck-auth'

export async function GET(request: Request) {
  // Get the current session ID from cookie
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))
  if (!match) {
    return Response.json({ editors: [] })
  }

  const sessionId = match[1]

  // Get the session to find the nid
  const { getSession } = await import('@/lib/puck-auth')
  const session = getSession(sessionId)
  if (!session) {
    return Response.json({ editors: [] })
  }

  const others = getOtherEditors(session.nid, sessionId)
  return Response.json({ editors: others })
}
