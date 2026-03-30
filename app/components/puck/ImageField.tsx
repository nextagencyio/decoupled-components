'use client'

import { useState, useRef, useCallback } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    cloudinary: any
  }
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY

interface ImageFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ImageField({ value, onChange, label }: ImageFieldProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const openWidget = useCallback(() => {
    if (!window.cloudinary) return

    // Upload Widget creates a fresh instance each time — no singleton issues.
    window.cloudinary.openUploadWidget(
      {
        cloudName: CLOUD_NAME,
        apiKey: API_KEY,
        uploadPreset: 'ml_default',
        sources: ['local', 'url', 'camera', 'google_drive', 'dropbox', 'unsplash'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        folder: 'puck-editor',
        clientAllowedFormats: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
        maxFileSize: 10000000,
        styles: {
          palette: {
            window: '#ffffff',
            windowBorder: '#d1d5db',
            tabIcon: '#2563eb',
            menuIcons: '#374151',
            textDark: '#111827',
            textLight: '#ffffff',
            link: '#2563eb',
            action: '#2563eb',
            inactiveTabIcon: '#9ca3af',
            error: '#dc2626',
            inProgress: '#2563eb',
            complete: '#059669',
            sourceBg: '#f9fafb',
          },
        },
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Upload widget error:', error)
          return
        }
        if (result.event === 'success') {
          onChangeRef.current(result.info.secure_url)
        }
      }
    )
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Script
        src="https://upload-widget.cloudinary.com/latest/global/all.js"
        onLoad={() => setScriptLoaded(true)}
        strategy="lazyOnload"
      />

      {value ? (
        <div>
          <img
            src={value}
            alt={label || 'Image'}
            style={{
              width: '100%',
              height: '120px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
            }}
          />
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={openWidget}
              style={{
                flex: 1,
                padding: '6px 8px',
                fontSize: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                padding: '6px 8px',
                fontSize: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer',
                color: '#dc2626',
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={openWidget}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            background: '#fafafa',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = '#9ca3af')}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            Click to upload image
          </span>
        </div>
      )}

      {/* URL paste fallback */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        style={{
          padding: '6px 8px',
          fontSize: '12px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          width: '100%',
        }}
      />
    </div>
  )
}
