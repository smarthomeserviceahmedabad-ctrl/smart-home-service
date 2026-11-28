"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CITY_GRAD, DUTY, GROUPS, LANGS, POL, STAFF_COLOR, STEPS, VER_DESC, VER_ITEMS, WHY, serviceFaqs, today, type Group } from "@/lib/data";
import { useStore } from "@/lib/store";
import { activeCities, activeSvcs, availText, cityBy, cityName, cityOpts, dutyName, fmtDate, landingSlug, normPhone, photoKey, priceText, publicStaff, ranked, readForm, sceneFor, svcBy, svcName, V, type MatchReq } from "@/lib/utils";
import { cssv, Ic, Ph, StarIc } from "@/components/art";
import { Avatar, CityArea, CtaBlock, DemoTag, FaqBlock, Field, Form, InterviewModal, NotFoundView, PageHead, ProCard, QuickEnquiry, ReviewCards, SvcCard, SvcSelect, VerBadge, type Errs } from "@/components/blocks";
import HeroSlider from "@/components/HeroSlider";
import { cityHours, mapsEmbed, mapsLink, PHONE2 } from "@/lib/site";

const groupEntries = () => Object.entries(GROUPS) as [Group, (typeof GROUPS)["maid"]][];

/* ============ HOME ============ */
export function HomeView() {
  const { S, t, setFP, setPref, go, startBooking } = useStore();
  const [g, setG] = useState("all"); const [all, setAll] = useState(false);
  const [minDate, setMinDate] = useState<string>(); useEffect(() => setMinDate(today()), []); // set in the browser so static pages don't freeze the build date
  const st = S.stats; const hasStats = Object.values(st).some(Boolean);
  const featured = ranked(S, {}).slice(0, 4).map(x => x.p);
  const list = activeSvcs(S).filter(s => g === "all" || s.group === g);
  const shown = g === "all" && !all ? list.slice(0, 8) : list;
  const Stat = ({ v, l, i }: { v: string; l: string; i: string }) => <div className="stat"><Ic n={i} s={24} /><b>{v || "—"}</b><span>{l}</span></div>;
  return <>
    <HeroSlider />
    <div className="container search-wrap"><Form className="search" onData={d => {
      setFP({ city: d.s_city, area: d.s_area, service: d.s_svc, duty: d.s_duty });
      setPref({ service: d.s_svc, city: d.s_city, area: d.s_area, duty: d.s_duty, date: d.s_date }); go("/find-professionals");
    }}>
      <CityArea cityName="s_city" areaName="s_area" cityLabel="City" areaLabel="Area / Locality" cityPlaceholder="Select your city" />
      <SvcSelect name="s_svc" label="Service" />
      <Field name="s_duty" label="Duty type" type="select" opts={DUTY.map(d => [d.k, d.n])} placeholder="Select duty type" />
      <Field name="s_date" label="Start date" type="date" min={minDate} />
      <button className="btn btn-primary"><Ic n="search" s={18} /> {t("findBtn")}</button>
    </Form></div>

    <section className="sec-tight"><div className="container"><div className="stats reveal"><Stat v={st.pros} l="Verified Professionals" i="shield" /><Stat v={st.families} l="Happy Families" i="heart" /><Stat v={st.years} l="Years of Experience" i="star" /><Stat v={st.cities} l="Cities Served" i="map" /><Stat v={st.placements} l="Successful Placements" i="check" /></div>
      {!hasStats && <p className="muted small" style={{ textAlign: "center", marginTop: 10 }}>Figures are published from Admin → Content once verified — no placeholder numbers are shown.</p>}</div></section>

    <section className="sec"><div className="container"><div className="sec-head"><span className="eyebrow">Our services</span><h2>Explore our home services</h2><p>From a part-time maid to round-the-clock elder care — every service comes with interviewed, reference-checked professionals.</p></div>
      <div className="pills" role="tablist">{[["all", "All services"], ...groupEntries().map(([k, G]) => [k, G.n])].map(([k, l]) => <button key={k} role="tab" aria-selected={g === k} className={"pill" + (g === k ? " active" : "")} onClick={() => setG(k)}>{l}</button>)}</div>
      <div className="grid g4">{shown.map(s => <SvcCard key={s.slug} s={s} />)}</div>
      {g === "all" && !all && <div style={{ textAlign: "center", marginTop: 30 }}><button className="btn btn-ghost" onClick={() => setAll(true)}>View all {list.length} services <Ic n="arrow" s={16} /></button></div>}
    </div></section>

    <section className="sec sec-white"><div className="container"><div className="sec-head"><span className="eyebrow">Featured professionals</span><h2>Meet professionals ready to help</h2><p>Profiles show first names only. Phone numbers, addresses and identity documents are never shown publicly.</p></div>
      <div className="grid g4">{featured.map(p => <ProCard key={p.id} p={p} />)}</div>
      <div style={{ textAlign: "center", marginTop: 30 }}><Link className="btn btn-navy" href="/find-professionals">Browse all professionals <Ic n="arrow" s={16} /></Link></div>
    </div></section>

    <section className="sec"><div className="container"><div className="sec-head"><span className="eyebrow">Why choose us</span><h2>Trust is built into every step</h2><p>We tell you exactly what has been checked — and what hasn&apos;t yet.</p></div>
      <div className="grid g4">{WHY.map(([i, h, p]) => <div key={h} className="card why reveal"><span className="wi"><Ic n={i} s={22} /></span><div><h4>{h}</h4><p>{p}</p></div></div>)}</div>
    </div></section>

    <section className="sec sec-white"><div className="container"><div className="sec-head"><span className="eyebrow">How it works</span><h2>From enquiry to first day in five steps</h2></div>
      <Timeline />
      <div style={{ textAlign: "center", marginTop: 36 }}><button className="btn btn-primary" onClick={() => startBooking()}>Start your booking <Ic n="arrow" s={16} /></button></div>
    </div></section>

    <section className="sec"><div className="container"><div className="sec-head"><span className="eyebrow">Duty types</span><h2>Help that fits your schedule</h2><p>Pricing depends on the service, hours and city — you always see a quote before confirming.</p></div>
      <div className="grid g4">{DUTY.map(d => <div key={d.k} className="card duty reveal" style={cssv({ "--dc": d.c })}><span className="di"><Ic n={d.ic} s={24} /></span><h3 style={{ fontSize: 18 }}>{d.n}</h3><p className="muted" style={{ fontSize: 14, margin: 0 }}>{d.d}</p><dl><div><dt>Availability</dt><dd>{d.avail}</dd></div><div><dt>Arrangement</dt><dd>{d.arr}</dd></div><div><dt>Pricing</dt><dd>{d.price}</dd></div></dl><button className="btn btn-ghost btn-sm btn-block" style={{ marginTop: 16 }} onClick={() => startBooking({ duty: d.k })}>Book {d.n.split(" ")[0].toLowerCase()} help</button></div>)}</div>
    </div></section>

    <section className="sec sec-white"><div className="container"><div className="sec-head"><span className="eyebrow">Locations</span><h2>Serving families across Gujarat</h2><p>Choose your city to see local services and areas we cover.</p></div>
      <CityCards />
    </div></section>

    <section className="sec"><div className="container"><div className="sec-head"><span className="eyebrow">Reviews</span><h2>What families say</h2><p>Only genuine reviews from completed bookings are published, after admin approval.</p></div>
      <ReviewCards list={S.reviews.filter(r => r.status === "approved").slice(0, 3)} />
      <p style={{ textAlign: "center", marginTop: 22 }} className="muted">Booked with us? <Link className="link" href={S.user ? "/dashboard" : "/login"}>Share your review from your dashboard</Link></p>
    </div></section>

    <section className="sec sec-white"><div className="container"><div className="sec-head"><span className="eyebrow">Blog</span><h2>Latest guides for families</h2></div><BlogGrid limit={3} /></div></section>
    <section className="sec"><div className="container"><div className="sec-head"><span className="eyebrow">About us</span><h2>Smart Home Service — domestic staff agency in Ahmedabad</h2>
      <p>Smart Home Service, Naranpura, Ahmedabad provides reliable and trained house maids, house servants, cooks, baby sitters, nanny / aaya, japa maids, elder care, patient caretakers, drivers and office boys — hourly, part-time, full-time or 24-hour live-in, across Gujarat.</p></div>
      <div className="chips" style={{ justifyContent: "center" }}>{["maid-service", "house-maid", "servant-service", "live-in-maid", "cook-service", "babysitter", "nanny", "japa-maid", "elderly-care", "patient-care", "driver", "office-boy"].map(k => { const s = svcBy(S, k); return s && <Link key={k} className="chip click" href={`/${k}-in-ahmedabad`}>{s.name} in Ahmedabad</Link>; })}</div>
    </div></section>
    <section className="sec sec-white"><div className="container"><div className="sec-head"><span className="eyebrow">FAQ</span><h2>Frequently asked questions</h2></div><FaqBlock list={S.faqs} /></div></section>
    <CtaBlock />
  </>;
}
function Timeline() { return <div className="timeline">{STEPS.map(([i, h, p], n) => <div key={h} className="tstep reveal"><div className="num"><Ic n={i} s={28} /><b>{n + 1}</b></div><div><h4>{h}</h4><p>{p}</p></div></div>)}</div>; }
function CityCards({ big }: { big?: boolean }) {
  const { S } = useStore();
  return <div className="grid g4" style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${big ? 240 : 210}px,1fr))` }}>{activeCities(S).map((c, i) => <Link key={c.slug} className="city-card reveal" href={`/locations/${c.slug}`} style={cssv({ "--g": CITY_GRAD[i % CITY_GRAD.length], ...(big ? { minHeight: "180px" } : {}) })}><span><Ic n="map" s={16} /> {c.areas.length} areas{big ? "" : " listed"}</span><h3>{c.name}</h3><span>{big ? c.areas.slice(0, 3).join(" · ") + "…" : "Maids · Cooks · Nannies · Care →"}</span></Link>)}</div>;
}
function BlogGrid({ limit }: { limit?: number }) {
  const { S } = useStore();
  return <div className="grid g3">{S.blog.slice(0, limit || 99).map(b => <article key={b.slug} className="card svc-card reveal"><Link href={`/blog/${b.slug}`}><Ph group="maid" cap={b.title} ar="16/9" img={b.img} scene={b.cat === "Mother & baby" ? "child" : b.cat === "Elder care" ? "care" : "maid"} photo={b.cat === "Mother & baby" ? "newborn" : undefined} /></Link><div className="svc-body"><div><span className="tag gray">{b.cat}</span></div><h3><Link href={`/blog/${b.slug}`}>{b.title}</Link></h3><p>{b.excerpt}</p><div className="svc-foot"><span className="muted small">{fmtDate(b.date)}</span><Link className="link" href={`/blog/${b.slug}`}>Read →</Link></div></div></article>)}</div>;
}

/* ============ SERVICES ============ */
export function ServicesView() {
  const { S } = useStore(); const [g, setG] = useState("all");
  return <>
    <PageHead title="All Home Services" sub="Every service is delivered by interviewed, reference-checked professionals. Choose a service to see responsibilities, duty schedules and FAQs." cr={[[null, "Services"]]} />
    <section className="sec"><div className="container">
      <div className="pills">{[["all", "All"], ...groupEntries().map(([k, G]) => [k, G.n])].map(([k, l]) => <button key={k} className={"pill" + (g === k ? " active" : "")} onClick={() => setG(k)}>{l}</button>)}</div>
      <div className="grid g4">{activeSvcs(S).filter(s => g === "all" || s.group === g).map(s => <SvcCard key={s.slug} s={s} />)}</div>
    </div></section>
    <CtaBlock />
  </>;
}

export function ServiceDetailView({ slug }: { slug: string }) {
  const { S, startBooking, openWA } = useStore();
  const s = svcBy(S, slug); if (!s || !s.active) return <NotFoundView />;
  const G = GROUPS[s.group];
  const related = activeSvcs(S).filter(x => x.group === s.group && x.slug !== slug).slice(0, 4);
  const pros = ranked(S, { service: slug }).filter(x => x.s >= 50).slice(0, 3);
  const revs = S.reviews.filter(r => r.status === "approved" && (r.service === slug || svcBy(S, r.service)?.group === s.group)).slice(0, 3);
  const duties = DUTY.filter(d => s.group === "clean" ? ["hourly", "part-time"].includes(d.k) : slug === "part-time-maid" ? ["part-time", "hourly"].includes(d.k) : slug === "live-in-maid" ? d.k === "live-in" : true);
  return <>
    <section className="phead"><div className="container split" style={{ alignItems: "center" }}><div>
      <nav className="crumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>›</span><Link href="/services">Services</Link><span>›</span><span style={{ color: "#fff" }}>{s.name}</span></nav>
      <span className="tag" style={{ background: "rgba(255,255,255,.12)", color: "#9be8d6", marginBottom: 12 }}>{G.n}</span>
      <h1>{s.name}</h1><p>{s.short} {G.intro}</p>
      <div className="hero-cta" style={{ marginBottom: 0 }}><button className="btn btn-primary" onClick={() => startBooking({ service: slug })}>Book {s.name} <Ic n="arrow" s={16} /></button><button className="btn btn-wa" onClick={() => openWA(`Hi, I want to enquire about ${s.name}.`)}>WhatsApp enquiry</button></div>
      {priceText(s) && <p style={{ marginTop: 14, color: "#9be8d6", fontWeight: 600 }}>{priceText(s)}</p>}
    </div><div><Ph group={s.group} cap={s.cap} ar="16/10" img={s.img} scene={sceneFor(s)} photo={photoKey(s)} sizes="(max-width: 960px) 100vw, 480px" style={{ borderRadius: 22 }} /></div></div></section>
    <section className="sec"><div className="container split"><div>
      {s.group === "care" && <div className="note warn" style={{ marginBottom: 22 }}><Ic n="care" s={20} /><div><b>Caregiver vs nurse.</b> {slug === "home-nursing" ? "Home nursing is offered only by professionals whose nursing qualifications (e.g. GNM/ANM/B.Sc Nursing and council registration) have been verified by our team. Clinical tasks are done only as prescribed by the treating doctor." : <>Patient and elder caretakers are <b>non-clinical attendants</b>. They help with daily living, hygiene and mobility, and can remind about medicines — they do not administer injections, IVs or change doses. For clinical needs, ask about Home Nursing Assistance, offered only where qualifications are verified.</>}</div></div>}
      <h2>Benefits of our {s.name.toLowerCase()}</h2>
      <div className="grid g2" style={{ marginBottom: 34 }}>{[["shield", "Verified professionals", "Identity, references and interview completed before listing; status shown on every profile."], ["interview", "Interview before you hire", "Meet shortlisted professionals in person or on video."], ["clock", "Flexible schedules", s.group === "clean" ? "One-time, hourly or recurring visits." : "Hourly, part-time, full-time or live-in where available."], ["refresh", "Replacement assistance", "Request a replacement as per our policy if it isn't the right fit."]].map(([i, h, p]) => <div key={h} className="card why"><span className="wi"><Ic n={i} s={20} /></span><div><h4>{h}</h4><p>{p}</p></div></div>)}</div>
      <h2>Responsibilities</h2><ul className="list-check" style={{ marginBottom: 34 }}>{s.resp.map(r => <li key={r}><Ic n="check" s={18} sw={2.4} /><span>{r}</span></li>)}<li><Ic n="check" s={18} sw={2.4} /><span>Exact duties are agreed with you during the interview and written into the service agreement.</span></li></ul>
      <h2>Available staff types & duty schedules</h2><div className="grid g2" style={{ marginBottom: 34 }}>{duties.map(d => <div key={d.k} className="card duty" style={cssv({ "--dc": d.c, padding: "18px" })}><h4 style={{ display: "flex", gap: 8, alignItems: "center" }}><Ic n={d.ic} s={18} /> {d.n}</h4><p className="muted small" style={{ margin: 0 }}>{d.d}</p></div>)}</div>
      <h2>How staff are verified</h2><div className="card pad" style={{ marginBottom: 34 }}><ul className="list-check">{VER_ITEMS.map(([k, l]) => <li key={k}><Ic n="shield" s={18} /><span><b>{l}</b> — {VER_DESC[k]}</span></li>)}</ul></div>
      <h2>How it works</h2><div className="card pad" style={{ marginBottom: 34 }}><ul className="stl">{STEPS.map(([, h, p], n) => <li key={h} className="done"><span className="sd">{n + 1}</span><div><b style={{ color: "var(--navy)" }}>{h}</b><div className="muted small">{p}</div></div></li>)}</ul></div>
      {pros.length > 0 && <><h2>Professionals for {s.name.toLowerCase()}</h2><div className="grid g2" style={{ marginBottom: 34 }}>{pros.map(x => <ProCard key={x.p.id} p={x.p} score={x.s} />)}</div></>}
      <h2>What customers say</h2><div style={{ marginBottom: 34 }}><ReviewCards list={revs} /></div>
      <h2>FAQs</h2><FaqBlock list={serviceFaqs(s.name, priceText(s))} />
      <h2 style={{ marginTop: 34 }}>{s.name} near you</h2><div className="chips">{activeCities(S).map(c => <Link key={c.slug} className="chip click" href={landingSlug(slug, c.slug)}>{s.name} in {c.name}</Link>)}</div>
    </div><aside className="sticky"><QuickEnquiry slug={slug} />{related.length > 0 && <div className="card pad" style={{ marginTop: 18 }}><h4>Related services</h4><ul className="list-check">{related.map(r => <li key={r.slug}><Ic n="arrow" s={16} /><Link href={`/services/${r.slug}`}>{r.name}</Link></li>)}</ul></div>}</aside></div></section>
    <CtaBlock />
  </>;
}

/* ============ FIND PROFESSIONALS ============ */
export function FindView() {
  const { S, FP, setFP, startBooking } = useStore();
  const [k, setK] = useState(0);
  const f = FP; const hasF = Object.entries(f).some(([key, v]) => v && !(key === "gender" && v === "No preference"));
  const list = publicStaff(S).filter(p => (!f.group || p.group === f.group) && (!f.city || p.city === f.city) && (!f.area || p.area === f.area) && (!f.lang || p.langs.includes(f.lang)) && (!f.exp || p.exp >= +f.exp) && (!f.duty || p.duty.includes(f.duty)) && (!f.service || p.services.includes(f.service) || svcBy(S, f.service)?.group === p.group));
  const r = ranked(S, f as MatchReq, list);
  return <>
    <PageHead title="Find a Professional" sub="Filter by profession, language, experience, locality and schedule. Our smart matching ranks profiles against your needs. Only first names are shown — personal details stay private." cr={[[null, "Find a Professional"]]} />
    <section className="sec"><div className="container"><div className="dash" style={{ gridTemplateColumns: "280px 1fr" }}>
      <Form key={k} className="card pad side" style={{ padding: 18 }} onData={() => { }} onChange={form => setTimeout(() => setFP(readForm(form)), 0)}>
        <h4 style={{ display: "flex", gap: 8, alignItems: "center" }}><Ic n="search" s={18} /> Filters</h4>
        <Field name="group" label="Profession" type="select" opts={groupEntries().map(([g, G]) => [g, G.n])} value={f.group} placeholder="Any profession" />
        <SvcSelect name="service" label="Service" value={f.service} placeholder="Any service" />
        <CityArea city={f.city} area={f.area} cityLabel="City" areaLabel="Locality" cityPlaceholder="Any city" areaPlaceholder="Any locality" />
        <Field name="duty" label="Duty schedule" type="select" opts={DUTY.map(d => [d.k, d.n])} value={f.duty} placeholder="Any schedule" />
        <Field name="lang" label="Language" type="select" opts={LANGS} value={f.lang} placeholder="Any language" />
        <Field name="exp" label="Minimum experience" type="select" opts={[["1", "1+ years"], ["3", "3+ years"], ["5", "5+ years"], ["10", "10+ years"]]} value={f.exp} placeholder="Any experience" />
        <Field name="gender" label="Preference (optional)" type="select" opts={["No preference", "Female", "Male"]} value={f.gender || "No preference"} placeholder={false} hint="Used only where relevant to the role, e.g. japa or personal care." />
        <button type="button" className="btn btn-ghost btn-sm btn-block" onClick={() => { setFP({}); setK(k + 1); }}>Clear filters</button>
      </Form>
      <div>
        <div className="h-sec"><h3>{r.length} professional{r.length === 1 ? "" : "s"} found</h3>{hasF && <span className="tag">Sorted by best match</span>}</div>
        {r.length ? <div className="grid g2">{r.map(x => <ProCard key={x.p.id} p={x.p} score={hasF ? x.s : null} />)}</div>
          : <div className="card empty"><Ic n="users" s={40} /><p>No listed professionals match these filters yet.<br />Submit your requirement and our team will search beyond listed profiles.</p><button className="btn btn-primary" onClick={() => startBooking({ service: f.service, city: f.city, duty: f.duty })}>Submit requirement</button></div>}
        <div className="note info" style={{ marginTop: 20 }}><Ic n="lock" s={18} /><div>For everyone&apos;s safety, phone numbers, addresses and identity documents are never displayed. Request an interview and our team will coordinate.</div></div>
      </div>
    </div></div></section>
  </>;
}

export function ProView({ id }: { id: string }) {
  const { S, ready, openModal, startBooking } = useStore();
  const p = S.staff.find(x => x.id === id);
  if (!p || !publicStaff(S).includes(p)) return ready ? <NotFoundView /> : null;
  const avg = p.ratings.length ? (p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length).toFixed(1) : null;
  const c = STAFF_COLOR[p.status];
  return <>
    <PageHead title={`${p.name} — ${p.role}`} sub={`${p.exp} years of experience · ${p.area}, ${cityName(S, p.city)}`} cr={[["/find-professionals", "Professionals"], [null, p.name]]} />
    <section className="sec"><div className="container split"><div className="card pad">
      <div className="pro-top" style={{ marginBottom: 18 }}><Avatar p={p} size={96} /><div><div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><h2 style={{ margin: 0 }}>{p.name}</h2><DemoTag x={p} /></div><div className="muted">{p.role}</div><div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}><VerBadge p={p} /><span className="badge" style={{ background: c + "18", color: c }}>{availText(p)}</span>{avg && <span className="tag orange"><StarIc s={12} /> {avg}</span>}</div></div></div>
      <table className="sumtbl"><tbody>
        <tr><td>Profession</td><td>{p.role}</td></tr><tr><td>Experience</td><td>{p.exp} years</td></tr><tr><td>Skills</td><td>{p.skills.join(", ")}</td></tr><tr><td>Languages</td><td>{p.langs.join(", ")}</td></tr><tr><td>Preferred hours</td><td>{p.hours}</td></tr><tr><td>Duty types</td><td>{p.duty.map(dutyName).join(", ")}</td></tr><tr><td>Available in</td><td>{p.area}, {cityName(S, p.city)}</td></tr>
        <tr><td>Services</td><td>{p.services.map((s, i) => <span key={s}>{i > 0 && ", "}<Link className="link" href={`/services/${s}`}>{svcName(S, s)}</Link></span>)}</td></tr>
      </tbody></table>
      {p.about && <p style={{ marginTop: 16 }}>{p.about}</p>}
      <h3 style={{ marginTop: 26 }}>Verification status</h3>
      <ul className="stl">{VER_ITEMS.map(([k, l]) => { const v = p.ver?.[k] || "Not started"; return <li key={k} className={v === "Done" ? "done" : v === "In progress" ? "cur" : ""}><span className="sd">{v === "Done" ? <Ic n="check" s={14} sw={2.6} /> : v === "In progress" ? <Ic n="clock" s={14} /> : null}</span><div><b style={{ color: "var(--navy)" }}>{l}</b> <span className="muted small">— {v === "Done" ? "Completed" : v}</span></div></li>; })}</ul>
    </div><aside className="sticky"><div className="card pad"><h3>Interested in {p.name}?</h3><p className="muted small">Request an interview and our team will coordinate a convenient time.</p>
      <button className="btn btn-navy btn-block" onClick={() => openModal(`Request interview — ${p.name}`, <InterviewModal id={p.id} />)}><Ic n="interview" s={18} /> Request Interview</button>
      <button className="btn btn-primary btn-block" style={{ marginTop: 8 }} onClick={() => startBooking({ service: p.services[0], city: p.city, area: p.area })}>Book this service</button>
      <div className="note info" style={{ marginTop: 14 }}><Ic n="lock" s={18} /><div className="small">Contact details and documents are kept private and shared only through our team.</div></div>
    </div></aside></div></section>
  </>;
}

/* ============ CONTENT PAGES ============ */
export function AboutView() {
  const { S } = useStore();
  return <>
    <PageHead title={"About " + S.settings.brand} sub="We help families find dependable household help — and help domestic professionals find respectful, fairly paid work." cr={[[null, "About Us"]]} />
    <section className="sec"><div className="container split" style={{ alignItems: "center" }}><div>
      <span className="eyebrow">Our mission</span><h2>Making household help safe, simple and fair</h2>
      <p>Hiring help at home is personal. You are letting someone into your family&apos;s daily life. We built {S.settings.brand} to make that decision easier with clear verification, proper interviews and honest communication at every step.</p>
      <p>For professionals, we offer steady work with families who value them, clear agreements on hours and duties, and support when things don&apos;t work out.</p>
      <div className="grid g2" style={{ marginTop: 22 }}>{[["shield", "Transparency first", "We show what has been verified, and what hasn't yet."], ["heart", "Respect for workers", "Clear duties, agreed rest and fair treatment."], ["headset", "Real support", "A team that answers the phone."], ["map", "Local expertise", "Rooted in Gujarat's cities and neighbourhoods."]].map(([i, h, p]) => <div key={h} className="card why"><span className="wi"><Ic n={i} s={20} /></span><div><h4>{h}</h4><p>{p}</p></div></div>)}</div>
    </div><div><Ph group="maid" cap="Family at home with a professional helper" ar="4/5" scene="family" style={{ borderRadius: 22 }} /></div></div></section>
    <section className="sec sec-white"><div className="container"><div className="sec-head"><span className="eyebrow">Our verification process</span><h2>Seven checks, shown openly</h2></div>
      <div className="grid g4">{VER_ITEMS.map(([k, l], i) => <div key={k} className="card why"><span className="wi"><Ic n={["doc", "id", "police", "users", "interview", "grad", "spark"][i]} s={20} /></span><div><h4>{l}</h4><p>Status visible on every public profile.</p></div></div>)}</div></div></section>
    <CtaBlock />
  </>;
}
export function HowView() {
  return <>
    <PageHead title="How It Works" sub="A simple, transparent process from your first enquiry to your professional's first day." cr={[[null, "How It Works"]]} />
    <section className="sec"><div className="container"><Timeline /></div></section>
    <section className="sec sec-white"><div className="container grid g2">{([["For families", ["Submit your requirement online, by phone or WhatsApp", "Get a call to clarify duties, hours and budget", "Receive shortlisted profiles with verification status", "Interview in person or by video", "Confirm, sign the service agreement and start", "Request a replacement if needed, as per policy"]], ["For professionals", ["Register online with your details and ID", "Complete verification, interview and skills check", "Get matched with families near your locality", "Interview with the family", "Join with clear duties, hours and salary agreed", "Update availability from your staff portal"]]] as [string, string[]][]).map(([h, l]) => <div key={h} className="card pad"><h3>{h}</h3><ul className="list-check">{l.map(x => <li key={x}><Ic n="check" s={18} sw={2.4} /><span>{x}</span></li>)}</ul></div>)}</div></section>
    <CtaBlock />
  </>;
}
export function PricingView() {
  const { S, startBooking } = useStore();
  return <>
    <PageHead title="Pricing & Plans" sub="Clear quotes based on the service, duty type, hours and experience. No hidden charges." cr={[[null, "Pricing"]]} />
    <section className="sec"><div className="container"><div className="sec-head"><span className="eyebrow">Monthly plans</span><h2>Recurring household support</h2></div>
      <div className="grid g3">{S.plans.map(p => <div key={p.id} className="card pad reveal" style={p.featured ? { border: "2px solid var(--green)", boxShadow: "0 20px 50px rgba(22,160,133,.15)" } : undefined}>
        {p.featured && <span className="tag" style={{ marginBottom: 10 }}>Most popular</span>}<h3>{p.name}</h3><p className="muted">{p.desc}</p>
        <div style={{ fontFamily: "var(--fh)", fontSize: 30, color: "var(--navy)", fontWeight: 700, margin: "6px 0 14px" }}>{p.price ? <>₹{Number(p.price).toLocaleString("en-IN")}<span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>/month</span></> : <span style={{ fontSize: 20 }}>Quote on request</span>}</div>
        <ul className="list-check small">{p.features.map(f => <li key={f}><Ic n="check" s={16} sw={2.4} />{f}</li>)}</ul>
        <button className={"btn btn-block " + (p.featured ? "btn-primary" : "btn-ghost")} style={{ marginTop: 18 }} onClick={() => startBooking({ notes: `Interested in ${p.name} plan` })}>Choose {p.name}</button>
      </div>)}</div></div></section>
    <section className="sec sec-white"><div className="container"><div className="sec-head"><span className="eyebrow">By service</span><h2>Starting prices</h2><p>Prices are published only once confirmed by our team. Others are quoted after understanding your requirement.</p></div>
      <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Service</th><th>Category</th><th>Starting price</th><th></th></tr></thead><tbody>{activeSvcs(S).map(s => <tr key={s.slug}><td><Link className="link" href={`/services/${s.slug}`}>{s.name}</Link></td><td>{GROUPS[s.group].n}</td><td>{priceText(s) || <span className="muted">Quote on request</span>}</td><td style={{ textAlign: "right" }}><button className="btn btn-ghost btn-sm" onClick={() => startBooking({ service: s.slug })}>Get quote</button></td></tr>)}</tbody></table></div>
      <div className="grid g2" style={{ marginTop: 30 }}>
        <div className="card pad"><h4>What affects the price</h4><ul className="list-check small">{["Service type and skills required", "Duty type — hourly, part-time, full-time or live-in", "Working hours and number of tasks", "Household size and home size", "Professional's experience", "Locality and travel"].map(x => <li key={x}><Ic n="check" s={16} sw={2.4} />{x}</li>)}</ul></div>
        <div className="card pad"><h4>Payments</h4><p className="small muted">Booking fees and invoices can be paid online with UPI, cards, net banking or wallets once Razorpay is connected. Monthly salaries are settled as agreed in your service agreement.</p><Link className="link" href="/cancellation-policy">Cancellation</Link> · <Link className="link" href="/refund-policy">Refund</Link> · <Link className="link" href="/replacement-policy">Replacement</Link></div>
      </div></div></section>
    <CtaBlock />
  </>;
}
export function LocationsView() {
  const { startBooking } = useStore();
  return <>
    <PageHead title="Our Locations" sub="Choose your city to see local services and the localities we cover." cr={[[null, "Locations"]]} />
    <section className="sec"><div className="container"><div className="note info" style={{ marginBottom: 26 }}><Ic n="clock" s={18} /><div><b>Service hours:</b> Ahmedabad — Mon–Sun · 8:00 AM – 8:00 PM. All other cities — 24/7, day and night.</div></div><CityCards big /><div className="note info" style={{ marginTop: 26 }}><Ic n="map" s={18} /><div>Your city isn&apos;t listed? <button className="link" onClick={() => startBooking()}>Send an enquiry</button> — we&apos;re expanding.</div></div></div></section>
    <CtaBlock />
  </>;
}
export function CityView({ slug }: { slug: string }) {
  const { S, startBooking } = useStore();
  const c = cityBy(S, slug); if (!c || !c.active) return <NotFoundView />;
  const pros = publicStaff(S).filter(p => p.city === slug);
  const top = ["maid-service", "cook-service", "babysitter", "patient-care", "live-in-maid", "japa-maid", "elderly-care", "driver"].map(x => svcBy(S, x)).filter(s => s && s.active);
  return <>
    <PageHead title={`Home Services in ${c.name}`} sub={`Verified maids, cooks, nannies, caregivers and drivers for families across ${c.name} — from ${c.areas[0] || c.name} to ${c.areas[c.areas.length - 1] || c.name}.`} cr={[["/locations", "Locations"], [null, c.name]]} />
    <section className="sec"><div className="container split"><div>
      <div className="note info" style={{ marginBottom: 26 }}><Ic n="clock" s={18} /><div><b>Service hours in {c.name}:</b> {cityHours(slug)}</div></div>
      <h2>Popular services in {c.name}</h2>
      <div className="grid g2" style={{ marginBottom: 34 }}>{top.map(s => s && <Link key={s.slug} className="card why" href={landingSlug(s.slug, slug)}><span className="wi" style={{ background: GROUPS[s.group].g, color: "#fff" }}><Ic n={GROUPS[s.group].ic} s={20} /></span><div><h4>{s.name} in {c.name}</h4><p>{s.short}</p></div></Link>)}</div>
      <h2>Areas we cover in {c.name}</h2><p className="muted">Click your locality to start a booking.</p>
      <div className="chips" style={{ marginBottom: 34 }}>{c.areas.map(a => <button key={a} className="chip click" onClick={() => startBooking({ city: slug, area: a })}><Ic n="map" s={13} /> {a}</button>)}</div>
      <h2>Professionals in {c.name}</h2>
      {pros.length ? <div className="grid g2" style={{ marginBottom: 34 }}>{pros.map(p => <ProCard key={p.id} p={p} />)}</div> : <p className="muted" style={{ marginBottom: 34 }}>Listed profiles are being added for {c.name}. Submit your requirement and our team will shortlist professionals for you.</p>}
      <h2>All services in {c.name}</h2><div className="chips">{activeSvcs(S).map(s => <Link key={s.slug} className="chip click" href={landingSlug(s.slug, slug)}>{s.name}</Link>)}</div>
    </div><aside className="sticky"><QuickEnquiry city={slug} /></aside></div></section>
    <CtaBlock />
  </>;
}
export function CityServiceView({ svc, city }: { svc: string; city: string }) {
  const { S, startBooking } = useStore();
  const c = cityBy(S, city), s = svcBy(S, svc); if (!c || !s || !c.active || !s.active) return <NotFoundView />;
  const pros = ranked(S, { service: svc, city }).filter(x => x.s >= 60).slice(0, 4);
  return <>
    <PageHead title={`${s.name} in ${c.name}`} sub={`${s.short} Available across ${c.areas.slice(0, 5).join(", ")} and nearby localities in ${c.name}.`} cr={[["/locations", "Locations"], [`/locations/${city}`, c.name], [null, s.name]]} />
    <section className="sec"><div className="container split"><div>
      <div className="note info" style={{ marginBottom: 22 }}><Ic n="clock" s={18} /><div><b>{s.name} hours in {c.name}:</b> {cityHours(city)}</div></div>
      <Ph group={s.group} cap={`${s.cap} — ${c.name}`} ar="16/8" img={s.img} scene={sceneFor(s)} photo={photoKey(s)} sizes="(max-width: 960px) 100vw, 720px" style={{ borderRadius: 22 }} />
      <h2 style={{ marginTop: 28 }}>Why families in {c.name} book with us</h2>
      <ul className="list-check" style={{ marginBottom: 28 }}>{[`Professionals living in or near ${c.areas.slice(0, 3).join(", ")} — shorter commutes, better punctuality.`, "Language match: Gujarati and Hindi speaking staff, with English where needed.", "Interview in person or on video before you confirm.", "Replacement assistance as per policy."].map(x => <li key={x}><Ic n="check" s={18} sw={2.4} /><span>{x}</span></li>)}</ul>
      <h2>What&apos;s included</h2><ul className="list-check" style={{ marginBottom: 28 }}>{s.resp.map(r => <li key={r}><Ic n="check" s={18} sw={2.4} /><span>{r}</span></li>)}</ul>
      {pros.length > 0 && <><h2>{s.name} professionals in {c.name}</h2><div className="grid g2" style={{ marginBottom: 28 }}>{pros.map(x => <ProCard key={x.p.id} p={x.p} score={x.s} />)}</div></>}
      <h2>Localities served</h2><div className="chips" style={{ marginBottom: 28 }}>{c.areas.map(a => <button key={a} className="chip click" onClick={() => startBooking({ service: svc, city, area: a })}>{s.name} in {a}</button>)}</div>
      <h2>{s.name} in other cities</h2><div className="chips">{activeCities(S).filter(x => x.slug !== city).map(x => <Link key={x.slug} className="chip click" href={landingSlug(svc, x.slug)}>{x.name}</Link>)}</div>
      <h2 style={{ marginTop: 28 }}>FAQs</h2><FaqBlock list={serviceFaqs(`${s.name} in ${c.name}`, priceText(s))} />
      <p style={{ marginTop: 20 }}><Link className="link" href={`/services/${svc}`}>Full {s.name} details →</Link></p>
    </div><aside className="sticky"><QuickEnquiry slug={svc} city={city} /></aside></div></section>
  </>;
}
export function BlogView() {
  return <><PageHead title="Blog" sub="Practical guides for hiring and working with household help." cr={[[null, "Blog"]]} /><section className="sec"><div className="container"><BlogGrid /></div></section></>;
}
export function PostView({ slug }: { slug: string }) {
  const { S, ready, startBooking } = useStore();
  const b = S.blog.find(x => x.slug === slug); if (!b) return ready ? <NotFoundView /> : null;
  return <>
    <PageHead title={b.title} sub={`${b.cat} · ${fmtDate(b.date)}`} cr={[["/blog", "Blog"], [null, b.title]]} />
    <section className="sec"><article className="container prose" style={{ maxWidth: 760 }}>{b.body.map((p, i) => <p key={i} style={{ fontSize: 17 }}>{p}</p>)}
      <div className="note ok" style={{ marginTop: 26 }}><Ic n="spark" s={18} /><div>Ready to find the right help? <button className="link" onClick={() => startBooking()}>Start your booking</button></div></div>
    </article></section>
  </>;
}
export function ContactView() {
  const { S, update, openModal, closeModal, callNow, openWA } = useStore(); const s = S.settings;
  return <>
    <PageHead title="Contact Us" sub="Questions about services, pricing or an existing booking? We're here to help." cr={[[null, "Contact Us"]]} />
    <section className="sec"><div className="container split">
      <Form className="card pad" onData={(d, f) => {
        const er: Errs = {}; if (!V.name(d.name)) er.name = 1; if (!V.phone(d.phone)) er.phone = 1; if (!V.email(d.email)) er.email = 1; if (!V.req(d.msg)) er.msg = 1; if (Object.keys(er).length) return er;
        update(x => { x.tickets.unshift({ id: "TK-" + Math.random().toString(36).slice(2, 7).toUpperCase(), phone: normPhone(d.phone), name: d.name, email: d.email, subject: d.subject, msg: d.msg, status: "Open", at: new Date().toISOString(), source: "Contact form" }); });
        const waText = `Hi ${s.brand}, ${d.subject}.\n${d.msg}\nName: ${d.name}\nPhone: ${d.phone}${d.email ? "\nEmail: " + d.email : ""}`;
        openWA(waText); // WhatsApp first — connects the customer to us directly
        f.reset(); openModal("Message ready on WhatsApp", <>
          <p>Thank you, {d.name}. WhatsApp has opened with your message. Press <b>Send</b> to reach us instantly, or call us.</p>
          <div className="connect-btns"><button className="btn btn-wa" onClick={() => openWA(waText)}>Continue on WhatsApp</button><button className="btn btn-navy" onClick={callNow}>Call {s.phone}</button></div>
          <p className="muted small" style={{ marginTop: 12 }}>Working hours: {s.hours}</p>
        </>);
      }}>
        <h3>Send us a message</h3>
        <div className="frow"><Field name="name" label="Name" req err="Enter your name" /><Field name="phone" label="Mobile" type="tel" req err="Enter a valid 10-digit mobile number" /></div>
        <Field name="email" label="Email" type="email" err="Enter a valid email" />
        <Field name="subject" label="Subject" type="select" opts={["New service enquiry", "Existing booking", "Staff / job enquiry", "Feedback", "Other"]} value="New service enquiry" placeholder={false} />
        <Field name="msg" label="Message" type="textarea" req err="Please write a message" />
        <button className="btn btn-primary">Send message</button>
      </Form>
      <aside><div className="card pad"><ul className="list-check">
        <li><Ic n="phone" s={18} /><span><b>Call</b><br /><button className="link" onClick={callNow}>Daksh: {s.phone || "+91 XXXXX XXXXX"}</button><br /><a className="link" href={"tel:" + PHONE2.replace(/[^\d+]/g, "")}>Anita: {PHONE2}</a></span></li>
        <li><Ic n="chat" s={18} /><span><b>WhatsApp</b><br /><button className="link" onClick={() => openWA()}>Chat with us</button></span></li>
        <li><Ic n="mail" s={18} /><span><b>Email</b><br /><a className="link" href={`mailto:${s.email}`}>{s.email}</a></span></li>
        <li><Ic n="map" s={18} /><span><b>Office</b><br />{s.address}<br /><a className="link" href={mapsLink(s.address)} target="_blank" rel="noopener noreferrer">Get directions →</a></span></li>
        <li><Ic n="clock" s={18} /><span><b>Hours</b><br />{s.hours}</span></li>
      </ul></div>
        <div className="map-box"><iframe title={`Map: ${s.brand} office`} src={mapsEmbed(s.address)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a className="btn btn-primary btn-sm map-dir" href={mapsLink(s.address)} target="_blank" rel="noopener noreferrer"><Ic n="map" s={15} /> Open in Google Maps</a></div></aside>
    </div></section>
  </>;
}
export function PolicyView({ k }: { k: string }) {
  const [t1, items] = POL[k];
  return <>
    <PageHead title={t1} sub="Template — complete before launch" cr={[[null, t1]]} />
    <section className="sec"><div className="container prose" style={{ maxWidth: 820 }}>
      <div className="note warn" style={{ marginBottom: 24 }}><Ic n="doc" s={18} /><div>Template text — the business owner should complete the bracketed sections and have this reviewed by a legal professional before launch.</div></div>
      <ol>{items.map(i => <li key={i} style={{ marginBottom: 12 }}>{i}</li>)}</ol>
    </div></section>
  </>;
}
