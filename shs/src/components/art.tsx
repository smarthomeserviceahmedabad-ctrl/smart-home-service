"use client";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { GROUPS, PHOTOS, type Group } from "@/lib/data";
import { sceneFor } from "@/lib/utils";

/* ---------- Icons ---------- */
const ICON: Record<string, string> = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  chef: '<path d="M6 14a4 4 0 1 1 2-7.5A4 4 0 0 1 16 6.5 4 4 0 1 1 18 14"/><path d="M6 14v6h12v-6"/><path d="M6 17h12"/>',
  baby: '<circle cx="12" cy="8" r="4"/><path d="M10.5 8h.01M13.5 8h.01"/><path d="M6 21a6 6 0 0 1 12 0"/>',
  heart: '<path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/>',
  care: '<path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/><path d="M12 10v5M9.5 12.5h5"/>',
  car: '<path d="M5 17h14v-5l-2-5H7l-2 5z"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M5 12h14"/>',
  brief: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5a5 5 0 0 1 6 5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  map: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-5L4 8M4 4v4h4M4 13a8 8 0 0 0 14 5l2-2M20 20v-4h-4"/>',
  chat: '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 10h8M8 13h5"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  broom: '<path d="M19 3l-7 7"/><path d="M12 10c-3 0-6 2-7 6l-1 5h8l2-4c1.5-2 1-5-2-7z"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.5"/><path d="M5.5 16.5a3.5 3.5 0 0 1 7 0M15 10h3M15 13h3"/>',
  police: '<path d="M12 2l3 2h4v5c0 6-4 10-7 11-3-1-7-5-7-11V4h4z"/><path d="M12 8l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"/>',
  interview: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20a6 6 0 0 1 12 0M10 20a6 6 0 0 1 12 0"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M12 8S10 3 7.5 4.5 9 8 12 8zm0 0s2-5 4.5-3.5S15 8 12 8z"/>',
  rupee: '<path d="M6 4h12M6 9h12M6 4c6 0 8 1.5 8 5s-3 5-8 5l8 7"/>',
  pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
  play: '<path d="M7 5l12 7-12 7z"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V4H3v13h4"/>',
};
export function Ic({ n, s = 18, sw = 1.8, style }: { n: string; s?: number; sw?: number; style?: CSSProperties }) {
  return <svg className="ic" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style} dangerouslySetInnerHTML={{ __html: ICON[n] || "" }} />;
}
export const StarIc = ({ on = true, s = 16 }: { on?: boolean; s?: number }) =>
  <svg width={s} height={s} viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICON.star }} />;

/* ---------- Logo ---------- */
export function LogoMark({ size }: { size: number }) {
  const id = "lg" + useId().replace(/:/g, "");
  return <svg className="logo-svg" width={size} height={size} viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2a5fc4" /><stop offset="1" stopColor="#0f2a66" /></linearGradient></defs><rect width="48" height="48" rx="14" fill={`url(#${id})`} /><path d="M6 41c9-5 25-6 36-2" stroke="#7cb82f" strokeWidth="2.6" fill="none" strokeLinecap="round" /><path d="M8 44.5c9-4 22-4.6 32-1.6" stroke="#ffd84d" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M10.5 23.5 24 12l13.5 11.5" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 21.5V34a2.5 2.5 0 0 0 2.5 2.5h13A2.5 2.5 0 0 0 33 34V21.5" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" /><path d="M24 33.2c-4.6-3.1-6.2-5.1-6.2-7.1a3.1 3.1 0 0 1 6.2-1.1 3.1 3.1 0 0 1 6.2 1.1c0 2-1.6 4-6.2 7.1z" fill="#ffd84d" /><path d="M38 6.5l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z" fill="#ffd84d" /></svg>;
}
export function Wordmark({ brand }: { brand: string }) {
  const b = brand.split(" "); if (b.length < 2) return <>{brand}</>;
  const last = b.pop(); return <>{b.join(" ")} <span className="wm2">{last}</span></>;
}

