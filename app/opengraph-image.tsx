import { ImageResponse } from "next/og";

export const alt = "Shivansh Pandey — Brand, UI/UX & Frontend Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Reuses the real Yosemite wallpaper gradient from app/globals.css (--wallpaper)
const WALLPAPER =
  "linear-gradient(175deg,#1e3156 0%,#3d4a7a 8%,#6e5488 16%,#a45d7e 24%,#d4756a 32%,#e89872 40%,#f0b87a 48%,#e8c88a 56%,#c4b07a 64%,#8a9a6a 72%,#5a7a52 80%,#3a5a3a 88%,#1e3620 100%)";

const TAGS = ["Brand Identity", "UI/UX", "Figma", "Next.js"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: WALLPAPER,
          fontFamily: "Helvetica, Arial, sans-serif",
          padding: 64,
        }}
      >
        {/* glass window card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 920,
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.55)",
            boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
            background: "rgba(248,248,248,0.97)",
          }}
        >
          {/* title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 56,
              paddingLeft: 22,
              paddingRight: 22,
              background: "linear-gradient(180deg,#ececec 0%,#d6d6d6 100%)",
              borderBottom: "1px solid rgba(0,0,0,0.12)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", width: 84 }}>
              <div style={{ width: 17, height: 17, borderRadius: 17, background: "#ff5f57", marginRight: 11 }} />
              <div style={{ width: 17, height: 17, borderRadius: 17, background: "#febc2e", marginRight: 11 }} />
              <div style={{ width: 17, height: 17, borderRadius: 17, background: "#28c840" }} />
            </div>
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "center",
                fontSize: 23,
                color: "rgba(0,0,0,0.6)",
              }}
            >
              About Me
            </div>
            <div style={{ display: "flex", width: 84 }} />
          </div>

          {/* body */}
          <div style={{ display: "flex", flexDirection: "column", padding: 56 }}>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 700, color: "#1d1d1f", letterSpacing: -1.5 }}>
              Shivansh Pandey
            </div>
            <div style={{ display: "flex", fontSize: 30, color: "#6e6e73", marginTop: 18 }}>
              Brand · UI/UX · Graphic Design · Frontend Dev
            </div>
            <div style={{ display: "flex", marginTop: 42 }}>
              {TAGS.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    fontSize: 22,
                    color: "#007AFF",
                    background: "rgba(0,122,255,0.09)",
                    border: "1px solid rgba(0,122,255,0.18)",
                    borderRadius: 6,
                    padding: "8px 16px",
                    marginRight: 12,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* url label below the window */}
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 28,
            fontWeight: 600,
            color: "#ffffff",
            textShadow: "0 1px 6px rgba(0,0,0,0.45)",
          }}
        >
          desk.shivansh
        </div>
      </div>
    ),
    { ...size },
  );
}
