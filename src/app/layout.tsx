import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Fira_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AffiliateClickTracker } from "@/components/analytics/affiliate-click-tracker";

const chakraPetch = Chakra_Petch({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const firaSans = Fira_Sans({
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
  description: "Nozzle and bed temperatures, enclosure needs and drying guidance for 17 filament materials, from PLA to PEEK. Typical manufacturer-published ranges, one page per material.",
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
    description: "Nozzle and bed temperatures, enclosure needs and drying guidance for 17 filament materials, from PLA to PEEK. Typical manufacturer-published ranges, one page per material.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintLog3D: filament print settings by material",
    description: "Nozzle and bed temperatures, enclosure needs and drying guidance for 17 filament materials, from PLA to PEEK. Typical manufacturer-published ranges, one page per material.",
  },
  alternates: { canonical: SITE_URL },
  // No apple-touch-icon is declared: public/icons/icon-192.png does not
  // exist, and pointing at a missing file is worse than omitting it.
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#6D28D9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${chakraPetch.variable} ${firaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AffiliateClickTracker />
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
