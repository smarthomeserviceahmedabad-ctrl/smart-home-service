"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { blankBooking, seed, T, today, type Booking, type State } from "./data";
import { cityName, dutyName, fmtDate, newId, svcName } from "./utils";
import { OLD_CONTACT, PHONE, WHATSAPP } from "./site";

// Frontend-only persistence. Everything lives in this browser's localStorage.
// To add a real backend later, replace load/save and the actions below with API calls.
const LS = "shs_state_v1";

export type Pref = Partial<Booking> & { coupon?: string; consent?: boolean };
export interface BKState { step: number; d: Pref; done: Booking | null }
export interface Modal { title: string; body: ReactNode; wide?: boolean }

interface Ctx {
  S: State; ready: boolean;
  update: (fn: (d: State) => void) => void;
  replaceState: (s: State) => void;
  t: (k: string) => string;
  toast: (m: string) => void; toastMsg: string; toastOn: boolean;
  modal: Modal | null; openModal: (title: string, body: ReactNode, wide?: boolean) => void; closeModal: () => void;
  BK: BKState; setBK: (fn: (b: BKState) => BKState) => void;
  FP: Record<string, string>; setFP: (f: Record<string, string>) => void;
  startBooking: (pref?: Pref) => void;
  go: (href: string) => void;
  openWA: (text?: string) => void; callNow: () => void; enquiryText: (b: Booking) => string;
  admin: boolean; setAdmin: (v: boolean) => void;
  chatOpen: boolean; setChatOpen: (v: boolean) => void;
  menuOpen: boolean; setMenuOpen: (v: boolean) => void;
  createBooking: (d: Pref) => Booking;
  /** Pre-fill the next booking (used by the home search widget). */
  setPref: (p: Pref) => void;
}
const StoreCtx = createContext<Ctx | null>(null);
export const useStore = () => { const c = useContext(StoreCtx); if (!c) throw new Error("useStore outside provider"); return c; };

