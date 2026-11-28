import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { ADDR, ADDRESS, BRAND, EMAIL, PHONE, PHONE2, SITE, mapsLink } from "@/lib/site";
import { JsonLd } from "@/lib/seo";
import { CITIES, SERVICES } from "@/lib/data";
import { DemoBar, Floating, Footer, ModalRoot, Nav, RevealObserver, Toast, Topbar } from "@/components/chrome";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-poppins", display: "swap" });

// Search terms people use for this business (brand + services + city, incl. Hindi/Gujarati words like aaya, kamwali bai).
const KEYWORDS = [
  "smart home service", "smart home service ahmedabad", "smart home service naranpura",
  "maid service in ahmedabad", "house maid in ahmedabad", "maid agency near me", "maid bureau ahmedabad", "domestic help agency",
  "full time maid", "part time maid", "24 hour maid service", "live in maid", "house servant", "kamwali bai",
  "cook service in ahmedabad", "home cook near me", "baby sitter in ahmedabad", "nanny service", "aaya service", "japa maid ahmedabad",
  "elder care at home", "senior citizen care", "patient care taker at home", "home nursing ahmedabad",
  "driver service in ahmedabad", "office boy service", "domestic staff placement agency gujarat",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${BRAND} Ahmedabad — Maid, Cook, Baby Sitter, Elder Care & Driver Agency`, template: `%s | ${BRAND}` },
  description: "Smart Home Service, Ahmedabad: verified house maids, servants, cooks, baby sitters, nanny/aaya, elder care, patient caretakers, drivers and office boys. Reliable & trained staff across Gujarat. Call +91 81607 35095.",
  applicationName: BRAND,
  keywords: KEYWORDS,
  authors: [{ name: BRAND, url: SITE }],
  creator: BRAND, publisher: BRAND,
  category: "Home services",
  formatDetection: { telephone: true },
  openGraph: { type: "website", siteName: BRAND, locale: "en_IN" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "DC6jvpzWFQBT7ZNnamOGCwTdomEFPOPTlyDWbeIp1pA",
  },
};
export const viewport: Viewport = { themeColor: "#0f2a66", width: "device-width", initialScale: 1 };

const tel = (p: string) => p.replace(/s/g, "");
// WebSite tells Google the site's name (shown above the result); LocalBusiness powers the local / Maps result.
const siteLd = {
  "@context": "https://schema.org", "@type": "WebSite", "@id": SITE + "/#website", name: BRAND,
  alternateName: ["Smart Home Service Ahmedabad", "SmartHomeService", "smarthomeservice.org"], url: SITE + "/", inLanguage: "en-IN",
  publisher: { "@id": SITE + "/#business" },
};
const orgLd = {
  "@context": "https://schema.org", "@type": ["EmploymentAgency", "LocalBusiness"], "@id": SITE + "/#business",
  name: BRAND, alternateName: "Smart Home Service Ahmedabad", slogan: "Trusted Service for a Better Life",
  url: SITE, logo: SITE + "/logo.svg", image: SITE + "/opengraph-image",
  telephone: tel(PHONE), email: EMAIL, priceRange: "₹₹",
  address: { "@type": "PostalAddress", streetAddress: ADDR.street, addressLocality: `${ADDR.locality}, ${ADDR.city}`, addressRegion: ADDR.region, postalCode: ADDR.pin, addressCountry: ADDR.country },
  hasMap: mapsLink(ADDRESS),
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "08:00", closes: "20:00" }],
  contactPoint: [PHONE, PHONE2].map(p => ({ "@type": "ContactPoint", telephone: tel(p), email: EMAIL, contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Hindi", "Gujarati"] })),
  description: "Smart Home Service is a domestic staff placement agency in Naranpura, Ahmedabad providing verified house maids, house servants, cooks, baby sitters, nanny/aaya, elder care, patient caretakers, drivers and office boys.",
  areaServed: CITIES.map(c => ({ "@type": "City", name: c.name, containedInPlace: { "@type": "State", name: "Gujarat" } })),
  hasOfferCatalog: { "@type": "OfferCatalog", name: "Home services", itemListElement: SERVICES.map(sv => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: sv.name, url: `${SITE}/services/${sv.slug}` } })) },
};
const GA = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <JsonLd data={[siteLd, orgLd]} />
        <StoreProvider>
          <Topbar />
          <Nav />
          <DemoBar />
          <main id="app">{children}</main>
          <Footer />
          <Floating />
          <ModalRoot />
          <Toast />
          <RevealObserver />
        </StoreProvider>
        {GA && <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} />
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(GA)});` }} />
        </>}
      </body>
    </html>
  );
}
