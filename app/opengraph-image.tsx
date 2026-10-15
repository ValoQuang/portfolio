import { ImageResponse } from "next/og";

export const alt = "Quang Truong Ngoc — Backend Engineer, Payments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(180deg, #08070E 0%, #1A0A18 100%)",
          color: "#E6E4EE",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#F0E14A", fontSize: 24, letterSpacing: 6 }}>
          <div style={{ width: 14, height: 14, background: "#F0E14A" }} />
          UPLINK · ESPOO, FINLAND
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>Quang Truong</div>
          <div style={{ fontSize: 104, lineHeight: 1.05, color: "#9893AA" }}>Ngoc.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#9893AA" }}>
          <span>Backend Engineer, Payments</span>
          <span style={{ color: "#3DE0E0" }}>34 PGW · 13 MARKETS</span>
        </div>
      </div>
    ),
    size,
  );
}