/* ---------- Flat vector scenes (swap for real photography via admin uploads) ---------- */
const SKIN = ["#8d5a3b", "#a86b45", "#c48a5f", "#7a4b2f"];
interface PersonOpts { x?: number; y?: number; s?: number; skin?: string; hair?: string; top?: string; bottom?: string; drape?: string | null; female?: boolean; aL?: number[]; aR?: number[]; elder?: boolean; cap?: string | null; hold?: string; front?: string }
function person(o: PersonOpts) {
  const { x = 0, y = 0, s = 1, skin = "#a86b45", hair = "#2b1d16", top = "#16A085", bottom = "#0e6b5c", drape = null, female = true, aL = [-34, -70], aR = [34, -70], elder = false, cap = null, hold = "", front = "" } = o;
  const hc = elder ? "#cfd3d8" : hair;
  let g = `<ellipse cx="0" cy="2" rx="42" ry="7" fill="#000" opacity=".09"/><ellipse cx="-12" cy="-1" rx="10" ry="4.5" fill="#3b2a20"/><ellipse cx="12" cy="-1" rx="10" ry="4.5" fill="#3b2a20"/>`;
  if (female) { g += `<path d="M-23,-84 L23,-84 L36,-5 Q0,3 -36,-5Z" fill="${bottom}"/><path d="M-26,-124 Q0,-131 26,-124 L23,-80 L-23,-80Z" fill="${top}"/>`; if (drape) g += `<path d="M12,-128 L29,-119 L-12,-36 L-33,-46Z" fill="${drape}"/>`; }
  else { g += `<rect x="-20" y="-64" width="17" height="62" rx="5" fill="${bottom}"/><rect x="3" y="-64" width="17" height="62" rx="5" fill="${bottom}"/><path d="M-27,-124 Q0,-131 27,-124 L29,-56 Q0,-52 -29,-56Z" fill="${top}"/>`; if (drape) g += `<path d="M-15,-118 L15,-118 L17,-56 L-17,-56Z" fill="${drape}"/>`; }
  g += `<rect x="-6" y="-137" width="12" height="15" rx="4" fill="${skin}"/>`;
  if (female) g += `<circle cx="15" cy="-166" r="10" fill="${hc}"/>`;
  g += `<circle cx="0" cy="-154" r="20" fill="${skin}"/>`;
  g += female ? `<path d="M-21,-151 C-24,-181 24,-181 21,-151 C18,-166 6,-170 0,-165 C-6,-170 -18,-166 -21,-151Z" fill="${hc}"/>` : `<path d="M-20,-157 C-21,-180 21,-180 20,-157 C14,-168 -14,-168 -20,-157Z" fill="${hc}"/>`;
  g += `<circle cx="-7" cy="-152" r="2.1" fill="#2b1d16"/><circle cx="7" cy="-152" r="2.1" fill="#2b1d16"/><path d="M-6,-144 Q0,-139 6,-144" stroke="#2b1d16" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="-12" cy="-145" r="3" fill="#e8806f" opacity=".35"/><circle cx="12" cy="-145" r="3" fill="#e8806f" opacity=".35"/>`;
  if (female) g += `<circle cx="0" cy="-161" r="1.9" fill="#d23a3a"/>`;
  if (elder) g += `<circle cx="-7" cy="-152" r="5.5" fill="none" stroke="#3a3a3a" stroke-width="1.5"/><circle cx="7" cy="-152" r="5.5" fill="none" stroke="#3a3a3a" stroke-width="1.5"/><path d="M-1.5,-152 H1.5" stroke="#3a3a3a" stroke-width="1.5"/>`;
  if (cap === "chef") g += `<path d="M-17,-168 L17,-168 L17,-178 C29,-182 27,-203 12,-198 C8,-211 -8,-211 -12,-198 C-27,-203 -29,-182 -17,-178Z" fill="#fff" stroke="#e2e8f0" stroke-width="1.5"/>`;
  if (cap === "driver") g += `<path d="M-21,-165 Q0,-186 21,-165Z" fill="#1f2937"/><rect x="-24" y="-168" width="48" height="6" rx="3" fill="#111827"/><rect x="-4" y="-176" width="8" height="5" rx="1" fill="#F4A340"/>`;
  g += hold;
  const arm = (sx: number, [hx, hy]: number[]) => `<path d="M${sx},-118 L${hx},${hy}" stroke="${top}" stroke-width="12" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="6.5" fill="${skin}"/>`;
  g += arm(-22, aL) + arm(22, aR) + front;
  return `<g transform="translate(${x} ${y}) scale(${s})">${g}</g>`;
}
const spark = (x: number, y: number, r: number, c?: string) => `<path d="M${x},${y - r} Q${x + r * .18},${y - r * .18} ${x + r},${y} Q${x + r * .18},${y + r * .18} ${x},${y + r} Q${x - r * .18},${y + r * .18} ${x - r},${y} Q${x - r * .18},${y - r * .18} ${x},${y - r}Z" fill="${c || "#fff"}"/>`;
const heart = (x: number, y: number, s: number, c: string) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0,10 C-12,2 -14,-4 -14,-8 a7,7 0 0 1 14,-2 a7,7 0 0 1 14,2 c0,4 -2,10 -14,18Z" fill="${c}"/>`;
const cloud = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><ellipse cx="0" cy="0" rx="22" ry="12"/><ellipse cx="18" cy="-7" rx="16" ry="13"/><ellipse cx="34" cy="1" rx="16" ry="10"/></g>`;
const plant = (x: number, y: number, s = 1, pot = "#c2410c") => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0,0 C-30,-30 -34,-70 -8,-96 C-6,-60 -4,-30 0,0Z" fill="#16A085"/><path d="M0,0 C26,-26 40,-60 22,-92 C10,-60 6,-30 0,0Z" fill="#0e8a72"/><path d="M0,0 C-10,-40 6,-80 2,-118 C14,-80 12,-40 0,0Z" fill="#22b391"/><path d="M-22,0 L22,0 L16,40 L-16,40Z" fill="${pot}"/><rect x="-25" y="-4" width="50" height="8" rx="3" fill="${pot}"/></g>`;
const win = (x: number, y: number, w: number, h: number, sky: string, inner = "") => `<rect x="${x - 9}" y="${y - 9}" width="${w + 18}" height="${h + 18}" rx="10" fill="#fff"/><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" overflow="hidden"><rect width="${w}" height="${h}" fill="${sky}"/>${inner}</svg><rect x="${x + w / 2 - 3}" y="${y}" width="6" height="${h}" fill="#fff"/><rect x="${x}" y="${y + h / 2 - 3}" width="${w}" height="6" fill="#fff"/>`;
const floorR = (c: string, line: string, y = 360) => `<rect y="${y}" width="600" height="${460 - y}" fill="${c}"/><rect y="${y - 8}" width="600" height="8" fill="#fff" opacity=".85"/><path d="M0,${y + 28} H600 M0,${y + 60} H600" stroke="${line}" stroke-width="2"/><path d="M120,${y} L100,${y + 28} M300,${y + 28} L290,${y + 60} M470,${y} L480,${y + 28} M200,${y + 60} L190,450" stroke="${line}" stroke-width="2"/>`;
const TRAY = `<rect x="-34" y="-104" width="68" height="7" rx="3.5" fill="#cbd5e1"/><rect x="-22" y="-118" width="12" height="14" rx="3" fill="#fff"/><rect x="-4" y="-118" width="12" height="14" rx="3" fill="#fff"/><path d="M-16,-124 q3,-6 0,-10 M2,-124 q3,-6 0,-10" stroke="#cbd5e1" stroke-width="2" fill="none"/><circle cx="20" cy="-110" r="7" fill="#F4A340"/>`;

