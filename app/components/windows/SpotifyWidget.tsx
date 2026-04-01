'use client'

import { useCallback, useEffect, useState } from 'react'

interface TrackData {
  isPlaying: boolean
  track: string | null
  artist: string | null
  albumArt: string | null
  progress: number
  duration: number
  url: string | null
}

export default function SpotifyWidget() {
  const [data, setData] = useState<TrackData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTrack = useCallback(async () => {
    try {
      const res = await fetch('/api/spotify')
      if (res.ok) setData(await res.json())
    } catch {
      /* silently fail */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrack()
    const id = setInterval(fetchTrack, 10_000)
    return () => clearInterval(id)
  }, [fetchTrack])

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  const timeStr = data?.isPlaying && data.duration > 0
    ? formatTime(data.progress)
    : ''

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#1a1a1a',
      borderRadius: '0 0 6px 6px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      {/* Album art area */}
      <div style={{
        position: 'relative',
        width: '100%',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
        background: '#0d0d0d',
        borderBottom: '2px solid #0a0a0a',
      }}>
        {loading ? (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#555',
            fontSize: 12,
          }}>
            Connecting...
          </div>
        ) : data?.albumArt ? (
          <img
            src={data.albumArt}
            alt="Album art"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/yosemite-icons/spotify.png"
              alt="Spotify"
              style={{ width: 48, height: 48, opacity: 0.3, filter: 'grayscale(100%)' }}
            />
          </div>
        )}

        {/* Track info overlay at bottom of art */}
        {data?.track && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px 12px 8px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              minWidth: 0,
              flex: 1,
            }}>
              {data.isPlaying && (
                <div style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#ff3b30',
                  flexShrink: 0,
                  boxShadow: '0 0 4px rgba(255,59,48,0.6)',
                  animation: 'pulse 1.5s ease infinite',
                }} />
              )}
              <span style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                letterSpacing: '0.3px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}>
                {data.isPlaying ? 'Playing now' : 'Last played'} — {data.track}
              </span>
            </div>
            {timeStr && (
              <span style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 400,
                flexShrink: 0,
                marginLeft: 8,
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}>
                {timeStr}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Speaker grille */}
      <div style={{
        width: '100%',
        padding: '6px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1a1a1a',
      }}>
        <div style={{
          width: '70%',
          height: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3px',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} style={{
              width: '2px',
              height: '2px',
              borderRadius: '50%',
              background: '#333',
            }} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: 6,
        padding: '4px 10px 10px',
        background: '#1a1a1a',
      }}>
        {/* Previous */}
        <button style={{
          flex: 1,
          height: 44,
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
          border: '1px solid #333',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button style={{
          flex: 1,
          height: 44,
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
          border: '1px solid #333',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          {data?.isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button style={{
          flex: 1,
          height: 44,
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%)',
          border: '1px solid #333',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      {/* Spotify link */}
      {data?.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: '0 10px 8px',
            fontSize: 9,
            color: '#1DB954',
            textDecoration: 'none',
            fontWeight: 500,
            letterSpacing: '0.3px',
          }}
        >
          <img src="/yosemite-icons/spotify.png" alt="" style={{ width: 10, height: 10 }} />
          Open in Spotify
        </a>
      )}
    </div>
  )
}
