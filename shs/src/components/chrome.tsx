"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DUTY, GROUPS, type Group } from "@/lib/data";
import { useStore } from "@/lib/store";
import { activeCities, activeSvcs, cityName, cityOpts, dutyName, ranked, svcName, V } from "@/lib/utils";
import { Ic, LogoMark, Wordmark } from "./art";
import { mapsLink, PHONE2 } from "@/lib/site";
import { UrgentModal } from "./blocks";

export const NAV: [string, string][] = [["/", "home"], ["/about-us", "about"], ["/services", "services"], ["/find-professionals", "find"], ["/locations", "locations"], ["/how-it-works", "how"], ["/pricing", "pricing"], ["/blog", "blog"], ["/contact-us", "contact"]];

function isActive(path: string, h: string) {
  if (h === "/") return path === "/";
  if (path === h || path.startsWith(h + "/")) return true;
  if (h === "/locations" && /-in-[a-z]+$/.test(path)) return true;
  if (h === "/find-professionals" && path.startsWith("/professionals")) return true;
  return false;
}

export function Topbar() {
  const { S, t, update, callNow, openWA, openModal } = useStore(); const s = S.settings;
  const soc: [keyof typeof s, string][] = [["fb", "f"], ["ig", "ig"], ["li", "in"], ["yt", "yt"]];
  return <div className="topbar"><div className="container">
    <div className="tb-group">
      <button className="tb" onClick={callNow}><Ic n="phone" s={14} /> {s.phone || "+91 XXXXX XXXXX"}</button>
      <button className="tb" onClick={() => openWA()}><Ic n="chat" s={14} /> WhatsApp</button>
      <a className="hide-sm" href={`mailto:${s.email}`}><Ic n="mail" s={14} /> {s.email}</a>
      <span className="tb-hours"><Ic n="clock" s={14} /> {s.hours}</span>
    </div>
    <div className="tb-group">
      <span className="hide-sm"><Ic n="map" s={14} /> {s.availability}</span>
      <button className="tb urgent-link" onClick={() => openModal("Urgent requirement", <UrgentModal />)}><Ic n="bolt" s={14} /> {t("urgent")}</button>
      {soc.map(([k, l]) => s[k] ? <a key={k} className="soc hide-sm" href={String(s[k])} target="_blank" rel="noopener noreferrer" aria-label={k}>{l}</a> : <span key={k} className="soc hide-sm" title="Add link in Admin → Settings">{l}</span>)}
      <select className="lang-sel" aria-label="Language" value={S.lang} onChange={e => update(d => { d.lang = e.target.value; })}><option value="en">English</option><option value="hi">हिन्दी</option><option value="gu">ગુજરાતી</option></select>
    </div>
  </div></div>;
}

