'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import BootSequence from './BootSequence'
import DeepLinkHandler from './DeepLinkHandler'
import DesktopContextMenu, { WALLPAPERS } from './DesktopContextMenu'
import Dock, { type DockEntry } from './Dock'
import MenuBar from './MenuBar'
import Window from './Window'
import AboutWindow from './windows/AboutWindow'
import ContactWindow from './windows/ContactWindow'
import FaceTimeWindow from './windows/FaceTimeWindow'
import ProjectsWindow from './windows/ProjectsWindow'
import ResumeViewer from './windows/ResumeViewer'
import SafariWindow from './windows/SafariWindow'
import SpotifyWidget from './windows/SpotifyWidget'
import VideoPlayer from './windows/VideoPlayer'
import YouTubePlayer from './windows/YouTubePlayer'
import CalendarWindow from './windows/CalendarWindow'
import TerminalWindow from './windows/TerminalWindow'
import { useRetroSound } from './hooks/useRetroSound'
import { useWindowManager } from './hooks/useWindowManager'
import { PORTFOLIO_CONTENT } from '../content'

/* ── Window configs ──────────────────────────────────────── */
const CONFIGS = {
  about:    { defaultPosition: { x: 80,  y: 40  }, defaultSize: { w: 480, h: 560 } },
  projects: { defaultPosition: { x: 180, y: 50  }, defaultSize: { w: 540, h: 500 } },
  contact:  { defaultPosition: { x: 140, y: 80  }, defaultSize: { w: 760, h: 420 } },
  spotify:  { defaultPosition: { x: 520, y: 50  }, defaultSize: { w: 280, h: 360 } },
  resume:   { defaultPosition: { x: 160, y: 50  }, defaultSize: { w: 560, h: 560 } },
  video:    { defaultPosition: { x: 240, y: 60  }, defaultSize: { w: 480, h: 380 } },
  facetime: { defaultPosition: { x: 200, y: 100 }, defaultSize: { w: 600, h: 400 } },
  zenith:   { defaultPosition: { x: 140, y: 40  }, defaultSize: { w: 680, h: 460 } },
  calendar: { defaultPosition: { x: 220, y: 60  }, defaultSize: { w: 700, h: 500 } },
  terminal: { defaultPosition: { x: 160, y: 60  }, defaultSize: { w: 600, h: 420 } },
  safari:   { defaultPosition: { x: 120, y: 40  }, defaultSize: { w: 900, h: 600 } },
}

/** Window ids that can be targeted by a `?open=<id>` deep link. */
const WINDOW_IDS = Object.keys(CONFIGS)

const WALLPAPER_KEY = 'shivansh:wallpaper'
const DEFAULT_WALLPAPER = '/wallpapers/yosemite-default.jpg'

const BOOT_KEY = 'shivansh:lastVisit'
const BOOT_SKIP_WINDOW = 6 * 60 * 60 * 1000 // skip the boot animation for repeat visits within 6h

/** Skip the boot sequence if the visitor was here recently. */
function shouldSkipBoot(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const last = Number(window.localStorage.getItem(BOOT_KEY) || 0)
    return last > 0 && Date.now() - last < BOOT_SKIP_WINDOW
  } catch {
    return false
  }
}

/* ── Window-to-app-name mapping ──────────────────────────── */
const APP_NAMES: Record<string, string> = {
  about: 'About Me',
  projects: 'Finder',
  contact: 'Contacts',
  spotify: 'Spotify',
  resume: 'Preview',
  video: 'QuickTime Player',
  facetime: 'FaceTime',
  zenith: 'QuickTime Player',
  calendar: 'Calendar',
  terminal: 'Terminal',
  safari: 'Safari',
}

const DOCK_APPS: (Omit<DockEntry, 'isOpen'> & { key: string })[] = [
  {
    key: 'about', id: 'about', label: 'About Me',
    icon: <img src="/yosemite-icons/PrefApp.png" alt="About Me" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'projects', id: 'projects', label: 'Projects',
    icon: <img src="/yosemite-icons/Finder.png" alt="Projects" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'contact', id: 'contact', label: 'Contact',
    icon: <img src="/yosemite-icons/Contacts.png" alt="Contact" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'calendar', id: 'calendar', label: 'Calendar',
    icon: <img src="/yosemite-icons/App.png" alt="Calendar" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'facetime', id: 'facetime', label: 'FaceTime',
    icon: <img src="/yosemite-icons/AppIcon.png" alt="FaceTime" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'terminal', id: 'terminal', label: 'Terminal',
    icon: <img src="/yosemite-icons/Terminal.png" alt="Terminal" style={{ width: 46, height: 46 }} />,
  },
  {
    key: 'spotify', id: 'spotify', label: 'Spotify',
    icon: <img src="/yosemite-icons/spotify.png" alt="Spotify" style={{ width: 46, height: 46 }} />,
  },
]

