'use client'

import { useState } from 'react'

interface Props {
  url: string
  /** Hostname shown in the address bar, e.g. "desk.shivansh.life" */
  label: string
}

export default function SafariWindow({ url, label }: Props) {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = () => {
    setLoading(true)
    setReloadKey(k => k + 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Safari toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        background: 'linear-gradient(180deg, #f7f7f7 0%, #e8e8e8 100%)',
        borderBottom: '1px solid #c4c4c4',
        flexShrink: 0,
      }}>
        {/* Nav chevrons */}
        <div style={{ display: 'flex', gap: 2 }}>
          <NavButton dir="back" />
          <NavButton dir="forward" />
        </div>

        {/* Address bar */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          height: 24,
          padding: '0 10px',
          background: '#fff',
          border: '1px solid #c4c4c4',
          borderRadius: 5,
          boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.04)',
        }}>
          {/* Lock icon */}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>{label}</span>
        </div>

        {/* Reload */}
        <button onClick={reload} title="Reload" style={iconBtn}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>

        {/* Open in new tab */}
        <button onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} title="Open in new tab" style={iconBtn}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </button>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, position: 'relative', background: '#fff' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: 12,
            background: '#fff',
          }}>
            Loading {label}…
          </div>
        )}
        <iframe
          key={reloadKey}
          src={url}
          onLoad={() => setLoading(false)}
          title={label}
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 3,
  display: 'flex',
  alignItems: 'center',
  borderRadius: 4,
}

function NavButton({ dir }: { dir: 'back' | 'forward' }) {
  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 22,
      height: 22,
      color: '#bbb',
      cursor: 'default',
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {dir === 'back'
          ? <polyline points="15 18 9 12 15 6" />
          : <polyline points="9 18 15 12 9 6" />}
      </svg>
    </span>
  )
}
