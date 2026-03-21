'use client'

import { useRef, useState } from 'react'

interface Props {
  filename: string
}

export default function VideoPlayer({ filename }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [hasSource, setHasSource] = useState(true)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  if (!hasSource) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: '#1a1a1a',
        color: 'rgba(255, 255, 255, 0.5)',
        gap: 12,
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21" />
        </svg>
        <span style={{ fontSize: 12 }}>{filename}</span>
        <span style={{ fontSize: 11, opacity: 0.6 }}>No video file found</span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#000' }}>
      {/* Video */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={`/videos/${filename}`}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          onTimeUpdate={() => {
            if (videoRef.current) setProgress(videoRef.current.currentTime)
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration)
          }}
          onError={() => setHasSource(false)}
          onEnded={() => setIsPlaying(false)}
        />

        {!isPlaying && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" stroke="none">
                <polygon points="6 3 20 12 6 21" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{
        padding: '6px 12px 8px',
        background: 'rgba(30, 30, 30, 0.95)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 30 }}>
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={e => {
              const v = parseFloat(e.target.value)
              setProgress(v)
              if (videoRef.current) videoRef.current.currentTime = v
            }}
            style={{
              flex: 1,
              height: 3,
              appearance: 'none',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 2,
              outline: 'none',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', minWidth: 30, textAlign: 'right' }}>
            {formatTime(duration)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <button
            onClick={togglePlay}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)">
                <polygon points="6 3 20 12 6 21" />
              </svg>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={e => {
                const v = parseFloat(e.target.value)
                setVolume(v)
                if (videoRef.current) videoRef.current.volume = v
              }}
              style={{
                width: 60,
                height: 3,
                appearance: 'none',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 2,
                outline: 'none',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