const DOCK_FILES: (Omit<DockEntry, 'isOpen'> & { key: string })[] = []

/* ── Desktop ─────────────────────────────────────────────── */
export default function Desktop() {
  // Desktop only mounts client-side (page.tsx shows MobileGate during SSR/hydration),
  // so reading localStorage in this initializer is safe.
  const [booted, setBooted] = useState(shouldSkipBoot)
  const [muted, setMuted] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPER)
  const [wallpaperHydrated, setWallpaperHydrated] = useState(false)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const sound = useRetroSound()
  const wm = useWindowManager(CONFIGS)

  // Restore the saved wallpaper after mount (SSR renders the default).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WALLPAPER_KEY)
      if (saved && WALLPAPERS.some(w => w.src === saved)) setWallpaper(saved)
    } catch {
      /* ignore */
    }
    setWallpaperHydrated(true)
  }, [])

  // Persist wallpaper changes (gated so the default never clobbers a saved one).
  useEffect(() => {
    if (!wallpaperHydrated) return
    try {
      localStorage.setItem(WALLPAPER_KEY, wallpaper)
    } catch {
      /* ignore */
    }
  }, [wallpaper, wallpaperHydrated])

  // Stamp the visit time so repeat visits within the window skip the boot.
  useEffect(() => {
    try {
      localStorage.setItem(BOOT_KEY, String(Date.now()))
    } catch {
      /* ignore */
    }
  }, [])

  const finishBoot = useCallback(() => setBooted(true), [])

  const open = useCallback((id: string) => {
    if (wm.windows[id]?.isOpen) {
      wm.focusWindow(id)
      setActive(id)
    } else {
      sound.playWindowOpen()
      wm.openWindow(id)
      setActive(id)
    }
  }, [sound, wm])

  const close = useCallback((id: string) => {
    sound.playWindowClose()
    wm.closeWindow(id)
    if (active === id) setActive(null)
  }, [sound, wm, active])

  const focus = useCallback((id: string) => {
    wm.focusWindow(id)
    setActive(id)
  }, [wm])

  const toggleMute = useCallback(() => {
    const n = !muted
    setMuted(n)
    sound.setMuted(n)
  }, [muted, sound])

  const wp = (id: string) => ({
    title: APP_NAMES[id] || id,
    isOpen: wm.windows[id]?.isOpen ?? false,
    position: wm.windows[id]?.position ?? { x: 0, y: 0 },
    size: wm.windows[id]?.size ?? { w: 400, h: 400 },
    zIndex: wm.windows[id]?.zIndex ?? 100,
    isActive: active === id,
    onClose: () => close(id),
    onFocus: () => focus(id),
    onMove: (x: number, y: number) => wm.moveWindow(id, x, y),
  })

  const activeAppName = active ? (APP_NAMES[active] || 'Finder') : 'Finder'
  const dockApps: DockEntry[] = DOCK_APPS.map(a => ({ ...a, isOpen: wm.windows[a.id]?.isOpen }))
  const dockFiles: DockEntry[] = DOCK_FILES.map(f => ({ ...f, isOpen: wm.windows[f.id]?.isOpen }))

  return (
    <>
      <Suspense fallback={null}>
        <DeepLinkHandler ready={booted} validIds={WINDOW_IDS} onOpen={open} />
      </Suspense>

      {!booted && <BootSequence onComplete={finishBoot} playBoot={sound.playBoot} />}

      {booted && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            background: `url(${wallpaper}) center/cover no-repeat`,
            animation: 'fadeIn 0.5s ease-out',
          }}
          onClick={() => { setActive(null); setContextMenu(null) }}
          onContextMenu={(e) => {
            e.preventDefault()
            setContextMenu({ x: e.clientX, y: e.clientY })
          }}
        >
          <MenuBar
            isMuted={muted}
            onToggleMute={toggleMute}
            activeApp={activeAppName}
            availability={PORTFOLIO_CONTENT.status.available ? PORTFOLIO_CONTENT.status.label : null}
            onAvailabilityClick={() => open('contact')}
          />

          {/* Desktop Icons */}
          <div style={{
            position: 'absolute',
            top: 40,
            right: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            alignItems: 'center',
            zIndex: 10,
          }}>
            <DesktopIcon
              iconSrc="/yosemite-icons/pdf-file-icon.png"
              label="Resume.pdf"
              activeKey="resume-icon"
              isActive={active === 'resume-icon'}
              onSelect={() => setActive('resume-icon')}
              onOpen={() => open('resume')}
            />
            <DesktopIcon
              iconSrc="/yosemite-icons/zenith.png"
              label="zenith.mov"
              activeKey="zenith-icon"
              isActive={active === 'zenith-icon'}
              onSelect={() => setActive('zenith-icon')}
              onOpen={() => open('zenith')}
            />
            <DesktopIcon
              iconSrc="/yosemite-icons/compass.png"
              label="shivansh.life"
              activeKey="safari-icon"
              isActive={active === 'safari-icon'}
              onSelect={() => setActive('safari-icon')}
              onOpen={() => open('safari')}
            />
            <DesktopIcon
              iconSrc="/yosemite-icons/MovieFolderIcon.png"
              label="Reels"
              activeKey="reels-icon"
              isActive={active === 'reels-icon'}
              onSelect={() => setActive('reels-icon')}
              onOpen={() => window.open('https://www.instagram.com/shivansh.life', '_blank', 'noopener,noreferrer')}
            />
          </div>

          {/* Window layer */}
          <div style={{ position: 'absolute', top: 24, left: 0, right: 0, bottom: 56 }}>
            <Window {...wp('about')}><AboutWindow /></Window>
            <Window {...wp('projects')}><ProjectsWindow /></Window>
            <Window {...wp('contact')}><ContactWindow /></Window>
            <Window {...wp('facetime')}><FaceTimeWindow /></Window>
            <Window {...wp('spotify')}><SpotifyWidget /></Window>
            <Window {...wp('resume')}><ResumeViewer /></Window>
            <Window {...wp('video')}><VideoPlayer filename="work_demo.mov" /></Window>
            <Window {...wp('zenith')}><YouTubePlayer videoId="gp_9BBiFmyQ" filename="zenith.mov" /></Window>
            <Window {...wp('calendar')}><CalendarWindow /></Window>
            <Window {...wp('terminal')}><TerminalWindow onOpenWindow={open} /></Window>
            <Window {...wp('safari')}><SafariWindow url="https://www.shivansh.life/" label="shivansh.life" /></Window>
          </div>

          {contextMenu && (
            <DesktopContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              currentWallpaper={wallpaper}
              onChangeWallpaper={setWallpaper}
              onClose={() => setContextMenu(null)}
              playClick={sound.playClick}
            />
          )}

          <Dock apps={dockApps} files={dockFiles} onOpen={open} />
        </div>
      )}
    </>
  )
}

