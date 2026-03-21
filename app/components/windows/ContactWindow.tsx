'use client'

import { useState } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'

export default function ContactWindow() {
  const { contact, name, role } = PORTFOLIO_CONTENT

  return (
    <div style={{ display: 'flex', height: '100%', background: '#ffffff' }}>
      {/* Sidebar (List of contacts) */}
      <div style={{
        width: 140,
        flexShrink: 0,
        background: 'transparent',
        borderRight: '1px solid #d4d4d4',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ padding: '6px 8px', borderBottom: '1px solid #d4d4d4', background: '#f6f6f6' }}>
          <input type="text" placeholder="Search" style={{
            width: '100%',
            padding: '3px 8px',
            fontSize: 11,
            border: '1px solid #ccc',
            borderRadius: 12,
            outline: 'none',
          }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{
            padding: '6px 10px',
            background: '#007AFF',
            color: '#fff',
            fontSize: 11,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', color: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, flexShrink: 0 }}>
              {name[0]}
            </div>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
          </div>
        </div>
      </div>

      {/* Main Contact Card */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', background: '#ffffff' }}>
        {/* Header */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'center' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 300,
            color: '#fff',
            flexShrink: 0,
          }}>
            {name[0]}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 400, color: '#333', margin: '0 0 2px 0' }}>
              {name}
            </h2>
            <p style={{ fontSize: 11, color: '#888', margin: 0 }}>
              {role}
            </p>
          </div>
        </div>

        {/* Contact rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <ContactRow label="email" value={contact.email} href={`mailto:${contact.email}`} />
          <ContactRow label="behance" value={contact.behance} href={`https://${contact.behance}`} />
          <ContactRow label="linkedin" value={contact.linkedin} href={`https://${contact.linkedin}`} />
          <ContactRow label="twitter" value={contact.twitter} href={`https://twitter.com/${contact.twitter.replace('@', '')}`} />
          <ContactRow label="instagram" value={contact.instagram} href={`https://${contact.instagram}`} />
        </div>

        <div style={{ height: 1, background: '#eee', margin: '16px 0' }} />

        <div style={{ display: 'flex', gap: 10 }}>
          <ActionButton label="Book a Call" href={contact.cal} primary />
          <ActionButton label="Download CV" href={contact.cv} />
        </div>
      </div>
    </div>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '5px 0',
      gap: 8,
      borderBottom: '0.5px solid rgba(0,0,0,0.06)',
    }}>
      <span style={{
        width: 60,
        fontSize: 11,
        color: '#999',
        textAlign: 'right',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          fontSize: 12,
          color: '#007AFF',
          textDecoration: 'none',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
        }}
      >
        {value}
      </a>
      <button
        onClick={handleCopy}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 4px',
          fontSize: 10,
          color: copied ? '#34c759' : '#bbb',
          borderRadius: 3,
          flexShrink: 0,
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

function ActionButton({ label, href, primary }: { label: string; href: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 14px',
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 4,
        textDecoration: 'none',
        border: primary ? 'none' : '1px solid #ccc',
        background: primary
          ? 'linear-gradient(180deg, #4c97fe 0%, #007AFF 100%)'
          : 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
        color: primary ? '#fff' : '#333',
        boxShadow: '0 1px 1px rgba(0,0,0,0.06)',
        cursor: 'pointer',
      }}
    >
      {label}
    </a>
  )
}