export function Nav() {
  const { S, t, startBooking, setMenuOpen, menuOpen, openModal } = useStore();
  const path = usePathname() || "/";
  useEffect(() => { setMenuOpen(false); }, [path, setMenuOpen]);
  const acct = S.user ? <Link className="btn btn-ghost btn-sm" href="/dashboard"><Ic n="user" s={16} /> {S.user.name.split(" ")[0]}</Link> : <Link className="btn btn-ghost btn-sm" href="/login"><Ic n="user" s={16} /> {t("login")}</Link>;
  return <>
    <header className="nav"><div className="container">
      <Link className="logo" href="/" aria-label={`${S.settings.brand} home`}><LogoMark size={42} /><span><Wordmark brand={S.settings.brand} /><small>Home services you can trust</small></span></Link>
      <nav className="nav-links" aria-label="Main">{NAV.map(([h, k]) => <Link key={h} href={h} className={isActive(path, h) ? "active" : ""}>{t(k)}</Link>)}</nav>
      <button className="hamb" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}><Ic n="menu" s={22} /></button>
      <div className="nav-cta">{acct}<button className="btn btn-primary btn-sm" onClick={() => startBooking()}>{t("book")}</button></div>
    </div></header>
    <div className={"mmenu" + (menuOpen ? " open" : "")} onClick={e => { if (e.target === e.currentTarget) setMenuOpen(false); }}>
      <div className="panel" role="dialog" aria-label="Menu">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><b className="logo" style={{ fontSize: 17 }}><LogoMark size={34} /><span><Wordmark brand={S.settings.brand} /></span></b><button className="xbtn" onClick={() => setMenuOpen(false)} aria-label="Close menu"><Ic n="x" /></button></div>
        {NAV.map(([h, k]) => <Link key={h} href={h}>{t(k)} <Ic n="arrow" s={16} /></Link>)}
        <Link href={S.user ? "/dashboard" : "/login"}>{S.user ? "My Dashboard" : t("login")} <Ic n="arrow" s={16} /></Link>
        <Link href="/staff-registration">Join as a Professional <Ic n="arrow" s={16} /></Link>
        <Link href="/track">Track Booking <Ic n="arrow" s={16} /></Link>
        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          <button className="btn btn-primary" onClick={() => { setMenuOpen(false); startBooking(); }}>{t("book")}</button>
          <button className="btn btn-ghost" onClick={() => { setMenuOpen(false); openModal("Urgent requirement", <UrgentModal />); }}><Ic n="bolt" s={16} /> {t("urgent")}</button>
        </div>
      </div>
    </div>
  </>;
}

export function Footer() {
  const { S, update, toast, callNow, openWA } = useStore(); const s = S.settings;
  return <footer className="site"><div className="container"><div className="fgrid">
    <div><Link className="logo" href="/"><LogoMark size={42} /><span><Wordmark brand={s.brand} /></span></Link>
      <p style={{ marginTop: 14 }}>A home-services platform connecting families across Gujarat with interviewed, reference-checked domestic professionals — maids, cooks, nannies, caregivers and drivers.</p>
      <form className="news" onSubmit={e => { e.preventDefault(); const f = e.currentTarget; const v = (f.elements.namedItem("nl") as HTMLInputElement).value.trim(); if (!V.emailReq(v)) { toast("Please enter a valid email."); return; } update(d => { if (!d.subscribers.find(x => x.email === v)) d.subscribers.push({ email: v, at: new Date().toISOString() }); }); f.reset(); toast("Subscribed — thank you!"); }}>
        <label className="sr" htmlFor="nl">Email for newsletter</label><input id="nl" name="nl" type="email" placeholder="Your email for tips & offers" required /><button className="btn btn-green btn-sm">Subscribe</button>
      </form></div>
    <div><h4>Services</h4><ul>{activeSvcs(S).slice(0, 11).map(x => <li key={x.slug}><Link href={`/services/${x.slug}`}>{x.name}</Link></li>)}<li><Link href="/services" style={{ color: "var(--orange)" }}>View all services →</Link></li></ul></div>
    <div><h4>Cities</h4><ul>{activeCities(S).map(c => <li key={c.slug}><Link href={`/locations/${c.slug}`}>Home services in {c.name}</Link></li>)}</ul></div>
    <div><h4>Quick Links</h4><ul>{([["/about-us", "About Us"], ["/how-it-works", "How It Works"], ["/find-professionals", "Find a Professional"], ["/pricing", "Pricing / Plans"], ["/track", "Track Booking"], ["/staff-registration", "Join as a Professional"], ["/staff-portal", "Staff Login"], ["/blog", "Blog"], ["/admin", "Admin Panel"]] as const).map(([h, l]) => <li key={h}><Link href={h}>{l}</Link></li>)}</ul></div>
    <div><h4>Contact</h4><ul>
      <li><button className="tb" onClick={callNow}><Ic n="phone" s={15} /> {s.phone || "+91 XXXXX XXXXX"} (Daksh)</button></li>
      <li><a href={"tel:" + PHONE2.replace(/[^\d+]/g, "")}><Ic n="phone" s={15} /> {PHONE2} (Anita)</a></li>
      <li><button className="tb" onClick={() => openWA()}><Ic n="chat" s={15} /> WhatsApp us</button></li>
      <li><a href={`mailto:${s.email}`}><Ic n="mail" s={15} /> {s.email}</a></li>
      <li><a href={mapsLink(s.address)} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: 6, alignItems: "flex-start" }}><Ic n="map" s={15} style={{ marginTop: 3 }} /> <span>{s.address}</span></a></li>
      <li><Ic n="clock" s={15} /> {s.hours}</li>
    </ul></div>
  </div>
    <div className="fbottom"><span>© {new Date().getFullYear()} {s.brand}. All rights reserved.</span><div className="links"><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-and-conditions">Terms & Conditions</Link><Link href="/cancellation-policy">Cancellation Policy</Link><Link href="/replacement-policy">Replacement Policy</Link><Link href="/refund-policy">Refund Policy</Link></div></div>
  </div></footer>;
}

