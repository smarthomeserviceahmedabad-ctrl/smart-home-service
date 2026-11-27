import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { ADDR, BRAND, EMAIL, PHONE, SITE } from "@/lib/site";
import { JsonLd } from "@/lib/seo";
import { CITIES } from "@/lib/data";
import { DemoBar, Floating, Footer, ModalRoot, Nav, RevealObserver, Toast, Topbar } from "@/components/chrome";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${BRAND} — Trusted Home Services & Verified Domestic Staff in Gujarat`, template: `%s | ${BRAND}` },
  description: "Book verified maids, cooks, babysitters, japa maids, elderly caretakers, patient attendants and drivers in Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar and across Gujarat.",
  openGraph: { type: "website", siteName: BRAND, locale: "en_IN" },
  twitter: { card: "summary_large_image" }
};

export const viewport: Viewport = { themeColor: "#171715", width: "device-width", initialScale: 1 };

const orgLd = {
  "@context": "https://schema.org", "@type": "Organization", name: BRAND, url: SITE,
  telephone: PHONE.replace(/\s/g, ""), email: EMAIL,
  address: { "@type": "PostalAddress", streetAddress: ADDR.street, addressLocality: `${ADDR.locality}, ${ADDR.city}`, addressRegion: ADDR.region, postalCode: ADDR.pin, addressCountry: ADDR.country },
  contactPoint: { "@type": "ContactPoint", telephone: PHONE.replace(/\s/g, ""), email: EMAIL, contactType: "customer service", areaServed: "IN", availableLanguage: ["English", "Hindi", "Gujarati"] },
  description: "Home services and verified domestic staff booking platform",
  areaServed: CITIES.map(c => ({ "@type": "City", name: c.name, containedInPlace: { "@type": "State", name: "Gujarat" } })),
};
const GA = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <JsonLd data={orgLd} />
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
