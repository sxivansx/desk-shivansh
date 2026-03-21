'use client'

import { useState } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'

export default function ProjectsWindow() {
  const { projects } = PORTFOLIO_CONTENT
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', height: '100%' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: 'rgba(0, 122, 255, 0.1)', borderRadius: 4, color: '#007AFF', fontSize: 12, fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Projects
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', color: '#333', fontSize: 12, marginTop: 2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', color: '#333', fontSize: 12, marginTop: 2 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Documents
          </div>
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
          
          <div style={{ display: 'flex', gap: 1, background: '#fff', border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ padding: '2px 8px', background: '#e0e0e0', borderRight: '1px solid #ccc' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div style={{ padding: '2px 8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </div>
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
            {projects.map(project => {
              const isHovered = hoveredId === project.id
              return (
                <a
                  key={project.id}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
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
                    <img src="/yosemite-icons/GenericFolderIcon.png" alt="Folder" style={{ width: 64, height: 64, objectFit: 'contain' }} />
                  </div>
                  
                  <span style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: isHovered ? '#fff' : '#333',
                    background: isHovered ? '#007AFF' : 'transparent',
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
                </a>
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
          {projects.length} items
        </div>
      </div>
    </div>
  )
}

