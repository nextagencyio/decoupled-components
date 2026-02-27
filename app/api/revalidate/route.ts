import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.DRUPAL_REVALIDATE_SECRET

  if (!expectedSecret) {
    return NextResponse.json({ message: 'Revalidate secret not configured' }, { status: 500 })
  }

  try {
    // Parse the request - Drupal sends form_params (application/x-www-form-urlencoded)
    const contentType = request.headers.get('content-type') || ''
    let secret: string | null = null
    let slug: string | null = null

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      secret = formData.get('secret') as string
      slug = formData.get('slug') as string
    } else {
      // Fallback: JSON body or header-based auth
      const body = await request.json()
      secret = body.secret || request.headers.get('x-revalidate-secret')
      slug = body.slug || body.path
    }

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Convert slug to path (ensure leading slash)
    const path = slug ? (slug.startsWith('/') ? slug : `/${slug}`) : '/'

    // Clear the Data Cache for all Drupal GraphQL fetches (expire immediately)
    revalidateTag('drupal', { expire: 0 })
    // Clear the Route Cache for the specific page
    revalidatePath(path)

    console.log(`Revalidated: ${path} (tag: drupal)`)

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
