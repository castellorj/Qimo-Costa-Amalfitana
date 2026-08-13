import { ImageResponse } from "next/og";
import { getEditableContent } from "@/lib/content-remote";
import { formatRange } from "@/lib/date";

// Fallback do preview de link quando NÃO há imagem enviada no /admin.
// Rota própria (não é a convenção opengraph-image, que a Netlify cacheia como
// imutável): assim o og:image reflete edições e podemos controlar o cache.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

export async function GET() {
  const c = await getEditableContent();
  const aboard = c.vessel?.trim() ? `a bordo do ${c.vessel.trim()}` : "";
  const dateLine = [
    c.showDates ? formatRange(c.startDate, c.endDate) : "",
    c.heroNights?.trim(),
    aboard,
  ]
    .filter((s) => s && s.trim())
    .join(" · ");
  const cities = (c.heroCities || "").toUpperCase();

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
          background:
            "radial-gradient(120% 120% at 50% 0%, #0A2E50 0%, #04203C 60%, #03182C 100%)",
          color: "#F7F4EE",
          fontFamily: "Georgia, serif",
          position: "relative",
          padding: "64px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid rgba(184,155,94,0.5)",
            borderRadius: 8,
          }}
        />
        <div
          style={{
            fontSize: 34,
            letterSpacing: 16,
            textTransform: "uppercase",
            color: "#D2BB87",
            display: "flex",
          }}
        >
          {c.heroKicker}
        </div>
        <div
          style={{
            fontSize: 104,
            letterSpacing: 4,
            marginTop: 4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {c.heroTitle}
        </div>
        <div
          style={{
            fontSize: 40,
            letterSpacing: 12,
            marginTop: 6,
            color: "#D2BB87",
            display: "flex",
          }}
        >
          {c.heroYear}
        </div>
        <div style={{ width: 70, height: 2, background: "#B89B5E", margin: "24px 0" }} />
        <div style={{ fontSize: 34, color: "rgba(247,244,238,0.92)", display: "flex" }}>
          {dateLine}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 62,
            maxWidth: 1060,
            fontSize: 15,
            letterSpacing: 2,
            color: "rgba(210,187,135,0.85)",
            textAlign: "center",
            display: "flex",
          }}
        >
          {cities}
        </div>
      </div>
    ),
    { ...SIZE, headers: { "cache-control": "no-store, max-age=0, must-revalidate" } }
  );
}
