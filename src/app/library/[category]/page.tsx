import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getAllFilaments, getCategories, toSlug, type FilamentItem } from '@/lib/items';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Thermometer, Layers, Download } from 'lucide-react';

const CATEGORY_META: Record<
  string,
  { description: string; enclosure: string; speed: string }
> = {
  PLA: {
    description:
      'The most beginner-friendly filament. Minimal warping, wide temperature range, biodegradable. Ideal for decorative prints and general prototyping.',
    enclosure: 'Not required',
    speed: '40-80 mm/s',
  },
  PETG: {
    description:
      'Stronger than PLA with better heat resistance. Semi-flexible, food-safe when printed correctly. Great for functional parts and outdoor use.',
    enclosure: 'Recommended',
    speed: '30-60 mm/s',
  },
  ABS: {
    description:
      'The classic engineering filament. High temperature resistance but requires enclosure. Use for automotive, electrical housings, and high-heat environments.',
    enclosure: 'Required',
    speed: '40-60 mm/s',
  },
  ASA: {
    description:
      'UV-resistant version of ABS. The choice for outdoor parts. Similar print profile to ABS but withstands sunlight without degradation.',
    enclosure: 'Required',
    speed: '40-60 mm/s',
  },
  Nylon: {
    description:
      'The most durable common filament. Flexible, impact-resistant, self-lubricating. Requires dry storage and high temperatures.',
    enclosure: 'Strongly recommended',
    speed: '30-50 mm/s',
  },
  TPU: {
    description:
      'Flexible and rubber-like. Shore hardness varies by brand. Essential for phone cases, gaskets, and wearable prints.',
    enclosure: 'Not required',
    speed: '15-30 mm/s',
  },
  Resin: {
    description:
      'Photopolymer resin for SLA/DLP printers. Ultra-fine detail (25-50 micron layers). Different printer type required — not FDM.',
    enclosure: 'N/A (resin printer)',
    speed: 'N/A (layer-based exposure)',
  },
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: toSlug(c.category) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const allFilaments = await getAllFilaments();
  const matched = allFilaments.find((f) => toSlug(f.category) === category);
  if (!matched) return {};
  const cat = matched.category;
  return {
    title: `${cat} 3D Printing Filament — Brands, Settings & Guide`,
    description: CATEGORY_META[cat]?.description ?? `Browse ${cat} filaments with print settings, brand comparisons, and temperature guides.`,
  };
}

function TempBadge({ label, value }: { label: string; value: string | number | undefined }) {
  if (!value && value !== 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-800 px-2 py-0.5 rounded-full font-medium">
      {label}: {value}
    </span>
  );
}

function FilamentCard({ filament, categorySlug }: { filament: FilamentItem; categorySlug: string }) {
  const slug = toSlug(filament.name);
  const brand = filament.data?.brand;
  const printTemp = filament.data?.print_temp_c_range;
  const bedTemp = filament.data?.bed_temp_c;
  const cost = filament.data?.cost_per_kg_usd;

  return (
    <Link
      href={`/library/${categorySlug}/${slug}`}
      className="group block bg-white rounded-xl border border-gray-100 p-5 hover:border-violet-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors leading-snug">
          {filament.name}
        </h3>
        {brand && (
          <span className="flex-shrink-0 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {brand}
          </span>
        )}
      </div>
      {filament.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
          {filament.description}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {printTemp && <TempBadge label="Print" value={`${printTemp}°C`} />}
        {bedTemp !== undefined && <TempBadge label="Bed" value={`${bedTemp}°C`} />}
        {cost !== undefined && (
          <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            ${cost}/kg
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-violet-600 font-medium group-hover:gap-2 transition-all">
        View settings <ArrowRight size={12} />
      </div>
    </Link>
  );
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const allFilaments = await getAllFilaments();
  const filaments = allFilaments.filter((f) => toSlug(f.category) === category);

  if (filaments.length === 0) {
    notFound();
  }

  const catName = filaments[0].category;
  const meta = CATEGORY_META[catName];

  // Aggregate quick-reference data from filaments in this category
  const printTemps = filaments
    .map((f) => f.data?.print_temp_c_range)
    .filter(Boolean) as string[];
  const bedTemps = filaments
    .map((f) => f.data?.bed_temp_c)
    .filter((v): v is number => v !== null && v !== undefined);
  const minBed = bedTemps.length ? Math.min(...bedTemps) : null;
  const maxBed = bedTemps.length ? Math.max(...bedTemps) : null;

  // Derive a representative print temp range across the category
  const allLows: number[] = [];
  const allHighs: number[] = [];
  for (const pt of printTemps) {
    const parts = pt.split('-').map(Number).filter((n) => !isNaN(n));
    if (parts.length === 2) { allLows.push(parts[0]); allHighs.push(parts[1]); }
    else if (parts.length === 1) { allLows.push(parts[0]); allHighs.push(parts[0]); }
  }
  const minPrint = allLows.length ? Math.min(...allLows) : null;
  const maxPrint = allHighs.length ? Math.max(...allHighs) : null;
  const printTempRange =
    minPrint && maxPrint ? `${minPrint}–${maxPrint}°C` : 'Varies by brand';
  const bedTempRange =
    minBed !== null && maxBed !== null ? `${minBed}–${maxBed}°C` : 'Varies by brand';

  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="px-4 py-3 bg-white border-b border-gray-100">
          <ol className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-violet-700 transition-colors">Home</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li><Link href="/library" className="hover:text-violet-700 transition-colors">Library</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">{catName}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="py-14 px-4" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-700 bg-violet-100 px-3 py-1 rounded-full mb-5">
              <Thermometer size={12} /> {filaments.length} filaments
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {catName} 3D Printing Filament — Brands, Settings &amp; Guide
            </h1>
            {meta && (
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                {meta.description}
              </p>
            )}
          </div>
        </section>

        {/* Quick reference table */}
        <section className="py-10 px-4 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Layers size={18} className="text-violet-600" />
              {catName} Print Settings Quick Reference
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Setting</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Typical Range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">Print temp</td>
                    <td className="px-4 py-3 text-gray-600">{printTempRange}</td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">Bed temp</td>
                    <td className="px-4 py-3 text-gray-600">{bedTempRange}</td>
                  </tr>
                  {meta && (
                    <>
                      <tr className="border-b border-gray-50">
                        <td className="px-4 py-3 text-gray-700 font-medium">Enclosure</td>
                        <td className="px-4 py-3 text-gray-600">{meta.enclosure}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-700 font-medium">Typical speed</td>
                        <td className="px-4 py-3 text-gray-600">{meta.speed}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Filament grid */}
        <section className="py-14 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {catName} Filaments ({filaments.length})
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filaments.map((f) => (
                <FilamentCard key={f.name} filament={f} categorySlug={category} />
              ))}
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section className="py-14 px-4 bg-violet-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Log your {catName} prints in PrintLog3D
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Track every {catName} print — slicer settings, filament batch, bed adhesion, and results.
              The free app keeps your settings history so you always know what worked.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/free-download"
                className="inline-flex items-center justify-center gap-2 bg-violet-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-violet-800 transition-colors min-h-[48px]"
              >
                <Download size={18} /> Free Download
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center justify-center gap-2 border border-violet-200 text-violet-800 font-medium px-8 py-3 rounded-xl hover:bg-violet-100 transition-colors min-h-[48px]"
              >
                All Categories
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
