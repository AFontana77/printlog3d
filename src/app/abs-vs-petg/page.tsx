import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ABS vs PETG — Which Is Better for Functional Parts? | PrintLog3D',
  description:
    'ABS vs PETG compared: heat resistance, warp risk, fumes, ease of print, and why PETG wins for most functional parts unless you specifically need ABS\'s higher temperature tolerance.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'ABS vs PETG — Which Is Better for Functional Parts?',
      description:
        "ABS vs PETG compared: heat resistance, warp risk, fumes, ease of print, and why PETG wins for most functional parts unless you specifically need ABS's higher temperature tolerance.",
      url: 'https://www.printlog3d.com/abs-vs-petg',
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
        { '@type': 'ListItem', position: 2, name: 'ABS vs PETG', item: 'https://www.printlog3d.com/abs-vs-petg' },
      ],
    },
  ],
};

export default function AbsVsPetgPage() {
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
              <span>ABS vs PETG</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ABS vs PETG: Which Is Better for Functional Parts?
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              ABS used to be the go-to for strong parts. PETG changed that.
              For most functional prints, PETG is easier, safer, and stronger where it counts.
              This page shows you the four situations where ABS still wins — and when PETG is the smarter call.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-label="ABS vs PETG comparison table" className="py-14 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">See the Key Differences Before You Load the Spool</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="px-4 py-3 font-semibold text-gray-700 w-48">Property</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">ABS</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">PETG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Print temp', '230-250°C', '230-250°C'],
                    ['Bed temp', '100-110°C', '70-85°C'],
                    ['Enclosure', 'Required', 'Not required'],
                    ['Heat resistance', '~100°C deformation', '~80°C deformation'],
                    ['Chemical resistance', 'Good', 'Moderate'],
                    ['Fumes', 'Yes (styrene)', 'Minimal'],
                    ['Warping risk', 'High without enclosure', 'Low'],
                    ['Post-processing', 'Sandable, acetone-smoothable', 'Limited (sanding dulls surface)'],
                    ['Difficulty', 'Advanced', 'Intermediate'],
                  ].map(([prop, abs, petg]) => (
                    <tr key={prop} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{prop}</td>
                      <td className="px-4 py-3 text-gray-600">{abs}</td>
                      <td className="px-4 py-3 text-gray-600">{petg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* When ABS wins */}
        <section aria-label="When ABS is the better choice" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The 4 Situations Where ABS Is the Right Call</h2>
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">1. Parts that need to survive above 80°C</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PETG deforms around 80°C. ABS holds to ~100°C. If your part lives near a heat source
                  — engine bay, oven-adjacent, under-hood — ABS has the edge.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">2. Acetone vapor smoothing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Acetone dissolves ABS surface to create a near-injection-mold finish. No layer lines visible.
                  PETG does not respond to acetone. If surface finish matters, ABS gives you a finishing option
                  that PETG simply doesn't have.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">3. Solvent bonding</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ABS parts can be bonded with acetone or MEK to create joints stronger than adhesive bonding.
                  This is useful for multi-piece assemblies where super glue won't hold the load.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">4. Chemical resistance</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ABS resists many oils and organic solvents better than PETG. For parts that contact
                  lubricants, fuels, or cleaning chemicals, ABS holds up better.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* When PETG wins */}
        <section aria-label="When PETG is the better choice" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Use PETG and Skip the Enclosure, Fumes, and Warping</h2>
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">No enclosure required</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PETG doesn't warp without an enclosed chamber. ABS almost certainly will warp without one —
                  especially on large flat prints. If your printer is open-frame, PETG is the obvious choice.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">No styrene fumes</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ABS emits styrene, a suspected carcinogen. Always print ABS with ventilation or a filtration
                  enclosure. PETG is much safer — no harsh fumes, fine to print in an office or home workspace.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">Better layer adhesion</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PETG bonds between layers better than ABS. For most mechanical loading scenarios,
                  a PETG print is actually stronger than ABS despite the lower heat resistance.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">More forgiving to print</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PETG has a wider process window. ABS requires tight temp control, a warm enclosure,
                  and a hot bed. PETG tolerates more variation and fails less often.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ASA alternative */}
        <section aria-label="ASA as an alternative to ABS" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Outdoor Part? Skip ABS. Use ASA Instead.</h2>
            <p className="text-gray-600 leading-relaxed">
              If you're considering ABS because you need UV resistance outdoors — don't.
              Use ASA. ASA is ABS modified specifically for UV resistance. It doesn't yellow in sunlight,
              handles the same heat range as ABS (~100°C), and is actually easier to print than ABS on
              most setups. ASA has almost entirely replaced ABS for outdoor applications. The only
              reason to pick ABS over ASA outdoors is if you specifically need acetone vapor smoothing.
            </p>
          </div>
        </section>

        {/* Verdict */}
        <section aria-label="Final verdict" className="py-14 px-4 bg-violet-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The One-Sentence Verdict</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Use PETG for 90% of functional parts. It's easier to print, safer to breathe, doesn't need
              an enclosure, and bonds layers better than ABS.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Switch to ABS only if you specifically need heat tolerance above 80°C, acetone smoothing,
              acetone solvent bonding, or chemical resistance that PETG can't provide.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href="/pla-vs-petg" className="text-violet-700 underline hover:text-violet-900">PLA vs PETG</Link>
              <span className="text-gray-300">|</span>
              <Link href="/pla-vs-abs" className="text-violet-700 underline hover:text-violet-900">PLA vs ABS</Link>
              <span className="text-gray-300">|</span>
              <Link href="/3d-printing-filament-guide" className="text-violet-700 underline hover:text-violet-900">All 7 materials</Link>
              <span className="text-gray-300">|</span>
              <Link href="/how-to-dry-filament" className="text-violet-700 underline hover:text-violet-900">Dry your filament</Link>
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Know Your Baseline Before You Load the Next Spool.
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              ABS needs enclosure temps logged. PETG needs retraction dialed per brand.
              Log your enclosure temp, print speed, and bed temp per spool in PrintLog3D.
              Next time you pull out that same material, you start from your last successful print.
              No reprints. No lost settings.
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
