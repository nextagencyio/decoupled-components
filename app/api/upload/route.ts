import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSessionFromRequest, cleanupSessions } from '@/lib/puck-auth'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

export async function POST(request: NextRequest) {
  try {
    // Require a valid Puck session.
    cleanupSessions()
    const session = getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please open the editor from Drupal.' },
        { status: 401 }
      )
    }

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type server-side.
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed. Use PNG, JPG, GIF, SVG, or WebP.` },
        { status: 400 }
      )
    }

    // Max 10MB.
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 })
    }

    // Build signed upload params.
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const folder = 'puck-editor'
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex')

    const uploadForm = new FormData()
    uploadForm.append('file', file)
    uploadForm.append('api_key', API_KEY)
    uploadForm.append('timestamp', timestamp)
    uploadForm.append('signature', signature)
    uploadForm.append('folder', folder)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: uploadForm }
    )

    const data = await res.json()

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 400 })
    }

    return NextResponse.json({
      url: data.secure_url,
      filename: file.name,
      width: data.width,
      height: data.height,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
