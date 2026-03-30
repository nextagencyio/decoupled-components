export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { PuckRenderer } from '@/app/components/PuckRenderer'

const DRUPAL_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL

interface PageProps {
  params: Promise<{ nid: string }>
}

async function getPuckData(nid: string) {
  if (!DRUPAL_URL) return null

  try {
    const res = await fetch(`${DRUPAL_URL}/api/puck/load/${nid}`, {
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export default async function NodePage({ params }: PageProps) {
  const { nid } = await params
  const puckData = await getPuckData(nid)

  if (!puckData) {
    notFound()
  }

  if (puckData.content?.length > 0) {
    return <PuckRenderer data={puckData} />
  }

  const title = puckData.root?.props?.title || 'Untitled'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', padding: '4rem 2rem', textAlign: 'center',
    }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '16px', background: '#f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
        {title}
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px', maxWidth: '360px', lineHeight: 1.6 }}>
        This page doesn't have any content yet. Open the visual editor to start building.
      </p>
      <a
        href={`/editor/${nid}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', fontSize: '14px', fontWeight: 500,
          color: 'white', background: '#2563eb', borderRadius: '8px', textDecoration: 'none',
        }}
      >
        Open Editor
      </a>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { nid } = await params
  const puckData = await getPuckData(nid)
  return {
    title: puckData?.root?.props?.title || 'Page Not Found',
  }
}
