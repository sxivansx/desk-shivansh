const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

async function getAccessToken() {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  })
  const data = await res.json()
  return data.access_token as string
}

export async function GET() {
  const token = await getAccessToken()

  const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status === 204 || res.status > 400) {
    // Not playing — fall back to recently played
    const recent = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const recentData = await recent.json()
    const item = recentData.items?.[0]?.track

    if (!item) return Response.json({ isPlaying: false, track: null, artist: null, albumArt: null })

    return Response.json({
      isPlaying: false,
      track: item.name,
      artist: item.artists.map((a: { name: string }) => a.name).join(', '),
      albumArt: item.album.images[0]?.url ?? null,
      url: item.external_urls.spotify,
    })
  }

  const data = await res.json()
  const item = data.item

  return Response.json({
    isPlaying: data.is_playing,
    track: item.name,
    artist: item.artists.map((a: { name: string }) => a.name).join(', '),
    albumArt: item.album.images[0]?.url ?? null,
    progress: data.progress_ms,
    duration: item.duration_ms,
    url: item.external_urls.spotify,
  })
}