export function Floating() {
  const { t, callNow, openWA, startBooking, chatOpen, setChatOpen } = useStore();
  return <>
    <button className="fab fab-chat" onClick={() => setChatOpen(!chatOpen)} aria-label="Open enquiry assistant"><Ic n="chat" s={26} /></button>
    <button className="fab fab-wa" onClick={() => openWA()} aria-label="Chat on WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.03c-.25.69-1.44 1.32-2 1.37-.51.05-.99.24-3.33-.69-2.82-1.11-4.6-3.99-4.74-4.18-.14-.18-1.13-1.5-1.13-2.86 0-1.36.71-2.03.97-2.31.25-.28.55-.35.73-.35l.53.01c.17.01.4-.06.62.47.25.6.85 2.07.92 2.22.07.15.12.32.02.51-.1.18-.15.3-.3.46-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.05 1.13 1.01 2.09 1.32 2.39 1.47.3.15.47.12.64-.07.18-.2.74-.86.94-1.16.2-.3.39-.25.66-.15.27.1 1.73.82 2.03.97.3.15.49.22.56.35.07.12.07.72-.18 1.41z" /></svg></button>
    <div className="mbar"><button className="btn btn-wa" onClick={() => openWA()}>WhatsApp</button><button className="btn btn-primary" onClick={() => startBooking()}>{t("book")}</button><button className="btn btn-ghost" onClick={callNow}><Ic n="phone" s={16} /> Call</button></div>
    <Chat />
  </>;
}

