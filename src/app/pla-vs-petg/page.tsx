import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PLA vs PETG — Which Filament Should You Use? | PrintLog3D',
  description:
    'PLA vs PETG compared side by side: print temperature, heat resistance, flexibility, bed adhesion, and which to use for functional parts, outdoor prints, and food-contact items.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'PLA vs PETG — Which Filament Should You Use?',
      description:
        'PLA vs PETG compared side by side: print temperature, heat resistance, flexibility, bed adhesion, and which to use for functional parts, outdoor prints, and food-contact items.',
      url: 'https://www.printlog3d.com/pla-vs-petg',
      publisher: {
        '@type': 'Organization',
        name: 'PrintLog3D',
        url: 'https://www.printlog3d.com',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
        { '@type': 'ListItem', position: 2, name: 'PLA vs PETG', item: 'https://www.printlog3d.com/pla-vs-petg' },
      ],
    },
  ],
};

export default function PlaVsPetgPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteNav />
      <main id="main-content" className="pt-20">

        {/* Hero */}
        <section aria-label="Page introduction" className="py-16 px-4" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-sm font-medium text-violet-700 mb-3">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span>PLA vs PETG</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              PLA vs PETG: Which Should You Use?
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              Pick the wrong filament and the part fails. Pick the right one and it works for years.
              PLA and PETG cover most of what hobbyists print. This page shows you which to use for every situation.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-label="Side-by-side comparison table" className="py-14 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pick the Right Material in Under a Minute</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="px-4 py-3 font-semibold text-gray-700 w-40">Property</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">PLA</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">PETG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Print temp', '190-220°C', '230-250°C'],
                    ['Bed temp', '45-60°C (or none)', '70-85°C'],
                    ['Enclosure needed', 'No', 'No'],
                    ['Heat resistance', 'Low (~60°C deformation)', 'Moderate (~80°C)'],
                    ['Layer adhesion', 'Good', 'Excellent'],
                    ['UV resistance', 'Poor (yellows outdoors)', 'Moderate'],
                    ['Flexibility', 'Brittle', 'Semi-flexible'],
                    ['Stringing tendency', 'Low', 'Higher'],
                    ['Ease of print', 'Very easy', 'Moderate'],
                    ['Best use cases', 'Decorative prints, prototypes, figures, indoor items', 'Functional parts, brackets, clips, mild outdoor use, food-safe containers (check brand cert)'],
                  ].map(([prop, pla, petg]) => (
                    <tr key={prop} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{prop}</td>
                      <td className="px-4 py-3 text-gray-600">{pla}</td>
                      <td className="px-4 py-3 text-gray-600">{petg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* When to use PLA */}
        <section aria-label="When to use PLA" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use PLA When Heat and Strength Don't Matter</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              PLA works well for anything that stays indoors and stays cool. It prints at the lowest temps, requires no heated bed, and forgives almost every tuning mistake. That makes it ideal for learning a new printer.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Indoor decorative prints, models, and figures</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Rapid prototypes where strength doesn't matter</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Anything that won't see heat above 60°C. Leave PLA in a hot car and it warps.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Dialing in a new printer. PLA is the most forgiving material available.</span></li>
            </ul>
          </div>
        </section>

        {/* When to use PETG */}
        <section aria-label="When to use PETG" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Switch to PETG When the Part Has a Job to Do</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              PETG is the step-up material for parts that actually need to hold up. It handles more stress, more heat, and more flex than PLA — without needing an enclosure.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Functional parts that need to hold together under stress — brackets, clips, mounts</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Anything that might get warm: engine bay accessories, outdoor brackets</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Snap-fit parts that need to flex without snapping</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Food container lids. Check that your brand is food-safe certified — not all PETG is.</span></li>
            </ul>
          </div>
        </section>

        {/* PETG problems */}
        <section aria-label="Common PETG problems and fixes" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fix These Three PETG Issues Before You Waste a Spool</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">1. Sticking too hard to the glass bed</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PETG bonds aggressively to bare glass and will chip it when you remove the print.
                  Fix: apply a thin layer of Elmer's glue stick to the bed before printing, or switch to a PEI sheet. PEI releases PETG cleanly once the bed cools.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">2. More stringing than PLA</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PETG strings more than PLA — some thin wisps are normal. For heavy cobwebbing: reduce print temp by 5°C, increase travel speed, and enable combing mode in your slicer.
                  See our <Link href="/3d-print-stringing" className="text-violet-700 underline hover:text-violet-900">stringing fix guide</Link> for step-by-step settings.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">3. Rough, bubbly top surface</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Rough surfaces often mean wet filament. PETG absorbs moisture within a few days in humid air.
                  Dry it at 65°C for 4-6 hours before printing. See our <Link href="/how-to-dry-filament" className="text-violet-700 underline hover:text-violet-900">filament drying guide</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What PETG is NOT for */}
        <section aria-label="PETG limitations" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Where PETG Falls Short</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">-</span><span>High heat above 80°C. Use ASA or ABS for those applications.</span></li>
              <li className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">-</span><span>Ultra-fine detail. PLA resolves sharper edges at the same layer height.</span></li>
              <li className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">-</span><span>Chemical resistance in harsh solvents. ABS handles more chemicals than PETG.</span></li>
            </ul>
          </div>
        </section>

        {/* Quick verdict */}
        <section aria-label="Quick verdict by use case" className="py-14 px-4 bg-violet-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ten-Second Decision Guide</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Decorative model', answer: 'PLA', color: 'bg-blue-50 border-blue-200' },
                { label: 'Bracket that holds weight indoors', answer: 'PETG', color: 'bg-violet-50 border-violet-200' },
                { label: 'Outdoor sign or mount', answer: 'ASA', color: 'bg-amber-50 border-amber-200' },
                { label: 'Flexible gasket or grip', answer: 'TPU', color: 'bg-green-50 border-green-200' },
              ].map(({ label, answer, color }) => (
                <div key={label} className={`rounded-xl p-4 border ${color}`}>
                  <p className="text-sm text-gray-600 mb-1">{label}</p>
                  <p className="font-bold text-gray-900">{answer}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-600">
              Not sure which material fits your project? See our{' '}
              <Link href="/3d-printing-filament-guide" className="text-violet-700 underline hover:text-violet-900">complete filament guide</Link>{' '}
              for all 7 material types. Or compare{' '}
              <Link href="/abs-vs-petg" className="text-violet-700 underline hover:text-violet-900">ABS vs PETG</Link>{' '}
              and{' '}
              <Link href="/pla-vs-abs" className="text-violet-700 underline hover:text-violet-900">PLA vs ABS</Link>.
            </p>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stop Reprinting Calibration Squares. Build a Settings Library.
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              PETG from one brand and PETG from another need different retraction settings.
              Log your print temp, bed temp, and retraction distance per spool in PrintLog3D.
              Next time you open that same brand, you know the settings that worked.
              No calibration cube. No wasted filament.
            </p>
            <Link
              href="/free-download"
              className="inline-flex items-center justify-center bg-violet-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-violet-800 transition-colors min-h-[48px]"
            >
              Get the Free App
            </Link>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