export const SCENES: Record<string, () => string> = {
  family: () => `<rect width="600" height="450" fill="#FDF3E6"/>${win(42, 48, 150, 170, "#CFEAFB", `<circle cx="112" cy="44" r="18" fill="#FCD34D"/>${cloud(24, 50, .8)}<path d="M0,140 Q40,110 80,135 T150,130 V170 H0Z" fill="#86d3b8"/>`)}
 <rect x="232" y="64" width="116" height="82" rx="6" fill="#fff"/><rect x="240" y="72" width="100" height="66" fill="#fde7c7"/><path d="M240,138 L272,100 L294,122 L314,104 L340,138Z" fill="#16A085"/><circle cx="318" cy="90" r="8" fill="#F4A340"/>
 <path d="M516,84 L564,84 L550,118 L530,118Z" fill="#fcd34d"/><rect x="538" y="118" width="4" height="236" fill="#94a3b8"/>
 <rect x="140" y="232" width="320" height="84" rx="26" fill="#16A085"/><rect x="126" y="290" width="348" height="60" rx="18" fill="#12917a"/><rect x="170" y="250" width="54" height="46" rx="12" fill="#F4A340" transform="rotate(-8 197 273)"/><rect x="380" y="250" width="54" height="46" rx="12" fill="#fde68a" transform="rotate(8 407 273)"/>
 ${floorR("#E6CDAE", "#d9bd98")}<ellipse cx="300" cy="412" rx="240" ry="26" fill="#F4A340" opacity=".2"/>${plant(566, 322, .78)}
 ${person({ x: 492, y: 394, s: 1.02, skin: SKIN[0], top: "#16A085", bottom: "#0e6b5c", drape: "#fff", aL: [-26, -100], aR: [26, -100], hold: TRAY })}
 ${person({ x: 298, y: 410, s: .72, female: false, skin: SKIN[2], top: "#F4A340", bottom: "#1d4e89", aL: [-34, -84], aR: [34, -84] })}
 ${person({ x: 228, y: 410, s: 1.3, female: false, skin: SKIN[1], top: "#1d4e89", bottom: "#e2e8f0", aL: [-32, -64], aR: [48, -94] })}
 ${person({ x: 372, y: 410, s: 1.25, skin: SKIN[2], top: "#e58aa8", bottom: "#8c3d66", drape: "#F4A340", aL: [-52, -98], aR: [32, -66] })}
 ${spark(96, 300, 9, "#F4A340")}${spark(470, 196, 7, "#16A085")}${heart(300, 196, 1.1, "#ef4444")}`,
  maid: () => `<rect width="600" height="450" fill="#E8F5F1"/>${win(48, 60, 150, 160, "#CFEAFB", `<circle cx="118" cy="40" r="16" fill="#FCD34D"/>${cloud(24, 64, .8)}`)}<rect x="26" y="40" width="28" height="196" rx="10" fill="#F4A340"/><rect x="192" y="40" width="28" height="196" rx="10" fill="#F4A340"/>
 <rect x="258" y="70" width="96" height="70" rx="6" fill="#fff"/><rect x="266" y="78" width="80" height="54" fill="#d6efe7"/><path d="M266,132 L292,104 L310,120 L326,106 L346,132Z" fill="#16A085"/>
 <rect x="350" y="232" width="222" height="80" rx="24" fill="#142D4E"/><rect x="336" y="286" width="250" height="60" rx="18" fill="#1d3d66"/><rect x="374" y="246" width="50" height="44" rx="12" fill="#F4A340" transform="rotate(-8 399 268)"/><rect x="484" y="246" width="50" height="44" rx="12" fill="#16A085" transform="rotate(7 509 268)"/>
 ${floorR("#E3CDB0", "#d6bc9a")}<ellipse cx="250" cy="410" rx="190" ry="24" fill="#16A085" opacity=".18"/>${plant(296, 318, .62, "#16A085")}
 ${person({ x: 196, y: 406, s: 1.32, skin: SKIN[1], top: "#F4A340", bottom: "#16A085", drape: "#0e6b5c", aL: [31, -106], aR: [40, -82], hold: `<path d="M28,-124 L62,-4" stroke="#9a6b3f" stroke-width="5" stroke-linecap="round"/><path d="M42,-4 L86,-4 L82,7 L46,7Z" fill="#60a5fa"/>` })}
 ${spark(330, 396, 11, "#fff")}${spark(356, 372, 6, "#FCD34D")}${spark(110, 392, 8, "#fff")}${spark(380, 416, 5, "#FCD34D")}`,
  clean: () => `<rect width="600" height="450" fill="#E3F5F8"/><g stroke="#cdeaf0" stroke-width="2">${[60, 120, 180, 240, 300].map(y => `<path d="M0,${y} H600"/>`).join("")}${[60, 120, 180, 240, 300, 360, 420, 480, 540].map(x => `<path d="M${x},0 V352"/>`).join("")}</g>
 ${win(330, 50, 200, 150, "#bfe3f5", `<path d="M20,150 L120,0 M70,150 L170,0" stroke="#fff" stroke-width="10" opacity=".6"/>`)}
 <rect x="300" y="262" width="270" height="16" rx="4" fill="#f8fafc"/><rect x="310" y="278" width="250" height="80" fill="#0b6476"/><path d="M435,278 V358" stroke="#0a5563" stroke-width="3"/><rect x="420" y="300" width="4" height="18" rx="2" fill="#e2e8f0"/><rect x="446" y="300" width="4" height="18" rx="2" fill="#e2e8f0"/>
 <path d="M500,262 V236 Q500,224 512,224 H526" stroke="#94a3b8" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="340" y="236" width="26" height="26" rx="5" fill="#fde68a"/><rect x="372" y="244" width="16" height="18" rx="3" fill="#F4A340"/>
 ${floorR("#cfe8ec", "#b9dde3")}
 <path d="M70,350 L120,350 L114,404 L76,404Z" fill="#3b82f6"/><path d="M70,350 Q95,330 120,350" stroke="#3b82f6" stroke-width="4" fill="none"/><circle cx="84" cy="346" r="9" fill="#fff"/><circle cx="100" cy="342" r="11" fill="#fff"/><circle cx="114" cy="347" r="8" fill="#fff"/>
 ${person({ x: 230, y: 406, s: 1.32, skin: SKIN[0], top: "#25b8cb", bottom: "#0b6476", drape: "#fde68a", aL: [-44, -100], aR: [44, -120], hold: `<rect x="40" y="-150" width="16" height="28" rx="4" fill="#22c55e"/><rect x="42" y="-160" width="14" height="11" rx="2" fill="#e2e8f0"/><path d="M56,-157 h8" stroke="#e2e8f0" stroke-width="3"/>`, front: `<rect x="-54" y="-108" width="20" height="16" rx="3" fill="#fde047"/>` })}
 ${spark(470, 120, 14, "#fff")}${spark(420, 90, 7, "#fff")}${spark(560, 240, 8, "#fff")}${spark(330, 190, 9, "#fff")}${spark(150, 190, 7, "#25b8cb")}`,
  cook: () => `<rect width="600" height="450" fill="#FFF4E6"/><rect y="168" width="600" height="134" fill="#fff"/><g stroke="#f3e3cc" stroke-width="2">${[198, 228, 258].map(y => `<path d="M0,${y} H600"/>`).join("")}${[40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560].map(x => `<path d="M${x},168 V300"/>`).join("")}</g>
 <rect x="30" y="28" width="250" height="118" rx="10" fill="#16A085"/><path d="M155,28 V146" stroke="#0e8a72" stroke-width="3"/><rect x="140" y="80" width="5" height="22" rx="2" fill="#fff"/><rect x="165" y="80" width="5" height="22" rx="2" fill="#fff"/>
 <rect x="330" y="60" width="240" height="8" rx="3" fill="#b07a4f"/><rect x="330" y="128" width="240" height="8" rx="3" fill="#b07a4f"/>${([["#F4A340", 345], ["#e85d4a", 382], ["#fcd34d", 419], ["#16A085", 456], ["#8b5cf6", 493], ["#F4A340", 530]] as [string, number][]).map(([c, x]) => `<rect x="${x}" y="96" width="26" height="32" rx="5" fill="${c}"/><rect x="${x}" y="90" width="26" height="8" rx="3" fill="#7c4a2a"/>`).join("")}<circle cx="360" cy="48" r="12" fill="#16A085"/><circle cx="392" cy="50" r="10" fill="#22b391"/>
 ${person({ x: 286, y: 420, s: 1.45, female: false, skin: SKIN[1], top: "#fff", bottom: "#374151", drape: "#F4A340", cap: "chef", aL: [-44, -96], aR: [56, -100], hold: `<path d="M54,-100 L86,-120" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>` })}
 <rect x="0" y="296" width="600" height="18" fill="#f1f5f9"/><rect x="0" y="314" width="600" height="140" fill="#0e6b5c"/>${[100, 220, 340, 460].map(x => `<path d="M${x},314 V450" stroke="#0a5a4c" stroke-width="3"/><rect x="${x - 26}" y="336" width="18" height="5" rx="2" fill="#e2e8f0"/>`).join("")}
 <rect x="390" y="288" width="150" height="10" rx="3" fill="#374151"/><rect x="400" y="246" width="76" height="44" rx="8" fill="#b45309"/><rect x="394" y="240" width="88" height="10" rx="5" fill="#92400e"/><path d="M420,232 q-8,-14 0,-26 q8,-12 0,-24 M440,232 q-8,-14 0,-26 q8,-12 0,-24 M460,232 q-8,-14 0,-26 q8,-12 0,-24" stroke="#cbd5e1" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
 <ellipse cx="510" cy="284" rx="24" ry="6" fill="#374151"/><path d="M532,282 L566,276" stroke="#374151" stroke-width="5" stroke-linecap="round"/>
 <ellipse cx="120" cy="292" rx="56" ry="10" fill="#e2e8f0"/><ellipse cx="96" cy="284" rx="12" ry="6" fill="#f59e0b"/><ellipse cx="122" cy="282" rx="12" ry="6" fill="#16a34a"/><ellipse cx="148" cy="284" rx="12" ry="6" fill="#ef4444"/><ellipse cx="120" cy="292" rx="20" ry="4" fill="#fcd9a5"/>`,
  child: () => `<rect width="600" height="450" fill="#FCEFF4"/>${win(50, 58, 140, 150, "#DBEAFE", `${cloud(20, 50, .7)}${cloud(80, 100, .6)}`)}
 <path d="M220,40 Q330,90 440,40" stroke="#e58aa8" stroke-width="2" fill="none"/>${([["#F4A340", 240], ["#16A085", 272], ["#e58aa8", 304], ["#60a5fa", 336], ["#fcd34d", 368], ["#16A085", 400]] as [string, number][]).map(([c, x]) => `<path d="M${x},${(50 + Math.sin((x - 220) / 70) * 14).toFixed(2)} l10,22 l10,-20Z" fill="${c}"/>`).join("")}
 <rect x="408" y="236" width="168" height="112" rx="8" fill="none" stroke="#fff" stroke-width="10"/>${[430, 452, 474, 496, 518, 540].map(x => `<path d="M${x},240 V344" stroke="#fff" stroke-width="6"/>`).join("")}<rect x="414" y="316" width="156" height="22" rx="6" fill="#fbcfe8"/><path d="M492,150 V196" stroke="#cbd5e1" stroke-width="2"/><path d="M462,196 H522" stroke="#cbd5e1" stroke-width="3"/>${spark(466, 212, 8, "#fcd34d")}${spark(492, 216, 8, "#60a5fa")}${spark(518, 212, 8, "#F4A340")}
 ${floorR("#F1DCC8", "#e6caae")}<ellipse cx="300" cy="410" rx="210" ry="28" fill="#F4A340" opacity=".25"/>
 <rect x="96" y="368" width="34" height="34" rx="5" fill="#16A085"/><rect x="132" y="368" width="34" height="34" rx="5" fill="#F4A340"/><rect x="114" y="334" width="34" height="34" rx="5" fill="#60a5fa"/><text x="113" y="392" font-family="Poppins,sans-serif" font-weight="700" font-size="20" fill="#fff" text-anchor="middle">A</text><text x="149" y="392" font-family="Poppins,sans-serif" font-weight="700" font-size="20" fill="#fff" text-anchor="middle">B</text><text x="131" y="358" font-family="Poppins,sans-serif" font-weight="700" font-size="20" fill="#fff" text-anchor="middle">C</text>
 <circle cx="530" cy="396" r="17" fill="#ef4444"/><path d="M513,396 Q530,384 547,396" stroke="#fff" stroke-width="4" fill="none"/>
 ${person({ x: 300, y: 406, s: 1.34, skin: SKIN[2], top: "#e58aa8", bottom: "#8c3d66", drape: "#F4A340", aL: [-30, -94], aR: [16, -88], front: `<ellipse cx="-10" cy="-104" rx="30" ry="15" fill="#fff7d1" stroke="#fde68a" stroke-width="3"/><circle cx="-40" cy="-112" r="12" fill="#d39a6e"/><path d="M-50,-117 Q-40,-128 -30,-117" fill="#2b1d16"/><path d="M-44,-111 q1.5,1.5 3,0 M-38,-111 q1.5,1.5 3,0" stroke="#2b1d16" stroke-width="1.4" fill="none"/><path d="M-43,-106 q3,2 6,0" stroke="#c2410c" stroke-width="1.4" fill="none"/>` })}
 ${heart(240, 196, 1, "#e58aa8")}${heart(372, 170, .7, "#F4A340")}`,
  care: () => `<rect width="600" height="450" fill="#EEF4FB"/>${win(380, 56, 170, 150, "#CFEAFB", `<rect x="70" y="80" width="10" height="70" fill="#7c4a2a"/><circle cx="75" cy="70" r="34" fill="#22b391"/><circle cx="50" cy="88" r="22" fill="#16A085"/><circle cx="102" cy="86" r="24" fill="#16A085"/>`)}
 <circle cx="120" cy="96" r="30" fill="#fff" stroke="#142D4E" stroke-width="5"/><path d="M120,96 V78 M120,96 L134,104" stroke="#142D4E" stroke-width="4" stroke-linecap="round"/>
 <rect x="30" y="226" width="130" height="96" rx="26" fill="#F4A340"/><rect x="20" y="290" width="150" height="56" rx="18" fill="#e08e2b"/><rect x="186" y="294" width="70" height="8" rx="3" fill="#b07a4f"/><path d="M196,302 V354 M246,302 V354" stroke="#b07a4f" stroke-width="5"/><rect x="200" y="272" width="14" height="22" rx="3" fill="#bfdbfe"/><rect x="222" y="282" width="22" height="12" rx="3" fill="#16A085"/>
 ${floorR("#D8CBB8", "#c9b8a1")}${plant(560, 320, .7, "#1d4e89")}<ellipse cx="380" cy="412" rx="170" ry="24" fill="#5b9be0" opacity=".18"/>
 ${person({ x: 330, y: 406, s: 1.26, female: false, elder: true, skin: SKIN[0], top: "#f8fafc", bottom: "#94a3b8", aL: [-30, -66], aR: [30, -80], hold: `<path d="M36,-82 L46,0" stroke="#7c4a2a" stroke-width="5" stroke-linecap="round"/><path d="M26,-84 Q32,-94 38,-84" stroke="#7c4a2a" stroke-width="5" fill="none" stroke-linecap="round"/>` })}
 ${person({ x: 432, y: 406, s: 1.26, skin: SKIN[1], top: "#5b9be0", bottom: "#1d4e89", drape: "#bfdbfe", aL: [-58, -96], aR: [30, -70] })}
 ${heart(392, 178, .9, "#ef4444")}${heart(300, 150, .6, "#5b9be0")}`,
  driver: () => `<rect width="600" height="450" fill="#DBEAFE"/><circle cx="510" cy="80" r="30" fill="#FCD34D"/>${cloud(80, 70, 1.1)}${cloud(330, 50, .8)}
 <g fill="#c7d2fe">${[[20, 170, 60, 180], [90, 130, 50, 220], [150, 190, 70, 160], [400, 150, 60, 200], [470, 110, 50, 240], [530, 180, 70, 170]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`).join("")}</g><g fill="#e0e7ff">${[[100, 150], [100, 180], [420, 170], [480, 130], [480, 160]].map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="14"/><rect x="${x + 20}" y="${y}" width="12" height="14"/>`).join("")}</g>
 <rect x="0" y="330" width="600" height="20" fill="#e5e7eb"/><rect x="0" y="350" width="600" height="100" fill="#374151"/><path d="M0,405 H600" stroke="#fff" stroke-width="5" stroke-dasharray="34 22"/>
 <rect x="566" y="250" width="8" height="82" fill="#7c4a2a"/><circle cx="570" cy="236" r="30" fill="#16A085"/><circle cx="548" cy="254" r="20" fill="#22b391"/>
 <path d="M228,344 Q226,306 262,302 L322,298 Q348,256 392,252 L456,252 Q488,256 512,298 L540,304 Q566,310 566,334 L566,346 L228,346Z" fill="#142D4E"/><path d="M340,298 Q358,266 392,264 L414,264 L414,298Z" fill="#bfdbfe"/><path d="M424,264 L454,264 Q478,268 496,298 L424,298Z" fill="#bfdbfe"/><path d="M418,300 V342" stroke="#0d213a" stroke-width="3"/><rect x="430" y="310" width="16" height="4" rx="2" fill="#94a3b8"/><rect x="546" y="314" width="16" height="8" rx="3" fill="#fde68a"/><rect x="230" y="318" width="12" height="8" rx="3" fill="#ef4444"/>
 <circle cx="292" cy="346" r="26" fill="#111827"/><circle cx="292" cy="346" r="11" fill="#9ca3af"/><circle cx="500" cy="346" r="26" fill="#111827"/><circle cx="500" cy="346" r="11" fill="#9ca3af"/>
 ${person({ x: 166, y: 348, s: 1.22, female: false, skin: SKIN[0], top: "#fff", bottom: "#111827", cap: "driver", aL: [-30, -62], aR: [56, -96], front: `<path d="M-4,-122 L0,-100 L4,-122" stroke="#142D4E" stroke-width="4" fill="none"/>` })}
 ${spark(240, 280, 8, "#fff")}`,
  office: () => `<rect width="600" height="450" fill="#EEF2F7"/><rect x="250" y="40" width="320" height="200" rx="8" fill="#fff"/><rect x="260" y="50" width="300" height="180" fill="#bfdbfe"/><g fill="#93c5fd">${[[270, 130, 40, 100], [320, 90, 50, 140], [380, 140, 40, 90], [430, 100, 50, 130], [490, 150, 60, 80]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join("")}</g><path d="M410,50 V230" stroke="#fff" stroke-width="6"/>
 <rect x="40" y="80" width="150" height="10" rx="3" fill="#b07a4f"/>${([["#16A085", 50], ["#F4A340", 70], ["#1d4e89", 90], ["#e58aa8", 110]] as [string, number][]).map(([c, x]) => `<rect x="${x}" y="40" width="16" height="40" rx="2" fill="${c}"/>`).join("")}
 ${floorR("#cbd5e1", "#b8c3d1")}
 <rect x="300" y="268" width="270" height="14" rx="4" fill="#8b5e3c"/><path d="M314,282 V356 M556,282 V356" stroke="#8b5e3c" stroke-width="8"/><rect x="380" y="206" width="96" height="62" rx="6" fill="#1f2937"/><rect x="386" y="212" width="84" height="48" rx="3" fill="#60a5fa"/><rect x="500" y="246" width="40" height="22" rx="3" fill="#e2e8f0"/>${plant(330, 268, .4, "#F4A340")}
 ${person({ x: 210, y: 408, s: 1.3, female: false, skin: SKIN[1], top: "#16A085", bottom: "#142D4E", aL: [-26, -100], aR: [26, -100], hold: TRAY })}${spark(250, 180, 7, "#F4A340")}`,
};
const sceneCache: Record<string, string> = {};
export function Scene({ k, label }: { k?: string; label?: string }) {
  const key = k && SCENES[k] ? k : "maid";
  const html = sceneCache[key] ??= SCENES[key]();
  return <svg className="scene" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label || ""} dangerouslySetInnerHTML={{ __html: html }} />;
}

