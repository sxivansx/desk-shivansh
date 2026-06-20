'use client'

import { useEffect, useState } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'
import { useRetroSound } from '../hooks/useRetroSound'

type Category = 'design' | 'dev'

interface Item {
  id: string
  name: string
  description: string
  tech: string[]
  url: string
}

function sourceLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace('www.', '')
    if (host.includes('behance')) return 'View on Behance'
    if (host.includes('dev.to')) return 'Read the case study'
    if (host.includes('github')) return 'View on GitHub'
    if (host.includes('railway') || host.includes('vercel')) return 'Open live site'
  } catch {
    /* ignore */
  }
  return 'Open project'
}

export default function ProjectsWindow() {
  const { projects, codingProjects } = PORTFOLIO_CONTENT
  const [category, setCategory] = useState<Category>('design')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sound = useRetroSound()

  const designItems: Item[] = projects.map(p => ({
    id: p.id, name: p.name, description: p.description, tech: p.tech, url: p.url,
  }))
  const devItems: Item[] = codingProjects.map(p => ({
    id: p.name, name: p.name, description: p.description, tech: p.tech, url: p.repo,
  }))

  const items = category === 'design' ? designItems : devItems
  const folderIcon = category === 'design'
    ? '/yosemite-icons/GenericFolderIcon.png'
    : '/yosemite-icons/DeveloperFolderIcon.png'

  const selected = items.find(p => p.id === selectedId) ?? null

  const switchCategory = (next: Category) => {
    if (next === category) return
    sound.playClick()
    setCategory(next)
    setSelectedId(null)
    setHoveredId(null)
  }

  const closeQuickLook = () => {
    sound.playClick()
    setSelectedId(null)
  }

  // Quick Look closes on Escape (matches macOS).
  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedId(null)
        sound.playClick()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, sound])

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      {/* Finder Sidebar */}
      <div style={{
        width: 150,
        flexShrink: 0,
        background: 'transparent',
        borderRight: '1px solid rgba(0,0,0,0.1)',
        padding: '10px 0',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 12px', marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.4)', margin: '0 0 6px 0' }}>Favorites</p>

          <SidebarItem
            active={category === 'design'}
            label="Design Projects"
            onClick={() => switchCategory('design')}
            onHover={() => sound.playHover()}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            }
          />
          <SidebarItem
            active={category === 'dev'}
            label="Dev Projects"
            onClick={() => switchCategory('dev')}
            onHover={() => sound.playHover()}
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            }
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          background: '#f6f6f6',
          borderBottom: '1px solid #d4d4d4',
          gap: 16,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>
            {category === 'design' ? 'Design Projects' : 'Dev Projects'}
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ position: 'relative' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 6, top: 5 }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" placeholder="Search" style={{
              width: 120,
              padding: '3px 8px 3px 22px',
              fontSize: 11,
              border: '1px solid #ccc',
              borderRadius: 12,
              outline: 'none',
            }} />
          </div>
        </div>

        {/* Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 24,
          }}>
            {items.map(project => {
              const isHovered = hoveredId === project.id
              const isSelected = selectedId === project.id
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => { sound.playClick(); setSelectedId(project.id) }}
                  onMouseEnter={() => { setHoveredId(project.id); sound.playHover() }}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    font: 'inherit',
                    color: 'inherit',
                    cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 0,
                  }}
                >
                  <div style={{
                    width: 72,
                    height: 72,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.1s ease',
                    marginBottom: 8,
                  }}>
                    <img src={folderIcon} alt="Folder" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                  </div>

                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: (isHovered || isSelected) ? '#fff' : '#333',
                    background: (isHovered || isSelected) ? '#007AFF' : 'transparent',
                    padding: '2px 6px',
                    borderRadius: 4,
                    textAlign: 'center',
                    lineHeight: 1.2,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {project.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Status Bar */}
        <div style={{
          padding: '4px 12px',
          background: '#f6f6f6',
          borderTop: '1px solid #d4d4d4',
          fontSize: 11,
          color: '#777',
          textAlign: 'center',
        }}>
          {selected ? selected.name : `${items.length} items`}
        </div>
      </div>

      {/* Quick Look */}
      {selected && (
        <div
          onClick={closeQuickLook}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.18)',
            zIndex: 20,
            animation: 'fadeIn 0.12s ease-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 360,
              maxWidth: '86%',
              background: '#ffffff',
              border: '1px solid #d4d4d4',
              borderRadius: 8,
              boxShadow: '0 18px 50px rgba(0,0,0,0.32)',
              overflow: 'hidden',
              animation: 'scaleIn 0.14s ease-out',
            }}
          >
            {/* Quick Look header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 18px',
              borderBottom: '1px solid #eee',
            }}>
              <img src={folderIcon} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1d1d1f' }}>{selected.name}</span>
                <span style={{ fontSize: 11, color: '#6e6e73' }}>{selected.tech.join(' · ')}</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: '#3a3a3c' }}>
                {selected.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selected.tech.map(t => (
                  <span key={t} style={{
                    fontSize: 11,
                    color: '#007AFF',
                    background: 'rgba(0,122,255,0.08)',
                    border: '1px solid rgba(0,122,255,0.15)',
                    borderRadius: 3,
                    padding: '2px 8px',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              padding: '12px 18px',
              borderTop: '1px solid #eee',
              background: '#fafafa',
            }}>
              <button
                type="button"
                onClick={closeQuickLook}
                onMouseEnter={() => sound.playHover()}
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#333',
                  background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: '6px 14px',
                  cursor: 'default',
                  boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                }}
              >
                Done
              </button>
              {selected.url && (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#fff',
                    background: 'linear-gradient(180deg, #4c97fe 0%, #007AFF 100%)',
                    borderRadius: 4,
                    padding: '6px 14px',
                    textDecoration: 'none',
                  }}
                >
                  {sourceLabel(selected.url)} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarItem({
  active,
  label,
  icon,
  onClick,
  onHover,
}: {
  active: boolean
  label: string
  icon: React.ReactNode
  onClick: () => void
  onHover: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      style={{
        appearance: 'none',
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 8px',
        marginTop: 2,
        borderRadius: 4,
        border: 'none',
        cursor: 'default',
        font: 'inherit',
        fontSize: 12,
        fontWeight: active ? 500 : 400,
        background: active ? 'rgba(0, 122, 255, 0.1)' : 'transparent',
        color: active ? '#007AFF' : '#333',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
