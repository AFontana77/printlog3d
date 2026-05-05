import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Printing Filament Guide — PLA, PETG, ABS, ASA, Nylon, TPU, Resin | PrintLog3D',
  description:
    'The complete 3D printing filament guide: every material type explained with print settings, strengths, weaknesses, and which to use for your project. From PLA for beginners to Nylon for engineering parts.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '3D Printing Filament Guide — PLA, PETG, ABS, ASA, Nylon, TPU, Resin',
      description:
        'The complete 3D printing filament guide: every material type explained with print settings, strengths, weaknesses, and which to use for your project.',
      url: 'https://www.printlog3d.com/3d-printing-filament-guide',
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
        { '@type': 'ListItem', position: 2, name: '3D Printing Filament Guide', item: 'https://www.printlog3d.com/3d-printing-filament-guide' },
      ],
    },
  ],
};

const materials = [
  {
    name: 'PLA',
    printTemp: '190-220°C',
    bedTemp: '45-60°C (optional)',
    enclosure: 'No',
    difficulty: 'Beginner',
    bestFor: 'General printing, models, prototypes',
  },
  {
    name: 'PETG',
    printTemp: '230-250°C',
    bedTemp: '70-85°C',
    enclosure: 'No',
    difficulty: 'Intermediate',
    bestFor: 'Functional parts, mild heat, food-safe',
  },
  {
    name: 'ABS',
    printTemp: '230-250°C',
    bedTemp: '100-110°C',
    enclosure: 'Yes (required)',
    difficulty: 'Advanced',
    bestFor: 'High-heat parts, chemical resistance',
  },
  {
    name: 'ASA',
    printTemp: '240-260°C',
    bedTemp: '90-100°C',
    enclosure: 'Yes (recommended)',
    difficulty: 'Advanced',
    bestFor: 'Outdoor, UV-resistant',
  },
  {
    name: 'Nylon',
    printTemp: '240-280°C',
    bedTemp: '70-90°C',
    enclosure: 'Yes',
    difficulty: 'Advanced',
    bestFor: 'High strength, self-lubricating',
  },
  {
    name: 'TPU',
    printTemp: '220-240°C',
    bedTemp: '30-60°C',
    enclosure: 'No',
    difficulty: 'Intermediate',
    bestFor: 'Flexible parts, gaskets, grips',
  },
  {
    name: 'Resin (SLA/DLP)',
    printTemp: 'N/A (UV cure)',
    bedTemp: 'N/A',
    enclosure: 'No',
    difficulty: 'Intermediate',
    bestFor: 'Ultra-fine detail, jewelry, miniatures',
  },
];

