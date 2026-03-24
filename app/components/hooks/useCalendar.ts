'use client'

import { useMemo } from 'react'
import calendarEvents from '@/app/data/calendar-events.json'

export interface CalendarEvent {
  id: string
  summary: string
  start: string
  end: string
  allDay: boolean
  location?: string
  description?: string
}

export interface CalendarDay {
  date: number
  month: number
  year: number
  isCurrentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

const events = calendarEvents as CalendarEvent[]

function isSameDay(eventDate: string, year: number, month: number, day: number): boolean {
  const d = new Date(eventDate)
  // Handle both UTC and local dates
  if (eventDate.endsWith('Z')) {
    // Convert UTC to IST (UTC+5:30) for display
    const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
    return ist.getUTCFullYear() === year && ist.getUTCMonth() === month && ist.getUTCDate() === day
  }
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
}

function getEventTime(eventDate: string): string {
  const d = new Date(eventDate)
  let hours: number, minutes: number
  if (eventDate.endsWith('Z')) {
    const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
    hours = ist.getUTCHours()
    minutes = ist.getUTCMinutes()
  } else {
    hours = d.getHours()
    minutes = d.getMinutes()
  }
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

export function useCalendar(year: number, month: number) {
  const monthGrid = useMemo<CalendarDay[]>(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    const todayDate = today.getDate()

    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7
    const grid: CalendarDay[] = []

    for (let i = 0; i < totalCells; i++) {
      let date: number, m: number, y: number, isCurrentMonth: boolean

      if (i < firstDay) {
        // Previous month
        date = daysInPrevMonth - firstDay + i + 1
        m = month === 0 ? 11 : month - 1
        y = month === 0 ? year - 1 : year
        isCurrentMonth = false
      } else if (i - firstDay >= daysInMonth) {
        // Next month
        date = i - firstDay - daysInMonth + 1
        m = month === 11 ? 0 : month + 1
        y = month === 11 ? year + 1 : year
        isCurrentMonth = false
      } else {
        date = i - firstDay + 1
        m = month
        y = year
        isCurrentMonth = true
      }

      const dayEvents = events.filter((e) => isSameDay(e.start, y, m, date))

      grid.push({
        date,
        month: m,
        year: y,
        isCurrentMonth,
        isToday: y === todayYear && m === todayMonth && date === todayDate,
        events: dayEvents,
      })
    }

    return grid
  }, [year, month])

  const eventsForDate = useMemo(() => {
    return (day: number, m?: number, y?: number) => {
      const targetMonth = m ?? month
      const targetYear = y ?? year
      return events.filter((e) => isSameDay(e.start, targetYear, targetMonth, day))
    }
  }, [year, month])

  return { monthGrid, eventsForDate, getEventTime }
}
