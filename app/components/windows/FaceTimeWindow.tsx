'use client'

import { useState } from 'react'

export default function FaceTimeWindow() {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100%', background: '#1e1e1e', color: '#fff' }}>
      {/* Sidebar (History) */}
      <div style={{
        width: 220,
        flexShrink: 0,
        background: 'rgba(30, 30, 30, 0.95)',
        borderRight: '1px solid #000',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Toggle Video/Audio */}
        <div style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', background: '#333', borderRadius: 4, overflow: 'hidden', border: '1px solid #444' }}>
            <div style={{ padding: '4px 16px', fontSize: 11, background: '#666', color: '#fff' }}>Video</div>
            <div style={{ padding: '4px 16px', fontSize: 11, color: '#aaa' }}>Audio</div>
          </div>
        </div>

        {/* History List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '4px 12px', fontSize: 11, color: '#aaa', fontWeight: 600 }}>Recent</div>
          
          <div style={{
            padding: '8px 12px',
            background: '#007AFF',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#fff',
              color: '#007AFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 600,
            }}>
              S
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>Shivansh Pandey</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Missed Call</div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Today</div>
          </div>
        </div>
      </div>

      {/* Main Content (Camera View Placeholder) */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Fake Camera Feed */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #2a2a2a 0%, #111 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 32,
            fontWeight: 300,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}>
            S
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 300, margin: '0 0 8px 0' }}>Shivansh Pandey</h2>
            <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>FaceTime Video</p>
          </div>

          <a
            href="https://cal.com/sxivansx/30min"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              marginTop: 24,
              padding: '8px 24px',
              background: hovered ? '#34c759' : '#28a745',
              color: '#fff',
              borderRadius: 20,
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px rgba(40, 167, 69, 0.4)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
            Call Back
          </a>
        </div>
      </div>
    </div>
  )
}
