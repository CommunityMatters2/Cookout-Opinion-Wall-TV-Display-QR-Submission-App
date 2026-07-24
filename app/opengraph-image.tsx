import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

export const alt = "Community Voice: Shape Poughkeepsie — CM2 Summer Cookout";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(join(process.cwd(), "public/cm2/logo.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

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
          gap: 28,
          background: "linear-gradient(135deg, #ff5a5f 0%, #ff6b35 45%, #ffd166 100%)",
          padding: 60,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={120}
          height={120}
          style={{ borderRadius: "50%", background: "#fff" }}
          alt=""
        />
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#1a0e00", textAlign: "center" }}>
          {siteConfig.shareTitle}
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#3a2200", textAlign: "center" }}>
          CM2 Summer Cookout · Poughkeepsie, NY
        </div>
      </div>
    ),
    { ...size }
  );
}
