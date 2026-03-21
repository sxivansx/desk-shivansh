'use client'

import { useState } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'

export default function ResumeViewer() {
  const [pdfFailed, setPdfFailed] = useState(false)
  const [zoom, setZoom] = useState(100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 12px',
        background: '#ececec',
        borderBottom: '1px solid #d4d4d4',
        gap: 8,
        flexShrink: 0,
      }}>
        <ToolbarButton label="-" onClick={() => setZoom(z => Math.max(50, z - 25))} />
        <span style={{
          fontSize: 11,
          color: 'var(--color-text-secondary)',
          minWidth: 36,
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {zoom}%
        </span>
        <ToolbarButton label="+" onClick={() => setZoom(z => Math.min(200, z + 25))} />
        <div style={{ flex: 1 }} />
        <ToolbarButton label="Print" onClick={() => window.print()} />
        <a
          href={PORTFOLIO_CONTENT.contact.cv}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            color: '#333',
            textDecoration: 'none',
            padding: '2px 10px',
            borderRadius: 4,
            border: '1px solid #ccc',
            background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
            lineHeight: '18px',
          }}
        >
          Download
        </a>
      </div>

      {/* PDF viewer */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        background: '#525659',
        display: 'flex',
        justifyContent: 'center',
        padding: 20,
      }}>
        {!pdfFailed ? (
          <div style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
          }}>
            <iframe
              src="/resume.pdf"
              title="Resume"
              style={{
                width: 500,
                height: 700,
                border: 'none',
                background: 'var(--color-bg-content)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
              }}
              onError={() => setPdfFailed(true)}
            />
          </div>
        ) : (
          <ResumeFallback />
        )}
      </div>
    </div>
  )
}

function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12,
        color: '#333',
        background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
        border: '1px solid #ccc',
        borderRadius: 4,
        padding: '2px 10px',
        cursor: 'pointer',
        lineHeight: '18px',
        boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
      }}
    >
      {label}
    </button>
  )
}

function ResumeFallback() {
  const { experience, education, skills, contact } = PORTFOLIO_CONTENT

  return (
    <div style={{
      width: 500,
      background: 'var(--color-bg-content)',
      padding: '40px 36px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
      fontSize: 12,
      color: 'var(--color-text-primary)',
      lineHeight: 1.5,
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px 0' }}>{PORTFOLIO_CONTENT.name}</h1>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', margin: '0 0 4px 0' }}>{PORTFOLIO_CONTENT.role}</p>
      <p style={{ fontSize: 10, color: 'var(--color-text-tertiary)', margin: '0 0 20px 0' }}>
        {contact.email} | {contact.linkedin}
      </p>

      <FallbackSection title="Experience">
        {experience.map(exp => (
          <div key={exp.company} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>{exp.company}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{exp.role}</span>
            </div>
            <ul style={{ margin: '4px 0 0', paddingLeft: 16 }}>
              {exp.highlights.map((h, i) => (
                <li key={i} style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 2 }}>{h}</li>
              ))}
            </ul>
          </div>
        ))}
      </FallbackSection>

      <FallbackSection title="Education">
        <p style={{ margin: 0 }}>
          <strong>{education.institution}</strong> — {education.field} ({education.years})
        </p>
      </FallbackSection>

      <FallbackSection title="Skills">
        <p style={{ margin: 0, fontSize: 11 }}>
          {[...skills.design, ...skills.tools].join(' \u2022 ')}
        </p>
      </FallbackSection>
    </div>
  )
}

function FallbackSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        margin: '16px 0 8px 0',
        paddingBottom: 4,
        borderBottom: '1px solid var(--color-border-light)',
      }}>
        {title}
      </h2>
      {children}
    </>
  )
}
