import { ImageResponse } from "next/og";

// 1200×630 OG default. Generated at build time by Next.js.
// Satori (the renderer Next uses) needs every parent of multi-child
// nodes to have explicit display:flex, and only renders glyphs from
// the embedded font — so we stick to plain ASCII / latin chars here.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cheap Actors. Un cinema qui n'attendait personne.";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#efe9dc",
          color: "#0c0c0c",
          padding: "80px 96px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            color: "#5c5c5c",
            textTransform: "uppercase",
          }}
        >
          Vol. 01 / Selection 2026
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 156,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: -4,
            }}
          >
            cheap actors.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 44,
              fontStyle: "italic",
              color: "#3a3a3a",
              maxWidth: 940,
            }}
          >
            Des comediens que personne n'a rappeles.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            color: "#5c5c5c",
            textTransform: "uppercase",
          }}
        >
          <span>Pas connus. Pas chers. Pas mal.</span>
          <span style={{ color: "#ff3a1f" }}>cheap-actors</span>
        </div>
      </div>
    ),
    size,
  );
}
