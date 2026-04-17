import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Database, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PrintLog3D Library — 1,260 Filaments",
  description: "Filaments from leading brands — print temp, bed temp, cooling, retraction, and known issues. Browse the PrintLog3D reference database — available in the free app.",
};

const CATEGORIES = [
  { name: "PLA", detail: "The most common material — 180-230°C, easy to print, no heated bed required." },
  { name: "PETG", detail: "Food-safe and flexible — 220-250°C, bed adhesion key, less warping than ABS." },
  { name: "TPU / Flexible", detail: "Shore hardness ratings, slow print speed requirements, no retraction tips." },
  { name: "ABS / ASA", detail: "High temp and UV resistant — needs enclosure, 220-250°C, heated bed essential." },
  { name: "Specialty", detail: "PA Nylon, PC, CF blends — hardened nozzle required, profile guidance." },
];

export default function LibraryPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="py-16 px-4" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex w-14 h-14 bg-violet-50 rounded-2xl items-center justify-center mb-6">
              <Database className="text-violet-700" size={28} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              PrintLog3D Library
            </h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
              1,260 filaments from 30 brands across 21 material types. Filaments from leading brands — print temp, bed temp, cooling, retraction, and known issues.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-violet-800 bg-violet-50 px-4 py-2 rounded-full">
              <Search size={14} /> Full search available in the free app
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat) => (
                <div key={cat.name} className="bg-gray-50 rounded-xl p-6 card-hover border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{cat.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{cat.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section className="py-16 px-4 bg-violet-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search the full database in the app.
            </h2>
            <p className="text-gray-600 mb-6">
              The PrintLog3D app has the complete 1,260 filaments with full-text search, filters, and your personal log — all free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors min-h-[48px]">
                App Store
              </a>
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors min-h-[48px]">
                Google Play
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-400">Free. No subscription. No credit card.</p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
