'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Puck, type Data } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck-config'
import { useParams, useSearchParams } from 'next/navigation'

// AI plugin — switch via NEXT_PUBLIC_PUCK_AI_PROVIDER env var
// "puck-cloud" = official Puck Cloud plugin (requires PUCK_API_KEY)
// "groq" (default) = custom Groq/Llama plugin (requires GROQ_API_KEY)
import { aiPlugin as groqPlugin } from '@/lib/ai-plugin-groq'
import { aiPlugin as puckCloudPlugin } from '@/lib/ai-plugin-puck-cloud'

const aiPlugin = process.env.NEXT_PUBLIC_PUCK_AI_PROVIDER === 'puck-cloud'
  ? puckCloudPlugin
  : groqPlugin

const PUCK_API = '/api/drupal-puck'
const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://localhost:8888'

type AuthUser = { uid: number; name: string }

type EditorState =
  | { status: 'loading' }
  | { status: 'unauthorized'; message: string }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: Data; user: AuthUser }
  | { status: 'saving'; data: Data; user: AuthUser }

type Toast = { message: string; type: 'success' | 'error'; id: number }

function ToastNotification({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
        color: 'white', background: toast.type === 'success' ? '#059669' : '#dc2626',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideIn 0.3s ease-out', cursor: 'pointer',
      }}
      onClick={onDismiss}
    >
      <span>{toast.type === 'success' ? '\u2713' : '\u2715'}</span>
      <span>{toast.message}</span>
    </div>
  )
}

export default function EditorPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const nid = params.nid as string
  const token = searchParams.get('token')
  const [state, setState] = useState<EditorState>({ status: 'loading' })
  const [toasts, setToasts] = useState<Toast[]>([])
  const stateRef = useRef(state)
  stateRef.current = state
  const toastIdRef = useRef(0)

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { message, type, id }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Load: validate token, then fetch node data.
  useEffect(() => {
    async function load() {
      try {
        // Step 1: Validate the signed token from Drupal.
        let user: AuthUser

        if (token) {
          const authRes = await fetch('/api/auth/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
          const authData = await authRes.json()

          if (!authRes.ok) {
            setState({ status: 'unauthorized', message: authData.error || 'Authentication failed' })
            return
          }

          user = { uid: authData.user.uid, name: authData.user.name }
        }
        else {
          // No token — block access. Must open editor from Drupal.
          setState({ status: 'unauthorized', message: 'No authentication token provided.' })
          return
        }

        // Step 2: Load Puck data from Drupal (paragraphs → Puck JSON).
        const res = await fetch(`${PUCK_API}/load/${nid}`)
        if (!res.ok) throw new Error(`Failed to load page: ${res.status}`)
        const data: Data = await res.json()

        setState({ status: 'ready', data, user })
      } catch (error: any) {
        console.error('Failed to load:', error)
        setState({ status: 'error', message: error.message })
      }
    }
    load()
  }, [nid, token])

  // Save handler — stable via ref.
  const handlePublish = useCallback(async (data: Data) => {
    const current = stateRef.current
    if (current.status !== 'ready') return

    const { user } = current
    setState({ status: 'saving', data, user })

    try {
      const res = await fetch(`${PUCK_API}/save/${nid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || `Save failed (${res.status})`)
      }

      setState({ status: 'ready', data, user })
      addToast('Published successfully', 'success')
    } catch (error: any) {
      console.error('Save failed:', error)
      addToast(`Save failed: ${error.message}`, 'error')
      const cur = stateRef.current
      if (cur.status === 'saving') {
        setState({ status: 'ready', data, user: cur.user })
      }
    }
  }, [addToast])

  if (state.status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Loading page data...</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>Fetching node {nid} from Drupal</p>
        </div>
      </div>
    )
  }

  if (state.status === 'unauthorized') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#dc2626' }}>Unauthorized</h2>
          <p style={{ color: '#666', marginTop: '0.5rem', maxWidth: '400px' }}>{state.message}</p>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Please access the editor from within Drupal using the Edit tab.
          </p>
          <a
            href={`${DRUPAL_BASE_URL}/node/${nid}`}
            style={{
              display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem',
              background: '#2563eb', color: 'white', borderRadius: '0.375rem', textDecoration: 'none',
            }}
          >
            Go to Drupal
          </a>
        </div>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#dc2626' }}>Error loading page</h2>
          <p style={{ color: '#666', marginTop: '0.5rem', maxWidth: '500px' }}>{state.message}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem', padding: '0.5rem 1rem', background: '#2563eb',
              color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const drupalNodeUrl = `${DRUPAL_BASE_URL}/node/${nid}`

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Toast container */}
      <div style={{
        position: 'fixed', top: '60px', right: '20px', zIndex: 10000,
        display: 'flex', flexDirection: 'column', gap: '8px',
      }}>
        {toasts.map(toast => (
          <ToastNotification key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>

      <Puck
        config={puckConfig}
        data={state.data}
        onPublish={handlePublish}
        iframe={{ enabled: false }}
        plugins={[aiPlugin]}
        overrides={{
          headerActions: ({ children }) => (
            <>
              {/* Show authenticated user */}
              {state.user.uid > 0 && (
                <span style={{ fontSize: '12px', color: '#6b7280', marginRight: '8px' }}>
                  {state.user.name}
                </span>
              )}
              <a
                href={drupalNodeUrl}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px', fontSize: '14px', color: '#374151', textDecoration: 'none',
                  border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer',
                }}
              >
                &larr; Back
              </a>
              {children}
            </>
          ),
        }}
      />
    </>
  )
}
