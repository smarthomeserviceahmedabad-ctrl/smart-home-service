import type { Metadata } from "next";
import { CityView } from "@/views/public";
import { CITIES } from "@/lib/data";
import { meta, JsonLd, breadcrumbLd } from "@/lib/seo";

type P = { params: Promise<{ city: string }> };
export const generateStaticParams = () => CITIES.map(c => ({ city: c.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {

  const { city } = await params; const c = CITIES.find(x => x.slug === city);
  if (!c) return meta("Location", "Home services in Gujarat", `/locations/${city}`, { noindex: true });
  return meta(`Maid, Cook, Babysitter & Caregiver Services in ${c.name}`, `Verified maids, cooks, babysitters, japa maids, elderly caretakers and drivers in ${c.name} — ${c.areas.slice(0, 4).join(", ")} and more.`, `/locations/${c.slug}`);
  
}

export default async function Page({ params }: P) {
  const { city } = await params; const c = CITIES.find(x => x.slug === city);
  return <>{c && <JsonLd data={breadcrumbLd([["Locations", "/locations"], [c.name, `/locations/${c.slug}`]])} />}<CityView slug={city} /></>;
}
