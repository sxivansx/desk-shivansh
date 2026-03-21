'use client'

import { useCallback, useRef, useState } from 'react'

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

export function useWindowManager(configs: Record<string, WindowConfig>) {
  const topZ = useRef(100)

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
