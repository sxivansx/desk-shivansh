'use client'

import { useState, useCallback } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'

const EXP_LOGOS: Record<string, string> = {
  'Remotestar': '/yosemite-icons/skills/rs.png',
  'Prauga': '/yosemite-icons/skills/prauga.png',
  'IICT': '/yosemite-icons/skills/compiles-technology.png',
}

const SKILL_ICONS: Record<string, string> = {
  'React': '/yosemite-icons/skills/react.png',
  'Next.js': '/yosemite-icons/skills/nextjs.png',
  'TypeScript': '/yosemite-icons/skills/typescript.png',
  'Tailwind CSS': '/yosemite-icons/skills/tailwind-css.png',
  'HTML': '/yosemite-icons/skills/html.png',
  'CSS': '/yosemite-icons/skills/css.png',
  'Git': '/yosemite-icons/skills/git.png',
  'GitHub': '/yosemite-icons/skills/github.png',
  'Vercel': '/yosemite-icons/skills/vercel.png',
  'Figma': '/yosemite-icons/skills/figma.png',
  'Framer': '/yosemite-icons/skills/framer.png',
  'Illustrator': '/yosemite-icons/skills/illustrator.png',
  'Photoshop': '/yosemite-icons/skills/photoshop.png',
  'Premiere Pro': '/yosemite-icons/skills/premiere-pro.png',
  'After Effects': '/yosemite-icons/skills/after-effects.png',
  'InDesign': '/yosemite-icons/skills/indesign.png',
  'Blender': '/yosemite-icons/skills/blender.png',
  'Postman': '/yosemite-icons/skills/postman.png',
  'Firebase': '/yosemite-icons/skills/firebase.png',
  'MongoDB': '/yosemite-icons/skills/mongodb.png',
  'Docker': '/yosemite-icons/skills/docker.png',
}

