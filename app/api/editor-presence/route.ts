import { getSessionFromRequest, getOtherEditors } from '@/lib/puck-auth'

export async function GET(request: Request) {
  const session = getSessionFromRequest(request)
  if (!session) {
    return Response.json({ editors: [] })
  }

  const others = getOtherEditors(session.nid, session.uid)
  return Response.json({ editors: others })
}
