'use client'

import { useCallback, useRef, type ReactNode } from 'react'
import { useRetroSound } from './hooks/useRetroSound'

interface Props {
  title: string
  isOpen: boolean
  position: { x: number; y: number }
  size: { w: number; h: number }
  zIndex: number
  isActive: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  children: ReactNode
  sidebar?: ReactNode
}

export default function Window({
  title, isOpen, position, size, zIndex, isActive,
  onClose, onFocus, onMove, children, sidebar,
}: Props) {
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const sound = useRetroSound()

  const onTitleDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    e.preventDefault()
    sound.playClick()
    onFocus()
    drag.current = { sx: e.clientX, sy: e.clientY, ox: position.x, oy: position.y }

    const mm = (ev: MouseEvent) => {
      if (!drag.current) return
      onMove(
        Math.max(0, drag.current.ox + ev.clientX - drag.current.sx),
        Math.max(0, drag.current.oy + ev.clientY - drag.current.sy),
      )
    }
    const mu = () => {
      drag.current = null
      document.removeEventListener('mousemove', mm)
      document.removeEventListener('mouseup', mu)
    }
    document.addEventListener('mousemove', mm)
    document.addEventListener('mouseup', mu)
  }, [position, onFocus, onMove, sound])

  if (!isOpen) return null

  const inactive = !isActive

  return (
    <div
      onMouseDown={() => {
        sound.playClick()
        onFocus()
      }}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: Math.max(size.w, 300),
        height: Math.max(size.h, 180),
        zIndex,
        borderRadius: 'var(--radius-window)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(246, 246, 246, 0.4)',
        backdropFilter: 'blur(50px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(50px) saturate(1.8)',
        border: '0.5px solid var(--color-border)',
        boxShadow: isActive ? 'var(--shadow-window)' : 'var(--shadow-window-inactive)',
        transition: 'box-shadow 0.2s ease',
        userSelect: 'none',
        animation: 'windowOpen 0.2s ease-out',
      }}
    >
      {/* Title bar - Yosemite style */}
      <div
        onMouseDown={onTitleDown}
        style={{
          height: 28,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          background: isActive
            ? 'linear-gradient(180deg, rgba(232, 232, 232, 0.6) 0%, rgba(210, 210, 210, 0.6) 100%)'
            : 'rgba(246, 246, 246, 0.6)',
          borderBottom: `0.5px solid ${isActive ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.06)'}`,
          cursor: 'default',
        }}
      >
        {/* Traffic lights */}
        <div
          onMouseDown={e => e.stopPropagation()}
          style={{ display: 'flex', gap: 8, paddingLeft: 12, alignItems: 'center' }}
          className="traffic-group"
        >
          <TrafficDot
            color={inactive ? 'var(--color-traffic-inactive)' : 'var(--color-traffic-close)'}
            symbol="×"
            onClick={e => { e.stopPropagation(); onClose() }}
            onMouseEnter={() => sound.playHover()}
            inactive={inactive}
          />
          <TrafficDot
            color={inactive ? 'var(--color-traffic-inactive)' : 'var(--color-traffic-minimize)'}
            symbol="−"
            onMouseEnter={() => sound.playHover()}
            inactive={inactive}
          />
          <TrafficDot
            color={inactive ? 'var(--color-traffic-inactive)' : 'var(--color-traffic-maximize)'}
            symbol="+"
            onMouseEnter={() => sound.playHover()}
            inactive={inactive}
          />
        </div>

        {/* Title */}
        <div style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: inactive ? 400 : 500,
          color: inactive ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
          paddingRight: 52,
          letterSpacing: 0.2,
        }}>
          {title}
        </div>
      </div>

      {/* Content area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
      }}>
        {sidebar && (
          <div style={{
            width: 150,
            flexShrink: 0,
            background: 'transparent',
            borderRight: '0.5px solid var(--color-border-light)',
            overflowY: 'auto',
            padding: '6px 0',
          }}>
            {sidebar}
          </div>
        )}

        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          userSelect: 'text',
          background: '#ffffff',
        }}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── Traffic Light Dot ───────────────────────────────────── */
function TrafficDot({ color, symbol, onClick, onMouseEnter, inactive }: {
  color: string
  symbol: string
  onClick?: (e: React.MouseEvent) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  inactive?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`traffic-dot ${inactive ? 'inactive' : ''}`}
      style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: color,
        border: `0.5px solid ${inactive ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.12)'}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        fontSize: 9,
        lineHeight: 1,
        color: 'transparent',
        fontWeight: 700,
        transition: 'color 0.1s ease',
      }}
      onMouseEnter={e => {
        if (onMouseEnter) onMouseEnter(e)
        ;(e.target as HTMLElement).style.color = 'rgba(0, 0, 0, 0.5)'
      }}
      onMouseLeave={e => {
        (e.target as HTMLElement).style.color = 'transparent'
      }}
    >
      {symbol}
    </button>
  )
}
