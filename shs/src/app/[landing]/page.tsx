import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CityServiceView, PolicyView } from "@/views/public";
import { CITIES, POL, SERVICES, serviceFaqs } from "@/lib/data";
import { meta, JsonLd, breadcrumbLd, serviceLd, faqLd } from "@/lib/seo";

// Handles SEO landing pages such as /maid-service-in-ahmedabad, plus the policy pages (/privacy-policy, …).
type P = { params: Promise<{ landing: string }> };
function parse(slug: string) {
  const i = slug.lastIndexOf("-in-"); if (i < 1) return null;
  return { svc: slug.slice(0, i), city: slug.slice(i + 4) };
}

export const generateStaticParams = () => [
  ...Object.keys(POL).map(landing => ({ landing })),
  ...SERVICES.flatMap(s => CITIES.map(c => ({ landing: `${s.slug}-in-${c.slug}` }))),
];

export async function generateMetadata({ params }: P): Promise<Metadata> {

  const { landing } = await params;
  if (POL[landing]) return meta(POL[landing][0], `${POL[landing][0]} for Smart Home Service.`, `/${landing}`);
  
  const p = parse(landing); const s = p && SERVICES.find(x => x.slug === p.svc), c = p && CITIES.find(x => x.slug === p.city);
  if (!s || !c) return meta("Home services", "Home services in Gujarat", `/${landing}`, { noindex: true });
  return meta(`${s.name} in ${c.name} — Verified & Interviewed`, `Book verified ${s.name.toLowerCase()} in ${c.name}: ${c.areas.slice(0, 4).join(", ")} and nearby areas. Interview before you hire.`, `/${landing}`);
}

export default async function Page({ params }: P) {
  const { landing } = await params;
  if (POL[landing]) return <PolicyView k={landing} />;
  const p = parse(landing); if (!p) notFound();
  const s = SERVICES.find(x => x.slug === p.svc), c = CITIES.find(x => x.slug === p.city);
  return <>
    {s && c && <JsonLd data={[breadcrumbLd([["Locations", "/locations"], [c.name, `/locations/${c.slug}`], [s.name, `/${landing}`]]), serviceLd(s.name, s.short, `${c.name}, Gujarat, India`, `/${landing}`), faqLd(serviceFaqs(`${s.name} in ${c.name}`, ""))]} />}
    <CityServiceView svc={p.svc} city={p.city} />
  </>;
}
