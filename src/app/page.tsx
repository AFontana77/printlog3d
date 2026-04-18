import Link from 'next/link';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Database, BookOpen, BarChart3, Star, ArrowRight, Download, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PrintLog3D — Search 1,260 filaments with tested print settings",
  description: "PrintLog3D has 1,260 filaments from Filamentpedia and manufacturer datasheets with print temperatures, bed adhesion, and tested settings. Log your prints and dial in your profiles.",
};

const FEATURES = [
  { icon: Database, title: "Filament database", body: "1,260+ filaments with print temp, bed temp, and known issue notes." },
  { icon: BookOpen, title: "Print log", body: "Log slicer settings, filament batch, nozzle temp, and result for every print." },
  { icon: BarChart3, title: "Settings history", body: "See what actually worked for a given material — your settings, not YouTube." },
  { icon: Star, title: "Failure notes", body: "Log warping, stringing, or layer adhesion issues. Know what to avoid next time." },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PrintLog3D",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "iOS, Android",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Search 1,260+ 3D printing filaments with specs and settings. Log your prints, track results by filament, and build a reference library for your printer.",
            "url": "https://www.printlog3d.com"
          })
        }}
      />
      <SiteNav />
      <main id="main-content" className="pt-20">

        {/* Hero */}
        <section className="py-20 px-4" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-violet-700 bg-violet-50 px-3 py-1 rounded-full mb-6">
              Search 1,260 filaments. Log your own.
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Search 1,260 filaments with tested print settings.
              <br />
              <span className="text-violet-800">Log your prints.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              PrintLog3D brings a curated filament database to every print session. Search PLA, PETG, TPU, ABS, ASA, and specialty materials by brand, temp range, and print characteristics. Log your actual settings for every print — what worked, what didn't, and why. Stop printing from memory.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/library" className="inline-flex items-center justify-center gap-2 bg-violet-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-violet-800 transition-colors press-feedback min-h-[48px]">
                Browse the PrintLog3D Library <ArrowRight size={18} />
              </Link>
              <Link href="/free-download" className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors min-h-[48px]">
                <Download size={18} /> Free Download
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              Free app. No credit card. 1,260 filaments from Filamentpedia + manufacturer datasheets.
            </p>
          </div>
        </section>

        {/* Database pitch */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              The database IS the app.
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Most log apps give you a blank screen. PrintLog3D gives you 1,260 filaments from Filamentpedia + manufacturer datasheets — searchable, organized, and ready to use. Log what you do. Build your personal collection alongside the reference library.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {FEATURES.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 p-5 rounded-xl bg-gray-50 card-hover">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-violet-50 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-violet-700" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 px-4 bg-violet-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Get the free download first.
            </h2>
            <p className="text-gray-600 mb-6">
              Start with the printable reference sheet. Use it today, no app required. When you want the searchable database and log, get the app free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/free-download" className="inline-flex items-center justify-center gap-2 bg-violet-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-violet-800 transition-colors press-feedback min-h-[48px]">
                <Download size={18} /> Get the Free PDF
              </Link>
              <Link href="/library" className="inline-flex items-center justify-center gap-2 border border-violet-200 text-violet-800 font-medium px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors min-h-[48px]">
                Browse the Library
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
