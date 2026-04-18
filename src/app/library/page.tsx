import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getCategories, toSlug } from '@/lib/items';
import { Database, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PrintLog3D Library — 3D Filament Database",
  description: "Browse filaments by material type — print temp, bed temp, brand comparisons, and print settings guides. Available in the free PrintLog3D app.",
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  PLA: "The most common material — 190-230°C, easy to print, minimal warping.",
  PETG: "Food-safe and impact-resistant — 230-250°C, better heat resistance than PLA.",
  ABS: "High temperature resistance — needs enclosure, 230-250°C, heated bed essential.",
  ASA: "UV-resistant version of ABS — outdoor-safe, similar profile to ABS.",
  Nylon: "High strength and self-lubricating — requires dry storage, 240-280°C.",
  TPU: "Flexible and rubber-like — Shore hardness varies, 220-240°C, direct drive preferred.",
  Resin: "Photopolymer for SLA/DLP printers — ultra-fine detail, different printer type required.",
};

export default async function LibraryPage() {
  const categories = await getCategories();

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
              PrintLog3D Filament Library
            </h1>
            <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
              {categories.reduce((sum, c) => sum + c.count, 0)} filaments across{' '}
              {categories.length} material types. Print temp, bed temp, brand guides, and settings for every major filament category.
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
              Browse by Material
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.category}
                  href={`/library/${toSlug(cat.category)}`}
                  className="group block bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                      {cat.category}
                    </h3>
                    <span className="text-xs font-medium bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full">
                      {cat.count} filament{cat.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {CATEGORY_DESCRIPTIONS[cat.category] ?? `Browse ${cat.count} ${cat.category} filaments with print settings and brand guides.`}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-violet-600 font-medium group-hover:gap-2 transition-all">
                    Browse {cat.category} <ArrowRight size={12} />
                  </div>
                </Link>
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
              The PrintLog3D app gives you the complete filament library with full-text search, filters, and your personal print log — all free.
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
