'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { PORTFOLIO_CONTENT } from '../../content'

/* ── Types ──────────────────────────────────────────────── */
interface Line {
  type: 'input' | 'output' | 'ascii'
  text: string
}

interface TerminalWindowProps {
  onOpenWindow?: (id: string) => void
}

/* ── Helpers ─────────────────────────────────────────────── */
const PROMPT = 'shivansh@macbook ~ %'
const c = PORTFOLIO_CONTENT

const WELCOME: Line[] = [
  { type: 'output', text: 'Last login: Tue Apr  1 09:42:17 on ttys001' },
  { type: 'output', text: '' },
  { type: 'output', text: 'Welcome to shivansh.life — type \x1b[1mhelp\x1b[0m to get started.' },
  { type: 'output', text: '' },
]

const COMMANDS: Record<string, string> = {
  help:       'List available commands',
  whoami:     'Display user identity',
  about:      'About me',
  skills:     'List skills by category',
  experience: 'Work experience timeline',
  education:  'Education info',
  projects:   'Design projects',
  'ls code':  'List coding projects',
  contact:    'Contact information',
  neofetch:   'System info',
  'git log':  'Recent contributions',
  clear:      'Clear terminal',
  'open <app>': 'Open a window (about, projects, contact, spotify, etc.)',
  'cat <project>': 'View coding project details',
}

