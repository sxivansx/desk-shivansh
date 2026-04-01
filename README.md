# shivansh.life

A personal portfolio website built as a fully interactive macOS Yosemite desktop environment. It features a boot sequence, draggable windows, a dock, a menu bar, and retro UI sounds — all running in the browser.

## Preview

The site simulates a macOS desktop with functional windows for:

- **About** — Bio, background, and co-curriculars
- **Projects** — Design and development work (NexTribe, GPay Tags, etc.)
- **Skills** — Technical and creative skillset
- **Resume** — Embedded resume viewer
- **Contact** — Get in touch
- **FaceTime** — Video call-style intro
- **Spotify** — Now-playing widget via Spotify API
- **YouTube / Video Player** — Embedded media playback
- **Calendar** — Month view with events

## Tech Stack

- **Framework**: Next.js 16 (Turbopack)
- **Language**: TypeScript
- **UI**: React 19 + Tailwind CSS v4 + custom CSS
- **Sound**: Tone.js for retro UI interaction sounds
- **Icons**: 50+ authentic macOS Yosemite icons
- **Deployment**: Docker (Bun-based multi-stage build)

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Docker

```bash
docker build -t shivansh-life .
docker run -p 3000:3000 shivansh-life
```

## Project Structure

```
app/
  components/
    BootSequence.tsx      # Startup animation
    Desktop.tsx           # Main desktop layout
    Dock.tsx              # macOS-style dock
    MenuBar.tsx           # Top menu bar
    Window.tsx            # Draggable window shell
    hooks/                # useRetroSound, useWindowManager, useCalendar
    windows/              # Individual window content components
  content.ts              # Portfolio data (projects, bio, skills)
  api/spotify/            # Spotify integration routes
public/
  yosemite-icons/         # Authentic macOS Yosemite icon set
```
