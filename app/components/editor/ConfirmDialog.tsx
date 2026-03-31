'use client'

import { useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: string
  avatars?: { name: string; color: string }[]
  onConfirm: () => void
  onCancel: () => void
}

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Publish Anyway',
  cancelLabel = 'Cancel',
  confirmColor = '#2563eb',
  avatars,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onCancel() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(2px)',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '420px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'scaleIn 0.15s ease-out',
      }}>
        {avatars && avatars.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
            gap: '6px',
          }}>
            {avatars.map((a, i) => (
              <div
                key={i}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: a.color || COLORS[i % COLORS.length],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'white',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              >
                {a.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            ))}
          </div>
        )}

        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 700,
          color: '#111827',
          textAlign: 'center',
        }}>
          {title}
        </h3>

        <p style={{
          margin: '12px 0 24px',
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: 1.5,
          textAlign: 'center',
        }}>
          {message}
        </p>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'white',
              background: confirmColor,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