/* ---------- Guided enquiry assistant ---------- */
function Chat() {
  const { S, chatOpen, setChatOpen, startBooking, openWA } = useStore();
  const [step, setStep] = useState(0); const [d, setD] = useState<Record<string, string>>({});
  const hello = () => [{ b: 1, t: `Hi! I'm the ${S.settings.brand} assistant. I'll help you find the right help in under a minute. What do you need?` }];
  const [msgs, setMsgs] = useState<{ b: number; t: string }[]>([]);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => { if (chatOpen && !msgs.length) setMsgs(hello()); }, [chatOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight; }, [msgs]);
  const restart = () => { setStep(0); setD({}); setMsgs(hello()); };
  const pick = (v: string, label: string) => {
    const nd = { ...d }; const m = [...msgs, { b: 0, t: label }];
    if (step === 0) { nd.group = v; m.push({ b: 1, t: "Great choice. Which of these fits best?" }); }
    else if (step === 1) { nd.service = v; m.push({ b: 1, t: "Which city are you in?" }); }
    else if (step === 2) { nd.city = v; m.push({ b: 1, t: "How many hours of help do you need?" }); }
    else if (step === 3) { nd.duty = v; const n = ranked(S, { service: nd.service, city: nd.city, duty: nd.duty }).filter(x => x.s >= 60).length; m.push({ b: 1, t: `Perfect — ${svcName(S, nd.service)}, ${dutyName(nd.duty)} in ${cityName(S, nd.city)}. ${n ? `I found ${n} listed professional${n > 1 ? "s" : ""} who could match.` : "Our team will search for professionals near you."} Shall I start your booking with these details?` }); }
    setD(nd); setMsgs(m); setStep(step + 1);
  };
  let qr: [string, string][] = [];
  if (step === 0) qr = (Object.entries(GROUPS) as [Group, { n: string }][]).map(([k, g]) => [k, g.n]);
  if (step === 1) qr = activeSvcs(S).filter(s => s.group === d.group).map(s => [s.slug, s.name]);
  if (step === 2) qr = cityOpts(S);
  if (step === 3) qr = DUTY.map(x => [x.k, x.n]);
  return <div className={"chat" + (chatOpen ? " open" : "")} role="dialog" aria-label="Enquiry assistant">
    <div className="chat-h"><span className="logo-mark" style={{ width: 40, height: 40 }}><Ic n="chat" s={20} /></span><div style={{ flex: 1 }}><b>Enquiry assistant</b><small>Guided helper · usually helps in 4 taps</small></div><button className="xbtn" style={{ background: "rgba(255,255,255,.15)", color: "#fff" }} onClick={() => setChatOpen(false)} aria-label="Close assistant"><Ic n="x" /></button></div>
    <div className="chat-b" ref={body}>
      {msgs.map((m, i) => <div key={i} className={"msg " + (m.b ? "bot" : "me")}>{m.t}</div>)}
      {qr.length > 0 && <div className="qr">{qr.map(([v, l]) => <button key={v} onClick={() => pick(v, l)}>{l}</button>)}</div>}
      {step === 4 && <div className="qr"><button onClick={() => { setChatOpen(false); startBooking({ service: d.service, city: d.city, duty: d.duty, source: "Assistant" }); }}>Yes, continue booking</button><button onClick={() => openWA(`Hi, I need ${svcName(S, d.service)} (${dutyName(d.duty)}) in ${cityName(S, d.city)}.`)}>Send on WhatsApp</button><button onClick={restart}>Start over</button></div>}
    </div>
    <div style={{ padding: "8px 14px", fontSize: 11, color: "var(--muted)", borderTop: "1px solid var(--line)" }}>Guided assistant. Free-text AI chat can be connected later.</div>
  </div>;
}

export function ModalRoot() {
  const { modal, closeModal, setMenuOpen } = useStore();
  useEffect(() => { const k = (e: KeyboardEvent) => { if (e.key === "Escape") { closeModal(); setMenuOpen(false); } }; document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [closeModal, setMenuOpen]);
  if (!modal) return null;
  return <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
    <div className={"modal" + (modal.wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={modal.title}>
      <div className="mhead"><h3>{modal.title}</h3><button className="xbtn" onClick={closeModal} aria-label="Close"><Ic n="x" /></button></div>
      <div className="mbody">{modal.body}</div>
    </div>
  </div>;
}
export function Toast() { const { toastMsg, toastOn } = useStore(); return <div id="toast" className={toastOn ? "show" : ""} role="status" aria-live="polite">{toastMsg}</div>; }

/** Adds the "in" class to .reveal elements as they scroll into view (works for content rendered later too). */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) { document.querySelectorAll(".reveal").forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
    const scan = () => document.querySelectorAll(".reveal:not(.in)").forEach(e => io.observe(e));
    scan(); const mo = new MutationObserver(scan); mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [path]);
  return null;
}
/** Announcement strip under the menu. */
export function DemoBar() {
  const { S, openWA } = useStore();
  return <div className="demo-bar">
    <span>🏠 Trusted maids, cooks, nannies &amp; caregivers for Ahmedabad &amp; Gujarat — <b>interview before you hire</b>.</span>{" "}
    <button className="link" style={{ color: "var(--gold-text)" }} onClick={() => openWA()}>WhatsApp {S.settings.phone} →</button>
  </div>;
}
