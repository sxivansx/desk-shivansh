/**
 * Parses an ICS file and outputs a JSON file with calendar events.
 * Usage: bun scripts/parse-ics.ts <path-to-ics-file>
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface CalendarEvent {
  id: string
  summary: string
  start: string // ISO date string
  end: string
  allDay: boolean
  location?: string
  description?: string
}

function parseICSDate(line: string): { date: string; allDay: boolean } {
  // All-day event: DTSTART;VALUE=DATE:20240102
  if (line.includes('VALUE=DATE:')) {
    const dateStr = line.split('VALUE=DATE:')[1].trim()
    return {
      date: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`,
      allDay: true,
    }
  }

  // Timezone-specific: DTSTART;TZID=Asia/Kolkata:20220613T173000
  if (line.includes('TZID=')) {
    const dateStr = line.split(':').pop()!.trim()
    const y = dateStr.slice(0, 4)
    const m = dateStr.slice(4, 6)
    const d = dateStr.slice(6, 8)
    const h = dateStr.slice(9, 11)
    const min = dateStr.slice(11, 13)
    return { date: `${y}-${m}-${d}T${h}:${min}:00`, allDay: false }
  }

  // UTC: DTSTART:20210508T030000Z
  const dateStr = line.split(':').pop()!.trim()
  const y = dateStr.slice(0, 4)
  const m = dateStr.slice(4, 6)
  const d = dateStr.slice(6, 8)
  if (dateStr.length === 8) {
    return { date: `${y}-${m}-${d}`, allDay: true }
  }
  const h = dateStr.slice(9, 11)
  const min = dateStr.slice(11, 13)
  const sec = dateStr.slice(13, 15)
  const isUTC = dateStr.endsWith('Z')
  return {
    date: `${y}-${m}-${d}T${h}:${min}:${sec}${isUTC ? 'Z' : ''}`,
    allDay: false,
  }
}

function unfoldLines(raw: string): string[] {
  // ICS spec: lines starting with space/tab are continuations
  return raw.replace(/\r\n[ \t]/g, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
}

function parseICS(content: string): CalendarEvent[] {
  const lines = unfoldLines(content)
  const events: CalendarEvent[] = []
  let current: Partial<CalendarEvent> | null = null
  let currentDescription = ''

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {}
      currentDescription = ''
      continue
    }

    if (line === 'END:VEVENT') {
      if (current?.summary && current?.start) {
        events.push({
          id: current.id || crypto.randomUUID(),
          summary: current.summary,
          start: current.start,
          end: current.end || current.start,
          allDay: current.allDay ?? false,
          ...(current.location && { location: current.location }),
          ...(currentDescription && { description: currentDescription }),
        })
      }
      current = null
      continue
    }

    if (!current) continue

    if (line.startsWith('UID:')) {
      current.id = line.slice(4).trim()
    } else if (line.startsWith('SUMMARY:')) {
      current.summary = line.slice(8).trim()
    } else if (line.startsWith('DTSTART')) {
      const parsed = parseICSDate(line)
      current.start = parsed.date
      current.allDay = parsed.allDay
    } else if (line.startsWith('DTEND')) {
      const parsed = parseICSDate(line)
      current.end = parsed.date
    } else if (line.startsWith('LOCATION:')) {
      current.location = line.slice(9).trim()
    } else if (line.startsWith('DESCRIPTION:')) {
      currentDescription = line.slice(12).trim()
    }
  }

  // Sort by start date descending (most recent first)
  events.sort((a, b) => b.start.localeCompare(a.start))

  return events
}

// Main
const icsPath = process.argv[2]
if (!icsPath) {
  console.error('Usage: bun scripts/parse-ics.ts <path-to-ics-file>')
  process.exit(1)
}

const content = readFileSync(resolve(icsPath), 'utf-8')
const events = parseICS(content)

const outPath = resolve(__dirname, '../app/data/calendar-events.json')
writeFileSync(outPath, JSON.stringify(events, null, 2))

console.log(`Parsed ${events.length} events → ${outPath}`)
