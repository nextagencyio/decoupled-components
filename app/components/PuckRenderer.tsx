'use client'

import { Render, type Data } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck-config'

interface PuckRendererProps {
  data: string | Data
}

export function PuckRenderer({ data }: PuckRendererProps) {
  let puckData: Data
  try {
    puckData = typeof data === 'string' ? JSON.parse(data) : data
  } catch {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#dc2626' }}>
        <p>Error: Could not parse page data.</p>
      </div>
    )
  }

  if (!puckData?.content || puckData.content.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>
        <p style={{ color: '#6b7280', maxWidth: '360px', lineHeight: 1.6 }}>
          This page doesn't have any content yet. Open the visual editor to start building.
        </p>
      </div>
    )
  }

  return <Render config={puckConfig} data={puckData} />
}
