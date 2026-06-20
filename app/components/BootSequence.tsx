'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface Props {
  onComplete: () => void
  playBoot: () => void
}

export default function BootSequence({ onComplete, playBoot }: Props) {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const ran = useRef(false)
  const finished = useRef(false)
  const timers = useRef<number[]>([])
  const interval = useRef<number | null>(null)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    if (interval.current !== null) clearInterval(interval.current)
    timers.current.forEach(clearTimeout)
    timers.current = []
    setProgress(100)
    setFading(true)
    window.setTimeout(onComplete, 400)
  }, [onComplete])

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    playBoot()

    timers.current.push(window.setTimeout(() => setVisible(true), 200))
    timers.current.push(window.setTimeout(() => setHintVisible(true), 1200))
    timers.current.push(
      window.setTimeout(() => {
        let p = 0
        interval.current = window.setInterval(() => {
          p += 2
          setProgress(Math.min(p, 100))
          if (p >= 100 && interval.current !== null) clearInterval(interval.current)
        }, 30)
      }, 600),
    )
    timers.current.push(window.setTimeout(finish, 2800))

    return () => {
      if (interval.current !== null) clearInterval(interval.current)
      timers.current.forEach(clearTimeout)
    }
  }, [playBoot, finish])

  // Click anywhere or press any key to skip the boot animation.
  useEffect(() => {
    const onKey = () => finish()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish])

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        cursor: 'pointer',
      }}
    >
      {visible && (
          <div style={{ animation: 'scaleIn 0.3s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Apple logo */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="white"
            style={{ marginBottom: 60 }}
          >
            <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
          </svg>

          {/* Progress bar */}
          <div style={{
            width: 200,
            height: 4,
            borderRadius: 2,
            background: 'rgba(255, 255, 255, 0.2)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'white',
              borderRadius: 2,
              transition: 'width 0.06s linear',
            }} />
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 40,
          color: 'rgba(255, 255, 255, 0.35)',
          fontSize: 12,
          letterSpacing: 0.2,
          opacity: hintVisible && !fading ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        Click anywhere to skip
      </div>
    </div>
  )
}
