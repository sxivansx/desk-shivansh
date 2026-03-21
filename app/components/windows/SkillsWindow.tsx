'use client'

import { PORTFOLIO_CONTENT } from '../../content'

export default function SkillsWindow() {
  const { skills, experience } = PORTFOLIO_CONTENT

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ececec' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        background: '#ececec',
        borderBottom: '1px solid #d4d4d4',
        gap: 16,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
        
        <button style={{
          padding: '2px 12px',
          background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
          border: '1px solid #ccc',
          borderRadius: 4,
          fontSize: 12,
          color: '#333',
          boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }}>
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
          Show All
        </button>

        <div style={{ flex: 1 }} />
        
        <div style={{ position: 'relative' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 6, top: 5 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search" style={{
            width: 140,
            padding: '3px 8px 3px 22px',
            fontSize: 11,
            border: '1px solid #ccc',
            borderRadius: 12,
            outline: 'none',
          }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 40px' }}>
        
        {/* Tools */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #d4d4d4' }}>
          <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666', fontWeight: 500, paddingTop: 8 }}>Tools</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, flex: 1 }}>
            {skills.tools.map(tool => (
              <div key={tool} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: getToolColor(tool),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 20, fontWeight: 600, boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  {tool[0]}
                </div>
                <span style={{ fontSize: 11, color: '#333', textAlign: 'center' }}>{tool}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Design */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #d4d4d4' }}>
          <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666', fontWeight: 500, paddingTop: 8 }}>Design</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, flex: 1 }}>
            {skills.design.map(skill => (
              <div key={skill} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 16, fontWeight: 600, boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <span style={{ fontSize: 11, color: '#333', textAlign: 'center' }}>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 80, textAlign: 'right', fontSize: 12, color: '#666', fontWeight: 500, paddingTop: 8 }}>Experience</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            {experience.map(exp => (
              <div key={exp.company} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: '12px 16px', borderRadius: 8, border: '1px solid #d4d4d4' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 600 }}>
                  {exp.company[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{exp.company}</div>
                  <div style={{ fontSize: 11, color: '#666' }}>{exp.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}


function getToolColor(tool: string): string {
  const colors: Record<string, string> = {
    'Figma': '#a259ff', 'Framer': '#0055ff', 'Illustrator': '#ff9a00',
    'Photoshop': '#31a8ff', 'Premiere Pro': '#9999ff', 'After Effects': '#9999ff',
    'InDesign': '#ff3366', 'Cinema 4D': '#011a6a',
  }
  return colors[tool] || 'var(--color-accent)'
}
