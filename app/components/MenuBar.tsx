'use client'

import { useEffect, useState } from 'react'
import { useRetroSound } from './hooks/useRetroSound'

interface Props {
  isMuted: boolean
  onToggleMute: () => void
  activeApp: string
}

export default function MenuBar({ isMuted, onToggleMute, activeApp }: Props) {
  const [time, setTime] = useState('')
  const sound = useRetroSound()

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const h = d.getHours() % 12 || 12
      const m = String(d.getMinutes()).padStart(2, '0')
      const ap = d.getHours() >= 12 ? 'PM' : 'AM'
      setTime(`${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}  ${h}:${m} ${ap}`)
    }
    tick()
    const id = setInterval(tick, 10_000)
    return () => clearInterval(id)
  }, [])

  const menus = activeApp === 'Finder'
    ? ['File', 'Edit', 'View', 'Go', 'Window', 'Help']
    : ['File', 'Edit', 'View', 'Window', 'Help']

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 24,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      background: 'var(--color-menubar-bg)',
      backdropFilter: 'blur(30px) saturate(1.8)',
      WebkitBackdropFilter: 'blur(30px) saturate(1.8)',
      borderBottom: '0.5px solid var(--color-menubar-border)',
      userSelect: 'none',
      fontSize: 13,
      fontWeight: 400,
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    }}>
      {/* Apple logo */}
      <span 
        style={{ padding: '0 10px 0 12px', cursor: 'default', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => sound.playHover()}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-text-primary)" style={{ opacity: 0.85 }}>
          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
        </svg>
      </span>

      {/* Active app name */}
      <span 
        style={{
          fontWeight: 700,
          padding: '0 10px 0 0',
          cursor: 'default',
          fontSize: 13,
        }}
        onMouseEnter={() => sound.playHover()}
      >
        {activeApp}
      </span>

      {/* Menu items */}
      {menus.map(m => (
        <span
          key={m}
          style={{
            padding: '2px 10px',
            cursor: 'default',
            borderRadius: 3,
          }}
          onMouseEnter={e => {
            sound.playHover()
            ;(e.target as HTMLElement).style.background = 'var(--color-bg-hover)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.background = 'transparent'
          }}
        >
          {m}
        </span>
      ))}

      <div style={{ flex: 1 }} />

      {/* Right-side icons */}
      <button
        onClick={() => {
          sound.playClick()
          onToggleMute()
        }}
        onMouseEnter={() => sound.playHover()}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'default',
          padding: '0 6px',
          fontSize: 12,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          color: 'var(--color-text-primary)',
        }}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isMuted ? (
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : (
            <>
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </>
          )}
        </svg>
      </button>

      {/* Wi-Fi icon */}
      <span 
        style={{ padding: '0 6px', cursor: 'default', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => sound.playHover()}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="var(--color-text-primary)" />
        </svg>
      </span>

      {/* Battery icon */}
      <span 
        style={{ padding: '0 6px', cursor: 'default', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => sound.playHover()}
      >
        <svg width="18" height="12" viewBox="0 0 26 14" fill="none">
          <rect x="0.5" y="1" width="22" height="12" rx="2" stroke="var(--color-text-primary)" strokeWidth="1.2" />
          <rect x="23.5" y="4.5" width="2" height="5" rx="1" fill="var(--color-text-primary)" opacity="0.5" />
          <rect x="2" y="2.5" width="16" height="9" rx="1" fill="var(--color-text-primary)" opacity="0.3" />
        </svg>
      </span>

      {/* Search icon */}
      <span 
        style={{ padding: '0 8px', cursor: 'default', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => sound.playHover()}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      {/* Clock */}
      <span 
        style={{
          padding: '0 10px 0 4px',
          cursor: 'default',
          color: 'var(--color-text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}
        onMouseEnter={() => sound.playHover()}
      >
        {time}
      </span>
    </div>
  )
}