export const cssv = (o: Record<string, string | number>) => o as CSSProperties;

/* ---------- Real photography (list lives in PHOTOS in lib/data.ts) ---------- */
/** Local photo from public/images (resized/compressed by next/image), with a fallback (e.g. the illustration) if the file is missing. */
export function Photo({ k, alt, sizes = "(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw", eager, fallback }: { k: string; alt?: string; sizes?: string; eager?: boolean; fallback: ReactNode }) {
  const [bad, setBad] = useState(false);
  const P = PHOTOS[k];
  if (!P || bad) return <>{fallback}</>;
  return <Image src={P.src} alt={alt || P.alt} fill sizes={sizes} priority={eager} quality={78} style={{ objectFit: "cover", objectPosition: "center 30%" }} onError={() => setBad(true)} />;
}
export const PhotoCredit = ({ k }: { k: string }) => { const P = PHOTOS[k]; return P ? <a className="credit" href={P.page} target="_blank" rel="noopener noreferrer">Representative photo · {P.by} / {P.source}</a> : null; };

/** Image slot: admin-uploaded photo → stock photo → illustration (or icon). */
export function Ph({ group, cap, ar = "4/3", icon, img, scene, photo, style, sizes }: { group?: Group | string; cap: string; ar?: string; icon?: string; img?: string; scene?: string; photo?: string; style?: CSSProperties; sizes?: string }) {
  const G = GROUPS[(group as Group)] || GROUPS.maid;
  if (img) return <div className="ph" style={{ ...cssv({ "--ar": ar }), ...style }}><img src={img} alt={cap} loading="lazy" /></div>;
  if (icon && !scene && !photo) return <div className="ph" style={{ ...cssv({ "--g": G.g, "--ar": ar }), ...style }} role="img" aria-label={cap}><Ic n={icon} s={64} sw={1.3} /><span className="cap">{cap}</span></div>;
  const sc = scene || sceneFor({ group: group as string });
  return <div className="ph" style={{ ...cssv({ "--g": G.g, "--ar": ar }), ...style }}><Photo k={photo || sc} alt={cap} sizes={sizes} fallback={<Scene k={sc} label={cap} />} /></div>;
}
