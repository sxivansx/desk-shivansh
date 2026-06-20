'use client'

import { useEffect } from 'react'

const WALLPAPER =
  'linear-gradient(175deg,#1e3156 0%,#3d4a7a 8%,#6e5488 16%,#a45d7e 24%,#d4756a 32%,#e89872 40%,#f0b87a 48%,#e8c88a 56%,#c4b07a 64%,#8a9a6a 72%,#5a7a52 80%,#3a5a3a 88%,#1e3620 100%)'

// global-error replaces the root layout, so it must render its own <html>/<body>
// and cannot rely on globals.css — all styles are inline.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
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
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 22px 70px rgba(0,0,0,0.35)',
              background: '#f6f6f6',
            }}
          >
            <div
              style={{
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(180deg, #e8e8e8 0%, #d2d2d2 100%)',
                borderBottom: '1px solid rgba(0,0,0,0.12)',
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
                The system encountered a problem.
              </h2>
              <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#6e6e73', lineHeight: 1.5 }}>
                The desktop failed to start. Try reloading.
              </p>

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
                Reload
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