export default function AboutWindow() {
  const { name, role, bio, education, coCurricular, skills, experience } = PORTFOLIO_CONTENT
  const [activeTab, setActiveTab] = useState('Overview')
  const [expandedExp, setExpandedExp] = useState<string | null>(null)
  const toggleExp = useCallback((company: string) => {
    setExpandedExp(prev => prev === company ? null : company)
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#ececec',
    }}>
      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 1,
        padding: '10px 0 0',
        background: '#ececec',
        borderBottom: '1px solid #d4d4d4',
      }}>
        {['Overview', 'Skills', 'Experience', 'Education', 'Co-Curricular'].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '4px 14px',
              fontSize: 11,
              background: activeTab === tab ? '#ffffff' : 'transparent',
              border: activeTab === tab ? '1px solid #d4d4d4' : '1px solid transparent',
              borderBottom: activeTab === tab ? '1px solid #ffffff' : '1px solid transparent',
              borderRadius: '4px 4px 0 0',
              marginBottom: -1,
              color: activeTab === tab ? '#333' : '#777',
              cursor: 'pointer',
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        background: '#ffffff',
        overflowY: 'auto',
      }}>
        {activeTab === 'Overview' && (
          <div style={{ display: 'flex', padding: '24px 28px', gap: 20 }}>
            {/* Left Icon */}
            <img
              src="/shivansh.jpeg"
              alt={name}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
                boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15)',
              }}
            />

            {/* Right Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <h1 style={{ fontSize: 22, fontWeight: 300, color: '#333', margin: '0 0 2px 0', letterSpacing: -0.3 }}>
                {name}
              </h1>
              <p style={{ fontSize: 12, color: '#666', margin: '0 0 12px 0', fontWeight: 500 }}>
                {role}
              </p>

              <div style={{ width: '100%', height: 1, background: '#e5e5e5', margin: '0 0 12px 0' }} />

              <p style={{ fontSize: 11, lineHeight: 1.6, color: '#444', margin: '0 0 16px 0' }}>
                {bio}
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <MacButton>System Report...</MacButton>
                <MacButton>Software Update...</MacButton>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Education' && (
          <div style={{ padding: '24px 28px' }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: '#333', margin: '0 0 4px 0' }}>
              {education.institution}
            </h3>
            <p style={{ fontSize: 12, color: '#666', margin: '0 0 2px 0' }}>
              B.E. in {education.field}
            </p>
            <p style={{ fontSize: 11, color: '#888', margin: '0 0 2px 0' }}>
              {education.years}
            </p>
            {education.cgpa && (
              <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
                CGPA: {education.cgpa}
              </p>
            )}
          </div>
        )}

        {activeTab === 'Co-Curricular' && (
          <div style={{ padding: '24px 28px' }}>
            <ul style={{
              margin: 0,
              paddingLeft: 16,
              fontSize: 11,
              lineHeight: 1.8,
              color: '#444',
            }}>
              {coCurricular.map((item: string, i: number) => (
                <li key={i} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Frontend */}
            <div style={{ paddingBottom: 16, borderBottom: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 10 }}>Frontend</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                {skills.frontend.map((skill: string) => (
                  <SkillIcon key={skill} name={skill} />
                ))}
              </div>
            </div>

            {/* Dev Tools */}
            <div style={{ paddingBottom: 16, borderBottom: '1px solid #e5e5e5' }}>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 10 }}>Dev Tools</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                {skills.devTools.map((tool: string) => (
                  <SkillIcon key={tool} name={tool} />
                ))}
              </div>
            </div>

            {/* Design Tools */}
            <div>
              <div style={{ fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 10 }}>Design Tools</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                {skills.tools.map((tool: string) => (
                  <SkillIcon key={tool} name={tool} />
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'Experience' && (
          <div style={{ padding: '20px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {experience.map((exp: { company: string; role: string; highlights: string[] }) => {
                const isOpen = expandedExp === exp.company
                return (
                  <div key={exp.company} style={{ background: '#f8f8f8', borderRadius: 8, border: '1px solid #e5e5e5', overflow: 'hidden' }}>
                    <div
                      onClick={() => toggleExp(exp.company)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', cursor: 'pointer' }}
                    >
                      {EXP_LOGOS[exp.company] ? (
                        <img src={EXP_LOGOS[exp.company]} alt={exp.company} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
                      ) : (
                        <div style={{ width: 32, height: 32, borderRadius: 6, background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                          {exp.company[0]}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{exp.company}</div>
                        <div style={{ fontSize: 10, color: '#666' }}>{exp.role}</div>
                      </div>
                      <span style={{ fontSize: 10, color: '#999', transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
                    </div>
                    {isOpen && exp.highlights.length > 0 && (
                      <div style={{ padding: '0 12px 10px 56px' }}>
                        <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, lineHeight: 1.7, color: '#555', listStyleType: 'disc' }}>
                          {exp.highlights.map((h: string, i: number) => (
                            <li key={i} style={{ marginBottom: 2 }}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const FALLBACK_COLORS: Record<string, string> = {
  'React': '#61dafb', 'JavaScript': '#f7df1e', 'VS Code': '#007acc',
  'Brand Design': '#f093fb', 'UI/UX Design': '#f5576c', 'Product Design': '#a259ff', 'Graphic Design': '#ff9a00',
}

function SkillIcon({ name }: { name: string }) {
  const icon = SKILL_ICONS[name]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      {icon ? (
        <div style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <img src={icon} alt={name} style={{ width: '100%', height: '100%', display: 'block', transform: 'scale(1.15)' }} />
        </div>
      ) : (
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: FALLBACK_COLORS[name] || '#007AFF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16, fontWeight: 600, boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
        }}>
          {name[0]}
        </div>
      )}
      <span style={{ fontSize: 10, color: '#333', textAlign: 'center' }}>{name}</span>
    </div>
  )
}

function MacButton({ children }: { children: React.ReactNode }) {
  return (
    <button style={{
      padding: '3px 12px',
      fontSize: 11,
      background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
      border: '1px solid #ccc',
      borderRadius: 4,
      color: '#333',
      boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
      cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}
