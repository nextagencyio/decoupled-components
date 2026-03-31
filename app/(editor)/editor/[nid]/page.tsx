'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Puck, type Data } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck-config'
import { useParams, useSearchParams } from 'next/navigation'
import { ConfirmDialog } from '@/app/components/editor/ConfirmDialog'

// AI plugin — switch via NEXT_PUBLIC_PUCK_AI_PROVIDER env var
import { aiPlugin as groqPlugin } from '@/lib/ai-plugin-groq'
import { aiPlugin as puckCloudPlugin } from '@/lib/ai-plugin-puck-cloud'

const aiPlugin = process.env.NEXT_PUBLIC_PUCK_AI_PROVIDER === 'puck-cloud'
  ? puckCloudPlugin
  : groqPlugin

const PUCK_API = '/api/drupal-puck'
const DRUPAL_BASE_URL = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://localhost:8888'

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
]

type AuthUser = { uid: number; name: string }
type OtherEditor = { uid: number; name: string }

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

/** Presence avatars in the header bar */
function PresenceAvatars({ editors }: { editors: OtherEditor[] }) {
  if (editors.length === 0) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '8px' }}>
      {editors.map((editor, i) => (
        <div
          key={editor.uid}
          title={editor.name}
          style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: COLORS[editor.uid % COLORS.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 600, color: 'white',
            border: '2px solid white', boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            cursor: 'default', flexShrink: 0,
          }}
        >
          {editor.name?.charAt(0)?.toUpperCase() || '?'}
        </div>
      ))}
      <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '2px', whiteSpace: 'nowrap' }}>
        {editors.length === 1
          ? `${editors[0].name} is editing`
          : `${editors.length} others editing`}
      </span>
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
  const [otherEditors, setOtherEditors] = useState<OtherEditor[]>([])
  const [pendingPublish, setPendingPublish] = useState<Data | null>(null)
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
        } else {
          setState({ status: 'unauthorized', message: 'No authentication token provided.' })
          return
        }

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

  // Poll for other editors every 10 seconds
  useEffect(() => {
    if (state.status !== 'ready' && state.status !== 'saving') return

    const poll = async () => {
      try {
        const res = await fetch('/api/editor-presence')
        if (res.ok) {
          const { editors } = await res.json()
          setOtherEditors(editors || [])
        }
      } catch {
        // Silently ignore polling errors
      }
    }

    poll() // Immediate first check
    const interval = setInterval(poll, 10000)
    return () => clearInterval(interval)
  }, [state.status])

  // Publish handler
  const doPublish = useCallback(async (data: Data) => {
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
  }, [nid, addToast])

  const handlePublish = useCallback(async (data: Data) => {
    if (otherEditors.length > 0) {
      setPendingPublish(data)
    } else {
      doPublish(data)
    }
  }, [otherEditors, doPublish])

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

  const names = otherEditors.map(e => e.name).filter(Boolean)
  const nameList = names.length === 1
    ? names[0]
    : names.length === 2
      ? `${names[0]} and ${names[1]}`
      : names.length > 2
        ? `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`
        : ''

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

      {/* Publish confirmation dialog */}
      {pendingPublish && nameList && (
        <ConfirmDialog
          title="Other editors are active"
          message={`${nameList} ${otherEditors.length === 1 ? 'is' : 'are'} also editing this page. Publishing now may overwrite their unsaved changes.`}
          confirmLabel="Publish Anyway"
          cancelLabel="Cancel"
          confirmColor="#2563eb"
          avatars={otherEditors.map(e => ({
            name: e.name,
            color: COLORS[e.uid % COLORS.length],
          }))}
          onConfirm={() => {
            const d = pendingPublish
            setPendingPublish(null)
            doPublish(d)
          }}
          onCancel={() => setPendingPublish(null)}
        />
      )}

      <Puck
        config={puckConfig}
        data={state.data}
        onPublish={handlePublish}
        iframe={{ enabled: false }}
        plugins={[aiPlugin]}
        overrides={{
          headerActions: ({ children }) => (
            <>
              {/* Other editors */}
              <PresenceAvatars editors={otherEditors} />

              {/* Current user */}
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
