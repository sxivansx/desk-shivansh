'use client'

import { useCallback, useRef } from 'react'
import * as Tone from 'tone'

export function useRetroSound() {
  const mutedRef = useRef(false)
  const initialized = useRef(false)

  const synths = useRef<{
    hover: Tone.MembraneSynth;
    click: Tone.PolySynth;
    ui: Tone.Synth;
    boot: Tone.PolySynth;
  } | null>(null)

  const initTone = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (!initialized.current) {
      await Tone.start()
      
      synths.current = {
        hover: new Tone.MembraneSynth({
          pitchDecay: 0.01,
          octaves: 1,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 }
        }).toDestination(),
        
        click: new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'square' },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
        }).toDestination(),
        
        ui: new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.5 }
        }).toDestination(),

        boot: new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 1, release: 2 }
        }).toDestination()
      }
      
      synths.current.hover.volume.value = -25
      synths.current.click.volume.value = -20
      synths.current.ui.volume.value = -15
      synths.current.boot.volume.value = -10
      
      initialized.current = true
    }
  }, [])

  const playHover = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      synths.current.hover.triggerAttackRelease("C4", "64n")
    }
  }, [initTone])

  const playBoot = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      const now = Tone.now()
      synths.current.boot.triggerAttackRelease(["C3", "C4", "C5", "E5", "G5", "C6"], 2.5, now)
    }
  }, [initTone])

  const playClick = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      const now = Tone.now()
      synths.current.click.triggerAttackRelease("A5", 0.05, now)
      synths.current.click.triggerAttackRelease("A4", 0.05, now + 0.02)
    }
  }, [initTone])

  const playWindowOpen = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      const now = Tone.now()
      synths.current.ui.triggerAttackRelease("C5", 0.05, now)
      synths.current.ui.triggerAttackRelease("E5", 0.05, now + 0.05)
      synths.current.ui.triggerAttackRelease("G5", 0.05, now + 0.1)
      synths.current.ui.triggerAttackRelease("C6", 0.1, now + 0.15)
    }
  }, [initTone])

  const playWindowClose = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      const now = Tone.now()
      synths.current.ui.triggerAttackRelease("C6", 0.05, now)
      synths.current.ui.triggerAttackRelease("G5", 0.05, now + 0.05)
      synths.current.ui.triggerAttackRelease("E5", 0.05, now + 0.1)
      synths.current.ui.triggerAttackRelease("C5", 0.1, now + 0.15)
    }
  }, [initTone])

  const playError = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      const now = Tone.now()
      synths.current.click.triggerAttackRelease("C3", 0.1, now)
      synths.current.click.triggerAttackRelease("C3", 0.1, now + 0.15)
    }
  }, [initTone])

  const playType = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      synths.current.hover.triggerAttackRelease(1200 + Math.random() * 200, 0.01)
    }
  }, [initTone])

  const playMenuOpen = useCallback(() => {
    if (mutedRef.current) return
    initTone()
    if (synths.current) {
      synths.current.ui.triggerAttackRelease("E5", 0.05)
    }
  }, [initTone])

  const setMuted = useCallback((muted: boolean) => {
    mutedRef.current = muted
    Tone.Destination.mute = muted
  }, [])

  const isMuted = useCallback(() => mutedRef.current, [])

  return {
    playHover,
    playBoot,
    playClick,
    playWindowOpen,
    playWindowClose,
    playError,
    playType,
    playMenuOpen,
    setMuted,
    isMuted,
  }
}