/* ── Command handler ─────────────────────────────────────── */
function execute(raw: string, onOpenWindow?: (id: string) => void): Line[] {
  const input = raw.trim()
  const lower = input.toLowerCase()

  if (!input) return []

  // clear
  if (lower === 'clear') return [{ type: 'output', text: '__CLEAR__' }]

  // help
  if (lower === 'help') {
    const lines: Line[] = [
      { type: 'output', text: 'Available commands:' },
      { type: 'output', text: '' },
    ]
    for (const [cmd, desc] of Object.entries(COMMANDS)) {
      lines.push({ type: 'output', text: `  ${cmd.padEnd(18)} ${desc}` })
    }
    lines.push({ type: 'output', text: '' })
    lines.push({ type: 'output', text: 'Tip: try "neofetch" or "git log" for easter eggs.' })
    return lines
  }

  // whoami
  if (lower === 'whoami') {
    return [{ type: 'output', text: `${c.name} — ${c.role}` }]
  }

  // about
  if (lower === 'about') {
    return [
      { type: 'output', text: c.bio },
    ]
  }

  // skills
  if (lower === 'skills') {
    const lines: Line[] = []
    const sections: [string, string[]][] = [
      ['Frontend', c.skills.frontend],
      ['Dev Tools', c.skills.devTools],
      ['Design', c.skills.design],
      ['Tools', c.skills.tools],
      ['Interests', c.skills.interests],
    ]
    for (const [label, items] of sections) {
      lines.push({ type: 'output', text: `\x1b[1m${label}:\x1b[0m ${items.join(', ')}` })
    }
    return lines
  }

  // experience / history
  if (lower === 'experience' || lower === 'history') {
    const lines: Line[] = []
    for (const exp of c.experience) {
      lines.push({ type: 'output', text: `\x1b[1m${exp.company}\x1b[0m — ${exp.role}` })
      for (const h of exp.highlights) {
        lines.push({ type: 'output', text: `  • ${h}` })
      }
      lines.push({ type: 'output', text: '' })
    }
    return lines
  }

  // education
  if (lower === 'education') {
    return [
      { type: 'output', text: `\x1b[1m${c.education.institution}\x1b[0m` },
      { type: 'output', text: `B.E. in ${c.education.field} | ${c.education.years}` },
      { type: 'output', text: `CGPA: ${c.education.cgpa}` },
    ]
  }

  // projects (design)
  if (lower === 'projects' || lower === 'ls projects') {
    const lines: Line[] = [
      { type: 'output', text: 'Design Projects:' },
      { type: 'output', text: '' },
    ]
    for (const p of c.projects) {
      lines.push({ type: 'output', text: `  \x1b[1m${p.name}\x1b[0m — ${p.tech.join(', ')}` })
      lines.push({ type: 'output', text: `    ${p.description.slice(0, 100)}${p.description.length > 100 ? '...' : ''}` })
      lines.push({ type: 'output', text: '' })
    }
    return lines
  }

  // ls code
  if (lower === 'ls code' || lower === 'ls coding' || lower === 'code') {
    const lines: Line[] = [
      { type: 'output', text: 'Coding Projects:' },
      { type: 'output', text: '' },
    ]
    for (const p of c.codingProjects) {
      lines.push({ type: 'output', text: `  \x1b[1m${p.name}\x1b[0m  [${p.tech.join(', ')}]` })
      lines.push({ type: 'output', text: `    ${p.description}` })
      if (p.repo) {
        lines.push({ type: 'output', text: `    → ${p.repo}` })
      }
      lines.push({ type: 'output', text: '' })
    }
    return lines
  }

  // cat <project>
  if (lower.startsWith('cat ')) {
    const target = input.slice(4).trim().toLowerCase()
    const allProjects = [...c.projects, ...c.codingProjects]
    const found = allProjects.find(p => p.name.toLowerCase() === target)
    if (found) {
      const lines: Line[] = [
        { type: 'output', text: `\x1b[1m${found.name}\x1b[0m` },
        { type: 'output', text: `${found.description}` },
        { type: 'output', text: '' },
        { type: 'output', text: `Tech: ${found.tech.join(', ')}` },
      ]
      if ('url' in found && found.url) {
        lines.push({ type: 'output', text: `Link: ${found.url}` })
      }
      if ('repo' in found && found.repo) {
        lines.push({ type: 'output', text: `Repo: ${found.repo}` })
      }
      return lines
    }
    return [{ type: 'output', text: `cat: ${target}: No such project. Try "projects" or "ls code".` }]
  }

  // contact
  if (lower === 'contact') {
    const lines: Line[] = []
    const entries: [string, string][] = [
      ['Email', c.contact.email],
      ['Behance', c.contact.behance],
      ['LinkedIn', c.contact.linkedin],
      ['Twitter', c.contact.twitter],
      ['Instagram', c.contact.instagram],
      ['Book a call', c.contact.cal],
    ]
    for (const [label, val] of entries) {
      lines.push({ type: 'output', text: `  ${label.padEnd(14)} ${val}` })
    }
    return lines
  }

  // git log
  if (lower === 'git log') {
    const lines: Line[] = [
      { type: 'ascii', text: '\x1b[33mcommit a1b2c3d\x1b[0m (HEAD -> main)' },
      { type: 'output', text: 'Author: Shivansh Pandey <sxivansx@duck.com>' },
      { type: 'output', text: 'Date:   Tue Apr 1 2026' },
      { type: 'output', text: '' },
      { type: 'output', text: '    feat: add interactive terminal to portfolio' },
      { type: 'output', text: '' },
      { type: 'ascii', text: '\x1b[33mcommit e4f5g6h\x1b[0m' },
      { type: 'output', text: 'Author: Shivansh Pandey <sxivansx@duck.com>' },
      { type: 'output', text: 'Date:   Mon Mar 31 2026' },
      { type: 'output', text: '' },
      { type: 'output', text: '    feat: calendar window with month view' },
      { type: 'output', text: '' },
      { type: 'ascii', text: '\x1b[33mcommit i7j8k9l\x1b[0m' },
      { type: 'output', text: 'Author: Shivansh Pandey <sxivansx@duck.com>' },
      { type: 'output', text: 'Date:   Sun Mar 30 2026' },
      { type: 'output', text: '' },
      { type: 'output', text: '    feat: macOS Yosemite desktop with dock & window manager' },
      { type: 'output', text: '' },
    ]
    return lines
  }

  // neofetch
  if (lower === 'neofetch') {
    const art = [
      '                 ,xNMM.           ',
      '               .OMMMMo            ',
      '               OMMM0,             ',
      '     .;loddo:  loolloddol;.       ',
      '   cKMMMMMMMMMMNWMMMMMMMMMM0:     ',
      ' .KMMMMMMMMMMMMMMMMMMMMMMMWd.     ',
      ' XMMMMMMMMMMMMMMMMMMMMMMMX.       ',
      ';MMMMMMMMMMMMMMMMMMMMMMMM:        ',
      ':MMMMMMMMMMMMMMMMMMMMMMMM:        ',
      '.MMMMMMMMMMMMMMMMMMMMMMMMX.       ',
      ' kMMMMMMMMMMMMMMMMMMMMMMMMWd.     ',
      ' .XMMMMMMMMMMMMMMMMMMMMMMMMk      ',
      '  .XMMMMMMMMMMMMMMMMMMMMK.        ',
      '    kMMMMMMMMMMMMMMMMMMd.          ',
      '     ;KMMMMMMMWXXWMMMk.           ',
      '       .cooc,.    .,coo:.         ',
    ]

    const info = [
      `\x1b[1mshivansh\x1b[0m@\x1b[1mmacbook\x1b[0m`,
      '─────────────────',
      `\x1b[1mOS:\x1b[0m shivansh.life (macOS Yosemite)`,
      `\x1b[1mRole:\x1b[0m ${c.role}`,
      `\x1b[1mLocation:\x1b[0m Bengaluru, India`,
      `\x1b[1mShell:\x1b[0m zsh 5.9`,
      `\x1b[1mEditor:\x1b[0m VS Code / Figma`,
      `\x1b[1mLanguages:\x1b[0m TypeScript, JavaScript, CSS`,
      `\x1b[1mFrameworks:\x1b[0m Next.js, React, Tailwind`,
      `\x1b[1mDesign:\x1b[0m ${c.skills.tools.slice(0, 4).join(', ')}`,
      `\x1b[1mUptime:\x1b[0m ${c.education.years}`,
      '',
      '  🟥🟧🟨🟩🟦🟪⬛⬜',
    ]

    const lines: Line[] = []
    const maxLen = Math.max(art.length, info.length)
    for (let i = 0; i < maxLen; i++) {
      const left = art[i] || ''.padEnd(34)
      const right = info[i] || ''
      lines.push({ type: 'ascii', text: `\x1b[36m${left}\x1b[0m ${right}` })
    }
    return lines
  }

  // open <window>
  if (lower.startsWith('open ')) {
    const target = lower.slice(5).trim()
    const windowMap: Record<string, string> = {
      about: 'about',
      projects: 'projects',
      contact: 'contact',
      spotify: 'spotify',
      resume: 'resume',
      facetime: 'facetime',
      calendar: 'calendar',
      video: 'video',
    }
    const windowId = windowMap[target]
    if (windowId && onOpenWindow) {
      onOpenWindow(windowId)
      return [{ type: 'output', text: `Opening ${target}...` }]
    }
    return [{ type: 'output', text: `open: "${target}" not found. Available: ${Object.keys(windowMap).join(', ')}` }]
  }

  // sudo
  if (lower.startsWith('sudo')) {
    return [{ type: 'output', text: 'Nice try. You don\'t have admin privileges on this portfolio.' }]
  }

  // rm
  if (lower.startsWith('rm ')) {
    return [{ type: 'output', text: 'Whoa there. This is a read-only portfolio.' }]
  }

  // ls
  if (lower === 'ls') {
    return [
      { type: 'output', text: 'Desktop     Documents   Downloads   Projects    code' },
    ]
  }

  // pwd
  if (lower === 'pwd') {
    return [{ type: 'output', text: '/Users/shivansh' }]
  }

  // date
  if (lower === 'date') {
    return [{ type: 'output', text: new Date().toString() }]
  }

  // echo
  if (lower.startsWith('echo ')) {
    return [{ type: 'output', text: input.slice(5) }]
  }

  // fallback
  return [{ type: 'output', text: `zsh: command not found: ${input.split(' ')[0]}` }]
}

