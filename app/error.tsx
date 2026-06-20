'use client'

import { useEffect } from 'react'

const WALLPAPER =
  'linear-gradient(175deg,#1e3156 0%,#3d4a7a 8%,#6e5488 16%,#a45d7e 24%,#d4756a 32%,#e89872 40%,#f0b87a 48%,#e8c88a 56%,#c4b07a 64%,#8a9a6a 72%,#5a7a52 80%,#3a5a3a 88%,#1e3620 100%)'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log so it's visible in the console / server logs.
    // A monitoring hook (e.g. Sentry.captureException) can be added here later.
    console.error(error)
  }, [error])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: WALLPAPER,
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          width: 400,
          maxWidth: '90%',
          borderRadius: 6,
          overflow: 'hidden',
          border: '0.5px solid rgba(0,0,0,0.1)',
          boxShadow: '0 22px 70px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.12)',
          background: 'rgba(246,246,246,0.6)',
          backdropFilter: 'blur(50px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(50px) saturate(1.8)',
        }}
      >
        <div
          style={{
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, rgba(232,232,232,0.6) 0%, rgba(210,210,210,0.6) 100%)',
            borderBottom: '0.5px solid rgba(0,0,0,0.12)',
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(0,0,0,0.75)',
          }}
        >
          Problem Report
        </div>

        <div
          style={{
            padding: '24px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            background: '#ffffff',
          }}
        >
          <img src="/yosemite-icons/PrefApp.png" alt="" width={56} height={56} style={{ marginBottom: 14 }} />
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>
            The application quit unexpectedly.
          </h2>
          <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#6e6e73', lineHeight: 1.5 }}>
            Something went wrong while loading this view. You can relaunch it below.
          </p>

          {error?.message && (
            <pre
              style={{
                marginTop: 14,
                maxWidth: '100%',
                overflowX: 'auto',
                fontSize: 11,
                color: '#8a8a8e',
                background: '#f4f4f5',
                border: '1px solid #e5e5e5',
                borderRadius: 4,
                padding: '8px 10px',
                textAlign: 'left',
                whiteSpace: 'pre-wrap',
              }}
            >
              {error.message}
              {error.digest ? `\n\nDigest: ${error.digest}` : ''}
            </pre>
          )}

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 18,
              fontSize: 13,
              fontWeight: 500,
              color: '#fff',
              background: 'linear-gradient(180deg, #4c97fe 0%, #007AFF 100%)',
              border: 'none',
              borderRadius: 4,
              padding: '7px 20px',
              cursor: 'default',
            }}
          >
            Reopen
          </button>
        </div>
      </div>
    </div>
  )
}
