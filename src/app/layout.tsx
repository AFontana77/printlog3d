import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Fira_Sans } from "next/font/google";
import "./globals.css";

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
    default: "PrintLog3D — Search 1,260+ filaments with tested print settings",
    template: "%s | PrintLog3D",
  },
  description: "PrintLog3D has 1,260+ filaments from Filamentpedia and manufacturer datasheets with print temperatures, bed adhesion, and tested settings. Log your prints and dial in your profiles.",
  keywords: ["3d printing log app", "filament tracker", "print settings log", "3d printer journal", "filament database app"],
  authors: [{ name: "Anvil Road LLC" }],
  creator: "Anvil Road LLC",
  publisher: "Anvil Road LLC",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PrintLog3D",
    title: "PrintLog3D — Search 1,260+ filaments with tested print settings",
    description: "PrintLog3D has 1,260+ filaments from Filamentpedia and manufacturer datasheets with print temperatures, bed adhesion, and tested settings. Log your prints and dial in your profiles.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PrintLog3D" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintLog3D — Search 1,260+ filaments with tested print settings",
    description: "PrintLog3D has 1,260+ filaments from Filamentpedia and manufacturer datasheets with print temperatures, bed adhesion, and tested settings. Log your prints and dial in your profiles.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/icons/icon-192.png",
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
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
