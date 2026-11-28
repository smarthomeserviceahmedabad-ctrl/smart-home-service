import type { Metadata } from "next";
import { PostView } from "@/views/public";
import { BLOG_SEED } from "@/lib/data";
import { BRAND, SITE } from "@/lib/site";
import { meta, JsonLd, breadcrumbLd } from "@/lib/seo";

type P = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => BLOG_SEED.map(b => ({ slug: b.slug }));

export async function generateMetadata({ params }: P): Promise<Metadata> {

  const { slug } = await params; const b = BLOG_SEED.find(x => x.slug === slug);
  if (!b) return meta("Article", "Smart Home Service blog", `/blog/${slug}`, { noindex: true });
  return meta(b.title, b.excerpt, `/blog/${b.slug}`, { type: "article" });
  
}

export default async function Page({ params }: P) {

  const { slug } = await params; const b = BLOG_SEED.find(x => x.slug === slug);
  return <>
    {b && <JsonLd data={[breadcrumbLd([["Blog", "/blog"], [b.title, `/blog/${b.slug}`]]), { "@context": "https://schema.org", "@type": "Article", headline: b.title, description: b.excerpt, datePublished: b.date, dateModified: b.date, image: `${SITE}/opengraph-image`, author: { "@type": "Organization", name: BRAND, url: SITE }, publisher: { "@type": "Organization", name: BRAND, url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/logo.svg` } }, mainEntityOfPage: `${SITE}/blog/${b.slug}` }]} />}
    <PostView slug={slug} />
  </>;

}