export default function FilamentGuidePage() {
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
              <span>3D Printing Filament Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              3D Printing Filament Guide
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              PrintLog3D's database covers 7 filament types. This guide explains what each one does,
              when to use it, and what settings to start with. Pick your material and skip the guesswork.
            </p>
          </div>
        </section>

        {/* Settings reference table */}
        <section aria-label="Filament settings reference table" className="py-14 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings at a Glance</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="px-4 py-3 font-semibold text-gray-700">Material</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">Print Temp</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">Bed Temp</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">Enclosure</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">Difficulty</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {materials.map((m) => (
                    <tr key={m.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{m.name}</td>
                      <td className="px-4 py-3 text-gray-600">{m.printTemp}</td>
                      <td className="px-4 py-3 text-gray-600">{m.bedTemp}</td>
                      <td className="px-4 py-3 text-gray-600">{m.enclosure}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          m.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                          m.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {m.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{m.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PLA */}
        <section aria-label="PLA filament overview" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">PLA</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              PLA is the most beginner-friendly filament. It prints at low temps, produces no harsh fumes,
              and warps very little. It's made from corn starch, so it's biodegradable.
              The weak point: PLA deforms around 60°C. Leave a PLA print in a hot car and it warps.
              PLA+ versions add impact resistance and some flexibility. For most indoor uses, PLA is still
              the right answer even for experienced printers.
            </p>
            <p className="text-sm text-gray-500">
              Compare options: <Link href="/pla-vs-petg" className="text-violet-700 underline hover:text-violet-900">PLA vs PETG</Link> or <Link href="/pla-vs-abs" className="text-violet-700 underline hover:text-violet-900">PLA vs ABS</Link>
            </p>
          </div>
        </section>

        {/* PETG */}
        <section aria-label="PETG filament overview" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">PETG</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              PETG is the natural step up from PLA. It's stronger, handles more heat (up to ~80°C), and
              some brands are food-safe certified. The trade-off: it strings more than PLA, and it
              bonds aggressively to bare glass beds — use a PEI sheet or glue stick. No enclosure needed.
            </p>
            <p className="text-sm text-gray-500">
              Read the full breakdown: <Link href="/pla-vs-petg" className="text-violet-700 underline hover:text-violet-900">PLA vs PETG</Link> or <Link href="/abs-vs-petg" className="text-violet-700 underline hover:text-violet-900">ABS vs PETG</Link>
            </p>
          </div>
        </section>

        {/* ABS */}
        <section aria-label="ABS filament overview" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">ABS</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              ABS is the classic workhorse — the same plastic used in LEGO bricks. It holds up to ~100°C
              and can be smoothed with acetone vapor for a near-injection-mold finish. The downside:
              it emits styrene fumes during printing (ventilate) and warps badly without an enclosed build
              volume. Most people don't actually need ABS anymore. PETG covers 90% of functional part needs,
              and ASA is a better outdoor choice than ABS.
            </p>
            <p className="text-sm text-gray-500">
              See: <Link href="/abs-vs-petg" className="text-violet-700 underline hover:text-violet-900">ABS vs PETG</Link> and <Link href="/pla-vs-abs" className="text-violet-700 underline hover:text-violet-900">PLA vs ABS</Link>
            </p>
          </div>
        </section>

        {/* ASA */}
        <section aria-label="ASA filament overview" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">ASA</h2>
            <p className="text-gray-600 leading-relaxed">
              ASA is ABS modified for UV resistance. It doesn't yellow in sunlight and handles the same
              temperature range as ABS (~100°C). For almost every outdoor application, ASA is the better
              call over ABS. It needs slightly higher temps than ABS but prints similarly. An enclosure
              is recommended to prevent warping, though it tolerates slightly more draft than ABS.
            </p>
          </div>
        </section>

        {/* Nylon */}
        <section aria-label="Nylon filament overview" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Nylon</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Nylon has the highest strength of any common FDM filament. It's also self-lubricating,
              which makes it ideal for gears, bearings, and moving parts. The major catch: Nylon is
              hygroscopic. It absorbs moisture from open air in as little as 1-2 hours and prints terribly
              when wet. You must store Nylon in an airtight container and dry it before every print run.
            </p>
            <p className="text-sm text-gray-500">
              Read: <Link href="/how-to-dry-filament" className="text-violet-700 underline hover:text-violet-900">How to dry filament</Link>
            </p>
          </div>
        </section>

        {/* TPU */}
        <section aria-label="TPU filament overview" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">TPU</h2>
            <p className="text-gray-600 leading-relaxed">
              TPU is flexible and rubber-like. Shore hardness varies by brand — 95A is common and feels
              similar to a shoe sole. Print slow (30-40 mm/s) and use a direct drive extruder if possible.
              Bowden setups can print TPU but require very low retraction and slower speeds to avoid
              jamming. Good for phone cases, grips, gaskets, and any part that needs to flex and return.
            </p>
          </div>
        </section>

        {/* Resin */}
        <section aria-label="Resin overview" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Resin (SLA/DLP)</h2>
            <p className="text-gray-600 leading-relaxed">
              Resin printing is a completely different process from FDM. SLA and DLP printers use
              UV light to cure liquid photopolymer resin layer by layer. The result: far more detailed
              prints than FDM can produce. The trade-off: liquid resin is toxic and requires careful
              handling, an IPA wash station, and a UV post-cure lamp. Resin is not interchangeable with
              FDM filament — you need a different printer type entirely.
            </p>
          </div>
        </section>

        {/* Decision flowchart */}
        <section aria-label="How to choose your filament" className="py-14 px-4 bg-violet-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Choose</h2>
            <div className="space-y-3">
              {[
                { q: 'Decorative or prototype?', a: 'PLA' },
                { q: 'Functional part, mild heat?', a: 'PETG' },
                { q: 'High heat above 80°C or chemical exposure?', a: 'ABS or ASA' },
                { q: 'Outdoors long-term?', a: 'ASA (not ABS, not PETG)' },
                { q: 'Flexible part?', a: 'TPU' },
                { q: 'Ultra-fine detail?', a: 'Resin (different printer required)' },
                { q: 'Maximum strength?', a: 'Nylon (dry it first)' },
              ].map(({ q, a }) => (
                <div key={q} className="flex gap-4 items-start bg-white rounded-xl px-5 py-4 border border-gray-100">
                  <span className="text-gray-500 text-sm mt-0.5 min-w-[200px]">{q}</span>
                  <span className="font-bold text-violet-700">{a}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-gray-600">
              Need side-by-side detail? See <Link href="/pla-vs-petg" className="text-violet-700 underline hover:text-violet-900">PLA vs PETG</Link>,{' '}
              <Link href="/abs-vs-petg" className="text-violet-700 underline hover:text-violet-900">ABS vs PETG</Link>, or <Link href="/pla-vs-abs" className="text-violet-700 underline hover:text-violet-900">PLA vs ABS</Link>.
              If your prints have problems, start with our guides on <Link href="/3d-print-stringing" className="text-violet-700 underline hover:text-violet-900">stringing</Link> and <Link href="/how-to-dry-filament" className="text-violet-700 underline hover:text-violet-900">drying filament</Link>.
            </p>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              PrintLog3D has settings profiles for all 7 materials.
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Log your prints and find what works for your specific brand and printer. Free.
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
