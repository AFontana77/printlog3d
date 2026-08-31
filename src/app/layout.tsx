import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AffiliateClickTracker } from "@/components/analytics/affiliate-click-tracker";
import { OwnedServiceTracker } from "@/components/analytics/owned-service-tracker";
import { MATERIAL_PROFILES } from '@/lib/materials';

// Specified by the brand package. No binaries are redistributed; next/font
// self-hosts them at build time.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const SITE_URL = "https://www.printlog3d.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PrintLog3D: filament print settings by material",
    template: "%s | PrintLog3D",
  },
  description: `Nozzle and bed temperatures, enclosure needs and drying guidance for ${MATERIAL_PROFILES.length} filament materials, from PLA to PEEK. Typical manufacturer-published ranges, one page per material.`,
  keywords: ["filament print settings", "pla print temperature", "petg print temperature", "abs enclosure", "filament drying temperature"],
  authors: [{ name: "Anvil Road LLC" }],
  creator: "Anvil Road LLC",
  publisher: "Anvil Road LLC",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PrintLog3D",
    title: "PrintLog3D: filament print settings by material",
    description: `Nozzle and bed temperatures, enclosure needs and drying guidance for ${MATERIAL_PROFILES.length} filament materials, from PLA to PEEK. Typical manufacturer-published ranges, one page per material.`,
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintLog3D: filament print settings by material",
    description: `Nozzle and bed temperatures, enclosure needs and drying guidance for ${MATERIAL_PROFILES.length} filament materials, from PLA to PEEK. Typical manufacturer-published ranges, one page per material.`,
  },
  alternates: { canonical: SITE_URL },
  icons: {
    // No SVG entry. The old /favicon.svg was a purple "PR" scaffold
    // placeholder, and because browsers PREFER an SVG icon when one is
    // offered, it was outranking these PNGs in the tab. The brand mark is
    // raster artwork, so the PNG set is the honest declaration.
    icon: [
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/brand/favicon-180.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0066FF",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AffiliateClickTracker />
        <OwnedServiceTracker />
        {/* Google Tag Manager - GTM-J369GLG4 */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-J369GLG4');`}
        </Script>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-J369GLG4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>{children}</body>
    </html>
  );
}
