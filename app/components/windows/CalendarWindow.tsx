'use client'

import { useState } from 'react'
import { useCalendar } from '../hooks/useCalendar'

export default function CalendarWindow() {
  const [view, setView] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Month')
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const { monthGrid, getEventTime } = useCalendar(year, month)

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  function goToToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  const eventColors = ['#007AFF', '#34c759', '#ff9f0a', '#af52de', '#ff3b30', '#5ac8fa', '#ff2d55']
  function eventColor(id: string) {
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
    return eventColors[Math.abs(hash) % eventColors.length]
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', color: '#333' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        background: 'linear-gradient(to bottom, #f6f6f6, #e8e8e8)',
        borderBottom: '1px solid #c4c4c4',
        gap: 16,
        flexShrink: 0,
      }}>
        {/* View Controls */}
        <div style={{ display: 'flex', border: '1px solid #c4c4c4', borderRadius: 4, overflow: 'hidden', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>
          {['Day', 'Week', 'Month', 'Year'].map((v, i) => (
            <button
              key={v}
              onClick={() => setView(v as 'Day' | 'Week' | 'Month' | 'Year')}
              style={{
                background: view === v ? '#d4d4d4' : 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
                border: 'none',
                borderRight: i < 3 ? '1px solid #c4c4c4' : 'none',
                padding: '4px 12px',
                cursor: 'pointer',
                color: '#444',
                fontSize: 12,
                fontWeight: view === v ? 600 : 400,
                boxShadow: view === v ? 'inset 0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#555', padding: '0 4px' }}>&lt;</button>
          <button onClick={goToToday} style={{
            background: 'linear-gradient(180deg, #fff 0%, #f0f0f0 100%)',
            border: '1px solid #c4c4c4',
            borderRadius: 4,
            padding: '3px 10px',
            cursor: 'pointer',
            fontSize: 11,
            color: '#444',
          }}>Today</button>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#555', padding: '0 4px' }}>&gt;</button>
        </div>

        <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#333' }}>
          {monthNames[month]} {year}
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 6, top: 6 }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search" style={{
            width: 140,
            padding: '4px 8px 4px 22px',
            fontSize: 12,
            border: '1px solid #c4c4c4',
            borderRadius: 14,
            outline: 'none',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{
          width: 200,
          background: '#ececec',
          borderRight: '1px solid #c4c4c4',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
        }}>
          {/* Mini Calendar */}
          <div style={{ padding: '0 16px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontWeight: 600, fontSize: 12 }}>
              <span>{monthNames[month]} {year}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ cursor: 'pointer', color: '#777' }} onClick={prevMonth}>&lt;</span>
                <span style={{ cursor: 'pointer', color: '#777' }} onClick={nextMonth}>&gt;</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center', fontSize: 10, color: '#888', marginBottom: 4 }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center', fontSize: 11 }}>
              {monthGrid.map((day, i) => (
                <div key={i} style={{
                  padding: '2px 0',
                  background: day.isToday ? '#ff3b30' : 'transparent',
                  color: day.isToday ? '#fff' : (day.isCurrentMonth ? '#333' : '#aaa'),
                  borderRadius: '50%',
                  fontWeight: day.events.length > 0 ? 600 : 400,
                }}>
                  {day.date}
                </div>
              ))}
            </div>
          </div>

          {/* Calendars List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ padding: '4px 16px', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>Google</div>
            <CalendarListItem color="#007AFF" label="Calendar" />
          </div>
        </div>

        {/* Main Calendar View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #eee' }}>
            {daysOfWeek.map((day, i) => (
              <div key={day} style={{
                padding: '8px',
                textAlign: 'right',
                fontSize: 11,
                fontWeight: 500,
                color: i === 0 || i === 6 ? '#888' : '#333',
                borderRight: i < 6 ? '1px solid #eee' : 'none'
              }}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${monthGrid.length / 7}, 1fr)` }}>
            {monthGrid.map((day, i) => (
              <div key={i} style={{
                borderRight: (i + 1) % 7 !== 0 ? '1px solid #eee' : 'none',
                borderBottom: i < monthGrid.length - 7 ? '1px solid #eee' : 'none',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                background: day.isCurrentMonth ? '#fff' : '#fafafa',
                overflow: 'hidden',
              }}>
                <div style={{
                  alignSelf: 'flex-end',
                  fontSize: 12,
                  fontWeight: day.isToday ? 600 : 400,
                  color: day.isCurrentMonth ? (day.isToday ? '#fff' : '#333') : '#aaa',
                  background: day.isToday ? '#ff3b30' : 'transparent',
                  borderRadius: '50%',
                  width: day.isToday ? 22 : 'auto',
                  height: day.isToday ? 22 : 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 2,
                }}>
                  {day.date}
                </div>

                {/* Events */}
                {day.events.slice(0, 3).map((event) => {
                  const color = eventColor(event.id)
                  return (
                    <div
                      key={event.id}
                      title={`${event.summary}${event.location ? `\n📍 ${event.location}` : ''}`}
                      style={{
                        background: `${color}20`,
                        color: color,
                        fontSize: 10,
                        padding: '1px 4px',
                        borderRadius: 3,
                        marginBottom: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        borderLeft: `2px solid ${color}`,
                      }}
                    >
                      {event.allDay ? event.summary : `${getEventTime(event.start)} ${event.summary}`}
                    </div>
                  )
                })}
                {day.events.length > 3 && (
                  <div style={{ fontSize: 9, color: '#888', paddingLeft: 4 }}>
                    +{day.events.length - 3} more
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CalendarListItem({ color, label }: { color: string, label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '4px 16px',
      cursor: 'pointer',
      fontSize: 12,
      color: '#333'
    }}>
      <div style={{ width: 12, height: 12, borderRadius: 3, background: color, border: '1px solid rgba(0,0,0,0.1)' }} />
      {label}
    </div>
  )
}
