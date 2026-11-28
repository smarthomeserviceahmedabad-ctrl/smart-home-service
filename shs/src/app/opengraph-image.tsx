import { ImageResponse } from "next/og";

// Preview image shown when the site is shared on WhatsApp, Facebook, Google etc.
export const alt = "Smart Home Service Ahmedabad — Maid, Cook, Baby Sitter, Elder Care, Driver";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SERVICES = ["House Maid", "House Servant", "Baby Sitter", "Elder Care", "Patient Care Taker", "Cook", "Driver", "Office Boy", "Nanny / Aaya"];

export default function OgImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "linear-gradient(135deg,#0b1f4d,#163a85 60%,#1e4fa6)", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 30, color: "#ffd84d", fontWeight: 700, letterSpacing: 2 }}>AHMEDABAD · GUJARAT</div>
        <div style={{ fontSize: 88, fontWeight: 800, marginTop: 10 }}>Smart Home Service</div>
        <div style={{ fontSize: 36, color: "#c9d6ee", marginTop: 6, fontStyle: "italic" }}>Trusted Service for a Better Life</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
        {SERVICES.map(s => <div key={s} style={{ display: "flex", fontSize: 26, padding: "10px 20px", borderRadius: 14, background: "rgba(255,255,255,.12)", border: "2px solid rgba(255,216,77,.5)" }}>{s}</div>)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 32, borderTop: "6px solid #7cb82f", paddingTop: 22 }}>
        <span>Reliable &amp; Trained Staff</span>
        <span style={{ color: "#ffd84d", fontWeight: 700 }}>+91 81607 35095 · +91 87990 56949</span>
      </div>
    </div>,
    size,
  );
}
