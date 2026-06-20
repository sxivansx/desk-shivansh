'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'shivansh:windows'

export interface WindowState {
  id: string
  isOpen: boolean
  position: { x: number; y: number }
  size: { w: number; h: number }
  zIndex: number
}

interface WindowConfig {
  defaultPosition: { x: number; y: number }
  defaultSize: { w: number; h: number }
  startOpen?: boolean
}

/** Slim subset of WindowState that we persist between visits. */
interface PersistedWindow {
  isOpen: boolean
  position: { x: number; y: number }
  zIndex: number
}

function loadPersisted(): Record<string, PersistedWindow> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, PersistedWindow>) : null
  } catch {
    return null
  }
}

export function useWindowManager(configs: Record<string, WindowConfig>) {
  const topZ = useRef(100)
  // false until localStorage has been read on the client; gates writes so the
  // default (SSR) state never clobbers a saved session.
  const [hydrated, setHydrated] = useState(false)

  const [windows, setWindows] = useState<Record<string, WindowState>>(() => {
    const state: Record<string, WindowState> = {}
    let initialZ = 100
    for (const [id, cfg] of Object.entries(configs)) {
      state[id] = {
        id,
        isOpen: cfg.startOpen ?? false,
        position: cfg.defaultPosition,
        size: cfg.defaultSize,
        zIndex: cfg.startOpen ? ++initialZ : 50,
      }
    }
    return state
  })

  // Hydrate from localStorage after mount (server render uses defaults only).
  useEffect(() => {
    const saved = loadPersisted()
    if (saved) {
      setWindows(prev => {
        const next: Record<string, WindowState> = { ...prev }
        const maxX = Math.max(0, window.innerWidth - 120)
        const maxY = Math.max(0, window.innerHeight - 80)
        let maxZ = topZ.current
        for (const id of Object.keys(prev)) {
          const s = saved[id]
          if (!s) continue
          const x = Math.min(Math.max(0, s.position?.x ?? prev[id].position.x), maxX)
          const y = Math.min(Math.max(0, s.position?.y ?? prev[id].position.y), maxY)
          const zIndex = typeof s.zIndex === 'number' ? s.zIndex : prev[id].zIndex
          next[id] = { ...prev[id], isOpen: !!s.isOpen, position: { x, y }, zIndex }
          if (zIndex > maxZ) maxZ = zIndex
        }
        topZ.current = Math.max(100, maxZ)
        return next
      })
    }
    setHydrated(true)
  }, [])

  // Persist (debounced so a drag writes once, not per mousemove).
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return
    const t = window.setTimeout(() => {
      try {
        const slim: Record<string, PersistedWindow> = {}
        for (const [id, w] of Object.entries(windows)) {
          slim[id] = { isOpen: w.isOpen, position: w.position, zIndex: w.zIndex }
        }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slim))
      } catch {
        /* ignore quota / private-mode errors */
      }
    }, 250)
    return () => window.clearTimeout(t)
  }, [windows, hydrated])

  const openWindow = useCallback((id: string) => {
    topZ.current += 1
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, zIndex: topZ.current },
    }))
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      if (prev[id].zIndex === topZ.current) return prev
      topZ.current += 1
      return {
        ...prev,
        [id]: { ...prev[id], zIndex: topZ.current },
      }
    })
  }, [])

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], position: { x, y } },
    }))
  }, [])

  const toggleWindow = useCallback((id: string) => {
    setWindows(prev => {
      if (prev[id].isOpen) {
        return { ...prev, [id]: { ...prev[id], isOpen: false } }
      }
      topZ.current += 1
      return { ...prev, [id]: { ...prev[id], isOpen: true, zIndex: topZ.current } }
    })
  }, [])

  return { windows, openWindow, closeWindow, focusWindow, moveWindow, toggleWindow }
}
