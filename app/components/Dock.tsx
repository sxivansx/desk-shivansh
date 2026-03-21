'use client'

import { useRef, type ReactNode } from 'react'
import { useRetroSound } from './hooks/useRetroSound'

export interface DockEntry {
  id: string
  label: string
  icon: ReactNode
  isOpen?: boolean
}

interface Props {
  apps: DockEntry[]
  files?: DockEntry[]
  onOpen: (id: string) => void
}

export default function Dock({ apps, files = [], onOpen }: Props) {
  const dockRef = useRef<HTMLDivElement>(null)
  const sound = useRetroSound()

  return (
    <div
      ref={dockRef}
      style={{
        position: 'fixed',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        zIndex: 9000,
        padding: '4px 8px',
        background: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: 12,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        userSelect: 'none',
      }}
    >
      {apps.map(item => (
        <DockIcon key={item.id} item={item} onClick={() => onOpen(item.id)} sound={sound} />
      ))}

      {files.length > 0 && (
        <div style={{
          width: 1,
          height: 32,
          background: 'rgba(255, 255, 255, 0.3)',
          margin: '0 5px',
          alignSelf: 'center',
        }} />
      )}

      {files.map(item => (
        <DockIcon key={item.id} item={item} onClick={() => onOpen(item.id)} sound={sound} />
      ))}
    </div>
  )
}

function DockIcon({ item, onClick, sound }: { item: DockEntry; onClick: () => void; sound: ReturnType<typeof useRetroSound> }) {
  return (
    <div
      onClick={() => {
        sound.playClick()
        onClick()
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        padding: '0 1px',
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
      onMouseEnter={e => {
        sound.playHover()
        const el = e.currentTarget
        el.style.transform = 'translateY(-10px) scale(1.25)'
        const tip = el.querySelector('[data-tooltip]') as HTMLElement
        if (tip) tip.style.opacity = '1'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform = ''
        const tip = el.querySelector('[data-tooltip]') as HTMLElement
        if (tip) tip.style.opacity = '0'
      }}
    >
      {/* Tooltip */}
      <div
        data-tooltip
        style={{
          position: 'absolute',
          top: -28,
          background: 'rgba(30, 30, 30, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: 'var(--color-text-inverse)',
          fontSize: 11,
          fontWeight: 500,
          padding: '3px 10px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.15s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        {item.label}
      </div>

      {/* Icon */}
      <div style={{
        width: 46,
        height: 46,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {item.icon}
      </div>

      {/* Open indicator */}
      {item.isOpen && (
        <div style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.8)',
          marginTop: 2,
        }} />
      )}
    </div>
  )
}