/* ── ANSI-like text renderer ─────────────────────────────── */
function renderAnsi(text: string) {
  const parts: { text: string; bold: boolean; color?: string }[] = []
  let remaining = text
  let bold = false
  let color: string | undefined

  while (remaining.length > 0) {
    const escIdx = remaining.indexOf('\x1b[')
    if (escIdx === -1) {
      parts.push({ text: remaining, bold, color })
      break
    }
    if (escIdx > 0) {
      parts.push({ text: remaining.slice(0, escIdx), bold, color })
    }
    const mEnd = remaining.indexOf('m', escIdx)
    if (mEnd === -1) {
      parts.push({ text: remaining.slice(escIdx), bold, color })
      break
    }
    const code = remaining.slice(escIdx + 2, mEnd)
    if (code === '1') bold = true
    else if (code === '0') { bold = false; color = undefined }
    else if (code === '33') color = '#e5c07b'
    else if (code === '36') color = '#56b6c2'
    else if (code === '32') color = '#98c379'
    remaining = remaining.slice(mEnd + 1)
  }

  return parts.map((p, i) => (
    <span key={i} style={{ fontWeight: p.bold ? 700 : 400, color: p.color }}>{p.text}</span>
  ))
}

/* ── Component ───────────────────────────────────────────── */
export default function TerminalWindow({ onOpenWindow }: TerminalWindowProps) {
  const [lines, setLines] = useState<Line[]>([...WELCOME])
  const [input, setInput] = useState('')
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    // Focus input when terminal mounts
    inputRef.current?.focus()
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const cmd = input.trim()
    const promptLine: Line = { type: 'input', text: `${PROMPT} ${input}` }

    if (cmd) {
      setCmdHistory(prev => [cmd, ...prev])
    }
    setHistoryIdx(-1)

    const result = execute(cmd, onOpenWindow)

    if (result.length === 1 && result[0].text === '__CLEAR__') {
      setLines([])
    } else {
      setLines(prev => [...prev, promptLine, ...result])
    }
    setInput('')
  }, [input, onOpenWindow])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIdx(prev => {
        const next = Math.min(prev + 1, cmdHistory.length - 1)
        if (next >= 0 && cmdHistory[next]) setInput(cmdHistory[next])
        return next
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIdx(prev => {
        const next = prev - 1
        if (next < 0) { setInput(''); return -1 }
        if (cmdHistory[next]) setInput(cmdHistory[next])
        return next
      })
    }
  }, [cmdHistory])

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#1e1e1e',
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: 12,
        color: '#d4d4d4',
      }}
    >
      {/* Title bar area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: '#2d2d2d',
        borderBottom: '1px solid #404040',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#888' }}>shivansh — zsh — 80×24</span>
      </div>

      {/* Terminal output */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 12px',
        lineHeight: 1.6,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: 19 }}>
            {line.type === 'input' ? (
              <>
                <span style={{ color: '#98c379' }}>{PROMPT}</span>
                <span>{' '}{line.text.slice(PROMPT.length + 1)}</span>
              </>
            ) : (
              renderAnsi(line.text)
            )}
          </div>
        ))}

        {/* Active prompt */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', minHeight: 19 }}>
          <span style={{ color: '#98c379', whiteSpace: 'pre' }}>{PROMPT} </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#d4d4d4',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: 'inherit',
              padding: 0,
              margin: 0,
              caretColor: '#d4d4d4',
            }}
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
