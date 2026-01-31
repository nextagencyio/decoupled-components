import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  const expectedSecret = process.env.DRUPAL_REVALIDATE_SECRET

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const path = body.path || '/'

    revalidatePath(path)

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { message: 'Revalidation failed' },
      { status: 500 }
    )
  }
}