export function StoreProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [S, setS] = useState<State>(seed);
  const [ready, setReady] = useState(false);
  const [toastMsg, setToastMsg] = useState(""); const [toastOn, setToastOn] = useState(false);
  const tt = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [modal, setModal] = useState<Modal | null>(null);
  const [BK, setBKs] = useState<BKState>({ step: 1, d: {}, done: null });
  const [FP, setFP] = useState<Record<string, string>>({});
  const prefRef = useRef<Pref | null>(null);
  const [admin, setAdminS] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS);
      if (raw) {
        const d: Partial<State> = JSON.parse(raw);
        if (d && d.v === 1) {
          const base = seed();
          const normalizePartTimeHours = (text: string) => text.replace(/2\s*[-–—]\s*4/g, "4-5");
          const services = (d.services || base.services).map(s => s.slug === "part-time-maid"
            ? { ...s, short: normalizePartTimeHours(s.short), features: s.features.map(normalizePartTimeHours) }
            : s);
          const plans = (d.plans || base.plans).map(p => p.id === "essential"
            ? { ...p, desc: normalizePartTimeHours(p.desc), features: p.features.map(normalizePartTimeHours) }
            : p);
          // Fill contact details that were saved empty in older versions with the business defaults.
          const st = { ...base.settings, ...(d.settings || {}) };
          for (const k of ["phone", "wa", "email", "address"] as const) if (!st[k]) st[k] = base.settings[k];
          if (st.address === "Ahmedabad, Gujarat" || st.address.includes("Pushpak Apartment")) st.address = base.settings.address; // old address
          if (st.phone.replace(/\D/g, "").endsWith(OLD_CONTACT.wa.slice(2))) st.phone = base.settings.phone; // old number
          if (!st.hours || st.hours === "Mon–Sun · 8:00 AM – 8:00 PM") st.hours = base.settings.hours; // old hours
          if (st.wa.replace(/\D/g, "").endsWith(OLD_CONTACT.wa.slice(2))) st.wa = base.settings.wa;
          setS({ ...base, ...d, services, plans, settings: st });
        }
      }
    } catch { /* ignore */ }
    try { setAdminS(sessionStorage.getItem("shs_admin") === "1"); } catch { /* ignore */ }
    setReady(true);
  }, []);

  const toast = useCallback((m: string) => { setToastMsg(m); setToastOn(true); clearTimeout(tt.current); tt.current = setTimeout(() => setToastOn(false), 3200); }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(LS, JSON.stringify(S)); } catch { toast("Browser storage is full — try a smaller image."); }
    document.documentElement.lang = S.lang;
  }, [S, ready, toast]);

  const update = useCallback((fn: (d: State) => void) => setS(prev => { const d = structuredClone(prev); fn(d); return d; }), []);
  const setBK = useCallback((fn: (b: BKState) => BKState) => setBKs(fn), []);
  const go = useCallback((href: string) => router.push(href), [router]);

  const value = useMemo<Ctx>(() => {
    const t = (k: string) => T[S.lang]?.[k] || T.en[k] || k;
    const startBooking = (pref?: Pref) => {
      const d: Pref = { extra: [], days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ...(prefRef.current || {}), ...(pref || {}) };
      prefRef.current = null;
      if (S.user) { d.name ||= S.user.name; d.phone ||= S.user.phone; d.email ||= S.user.email || ""; if (S.user.addresses?.[0]) d.address ||= S.user.addresses[0]; }
      setBKs({ step: 1, d, done: null }); setModal(null); router.push("/book");
    };
    const waNum = (S.settings.wa || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || WHATSAPP).replace(/\D/g, "");
    const openWA = (text?: string) => {
      if (!waNum) { toast("Add the WhatsApp Business number in Admin → Settings to enable WhatsApp chat."); return; }
      window.open("https://wa.me/" + waNum + "?text=" + encodeURIComponent(text || "Hi Smart Home Service, I would like to enquire about home services."), "_blank", "noopener");
    };
    const callNow = () => { const p = S.settings.phone || process.env.NEXT_PUBLIC_PHONE || PHONE; location.href = "tel:" + p.replace(/[^\d+]/g, ""); };
    /** WhatsApp message containing the enquiry, so our team gets every detail in the chat. */
    const enquiryText = (b: Booking) => [
      `Hi ${S.settings.brand}, I just sent an enquiry on your website.`,
      `Booking ID: ${b.id}`,
      `Service: ${svcName(S, b.service)}${b.extra?.length ? " + " + b.extra.map(x => svcName(S, x)).join(", ") : ""}`,
      `Location: ${[b.area, cityName(S, b.city)].filter(Boolean).join(", ")}${b.pin ? " - " + b.pin : ""}`,
      b.duty && `Duty: ${dutyName(b.duty)}`,
      b.date && `Start: ${fmtDate(b.date)}${b.start && b.duty !== "live-in" ? `, ${b.start}–${b.end}` : ""}${b.days?.length ? ` (${b.days.join(", ")})` : ""}`,
      (b.family || b.home) && `Household: ${[b.family && b.family + " members", b.home].filter(Boolean).join(", ")}`,
      b.resp && `Work needed: ${b.resp}`,
      b.notes && `Notes: ${b.notes}`,
      `Name: ${b.name}`, `Phone: ${b.phone}`, b.email && `Email: ${b.email}`, b.address && `Address: ${b.address}`,
    ].filter(Boolean).join("\n");
    const createBooking = (d: Pref): Booking => {
      const now = new Date().toISOString();
      const b: Booking = { ...blankBooking(), id: newId(), created: now, status: "New Enquiry", history: [{ s: "New Enquiry", at: now }], name: "", phone: "", service: "", city: "", ...d } as Booking;
      delete (b as Pref).consent; b.coupon = (b.coupon || "").toUpperCase();
      update(s => {
        s.bookings.unshift(b);
        const c = s.customers[b.phone] || { name: b.name, phone: b.phone, email: b.email, addresses: [], created: now };
        c.name = b.name || c.name; if (b.email) c.email = b.email; if (b.address && !c.addresses.includes(b.address)) c.addresses.push(b.address);
        s.customers[b.phone] = c;
      });
      // WhatsApp first: open the chat with the full enquiry so the customer connects to us directly.
      // (Runs inside the form's submit click, so browsers allow the new tab / app switch.)
      openWA(enquiryText(b));
      return b;
    };
    return {
      S, ready, update, replaceState: setS, t, toast, toastMsg, toastOn,
      modal, openModal: (title, body, wide) => setModal({ title, body, wide }), closeModal: () => setModal(null),
      BK, setBK, FP, setFP: (f) => { setFP(f); },
      startBooking, go, openWA, callNow, enquiryText,
      admin, setAdmin: (v) => { setAdminS(v); try { if (v) sessionStorage.setItem("shs_admin", "1"); else sessionStorage.removeItem("shs_admin"); } catch { /* ignore */ } },
      chatOpen, setChatOpen, menuOpen, setMenuOpen, createBooking,
      setPref: (p) => { prefRef.current = p; },
    };
  }, [S, ready, update, toast, toastMsg, toastOn, modal, BK, setBK, FP, go, admin, chatOpen, menuOpen, router]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
export { today };
