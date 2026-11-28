"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { HS_BG, HS_FLOAT } from "@/lib/data";
import { useStore } from "@/lib/store";
import { routeForLink } from "@/lib/utils";
import { cssv, Ic, Photo, PhotoCredit, Scene } from "./art";
import { Hi } from "./blocks";

export default function HeroSlider() {
  const { S, t, startBooking, go } = useStore();
  const sl = S.slides.filter(x => x.active);
  const [i, setI] = useState(0); const [cycle, setCycle] = useState(0);
  const [hover, setHover] = useState(false); const [user, setUser] = useState(false);
  const paused = hover || user;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const n = sl.length; const sec = S.sliderSec || 6;
  const goTo = useCallback((k: number) => { setI(((k % n) + n) % n); setCycle(c => c + 1); }, [n]);
  useEffect(() => { try { if (matchMedia("(prefers-reduced-motion: reduce)").matches) setUser(true); } catch { /* ignore */ } }, []);
  useEffect(() => { clearTimeout(timer.current); if (paused || n < 2) return; timer.current = setTimeout(() => goTo(i + 1), sec * 1000); return () => clearTimeout(timer.current); }, [i, cycle, paused, n, sec, goTo]);
  const x0 = useRef<number | null>(null);
  if (!n) return <section className="hs" style={{ minHeight: 220 }} />;
  const cur = Math.min(i, n - 1);
  const slideGo = (link: string) => { if (!link || link.startsWith("book")) { const s = link.split(":")[1]; startBooking(s ? { service: s } : undefined); } else go(routeForLink(link)); };
  return <section className={"hs" + (paused ? " paused" : "")} aria-roledescription="carousel" aria-label="Highlights" tabIndex={-1} style={cssv({ "--dur": sec + "s" })}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    onTouchStart={e => { x0.current = e.touches[0].clientX; }} onTouchEnd={e => { if (x0.current == null) return; const dx = e.changedTouches[0].clientX - x0.current; if (Math.abs(dx) > 45) goTo(cur + (dx < 0 ? 1 : -1)); x0.current = null; }}
    onKeyDown={e => { if (e.key === "ArrowRight") goTo(cur + 1); if (e.key === "ArrowLeft") goTo(cur - 1); }}>
    <div className="hs-track">{sl.map((x, k) => {
      const T0 = k === 0 && S.lang !== "en"; const f1 = HS_FLOAT[k % 4], f2 = HS_FLOAT[(k + 1) % 4];
      const H = k === 0 ? "h1" : "h2";
      return <div key={x.id} className={"hs-slide" + (k === cur ? " on" : "")} role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} aria-hidden={k !== cur} style={cssv({ "--bg": x.bg || HS_BG[k % HS_BG.length] })}>
        <div className="hs-deco" />
        <div className="container hs-inner">
          <div className="hs-text">
            <span className="eyebrow" style={{ color: "#ffd84d" }}>{x.eyebrow}</span>
            <H className="hs-title">{T0 ? t("heroT") : <Hi text={x.title} />}</H>
            <p className="lead">{T0 ? t("heroS") : x.sub}</p>
            <div className="hero-cta"><button className="btn btn-primary" onClick={() => slideGo(x.link)} tabIndex={k === cur ? 0 : -1}>{x.cta || t("book")} <Ic n="arrow" s={16} /></button><button className="btn btn-light" onClick={() => go("/services")} tabIndex={k === cur ? 0 : -1}>{t("explore")}</button></div>
            <div className="hero-points"><span><Ic n="shield" s={16} /> ID & reference checked</span><span><Ic n="interview" s={16} /> Interview before you hire</span><span><Ic n="refresh" s={16} /> Replacement assistance</span></div>
          </div>
          <div className="hs-artwrap">
            <div className="hs-art">{x.img ? <img src={x.img} alt={x.alt || x.eyebrow} /> : <><Photo k={x.scene} sizes="(max-width: 960px) 100vw, 600px" eager={k === 0} fallback={<Scene k={x.scene} label={x.eyebrow} />} /><PhotoCredit k={x.scene} /></>}</div>
            <div className="float-card" style={{ left: -22, top: 28 }}><span className="fi" style={{ background: "var(--green-l)", color: "var(--green)" }}><Ic n={f1[0]} s={20} /></span><div><b>{f1[1]}</b>{f1[2]}</div></div>
            <div className="float-card" style={{ right: -14, bottom: 36, animationDelay: "1.5s" }}><span className="fi" style={{ background: "var(--orange-l)", color: "#c26a0a" }}><Ic n={f2[0]} s={20} /></span><div><b>{f2[1]}</b>{f2[2]}</div></div>
          </div>
        </div>
      </div>;
    })}</div>
    {n > 1 && <div className="container hs-ctrl">
      <button className="hs-btn" onClick={() => goTo(cur - 1)} aria-label="Previous slide"><Ic n="back" s={20} sw={2} /></button>
      <div className="hs-dots">{sl.map((x, k) => <button key={x.id} className={"hs-dot" + (k === cur ? " on" : "")} onClick={() => goTo(k)} aria-label={`Go to slide ${k + 1}`} aria-current={k === cur ? "true" : undefined}><i key={k === cur ? "c" + cycle : "i"} /></button>)}</div>
      <button className="hs-btn" onClick={() => goTo(cur + 1)} aria-label="Next slide"><Ic n="arrow" s={20} sw={2} /></button>
      <span className="hs-count">{String(cur + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
      <button className="hs-btn hs-pp" onClick={() => setUser(!user)} aria-label={user ? "Play slideshow" : "Pause slideshow"}><Ic n={user ? "play" : "pause"} s={18} sw={2} /></button>
    </div>}
  </section>;
}