/* ── Desktop icon ────────────────────────────────────────── */
function DesktopIcon({
  iconSrc,
  label,
  isActive,
  onSelect,
  onOpen,
}: {
  iconSrc: string
  label: string
  activeKey: string
  isActive: boolean
  onSelect: () => void
  onOpen: () => void
}) {
  return (
    <div
      onDoubleClick={(e) => {
        e.stopPropagation()
        onOpen()
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        cursor: 'default',
        width: 72,
        padding: 4,
        borderRadius: 4,
        background: isActive ? 'rgba(0, 0, 0, 0.25)' : 'transparent',
        border: `1px solid ${isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'}`,
      }}
    >
      <img
        src={iconSrc}
        alt={label}
        style={{
          width: 56,
          height: 56,
          objectFit: 'contain',
          filter: isActive ? 'brightness(0.8)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
        }}
      />
      <span style={{
        color: '#fff',
        fontSize: 12,
        fontWeight: 500,
        textShadow: isActive ? 'none' : '0 1px 2px rgba(0,0,0,0.8)',
        textAlign: 'center',
        lineHeight: 1.2,
        background: isActive ? '#0058d0' : 'transparent',
        padding: '2px 6px',
        borderRadius: 4,
        width: 'max-content',
      }}>
        {label}
      </span>
    </div>
  )
}
