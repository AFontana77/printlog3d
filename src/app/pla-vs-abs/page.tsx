import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PLA vs ABS — When to Upgrade and When to Stick with PLA | PrintLog3D',
  description:
    "PLA vs ABS compared: why most beginners don't need ABS, when ABS's heat resistance and machinability are worth the hassle, and the better upgrade path (PLA to PETG to ASA).",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'PLA vs ABS — When to Upgrade and When to Stick with PLA',
      description:
        "PLA vs ABS compared: why most beginners don't need ABS, when ABS's heat resistance and machinability are worth the hassle, and the better upgrade path.",
      url: 'https://www.printlog3d.com/pla-vs-abs',
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
        { '@type': 'ListItem', position: 2, name: 'PLA vs ABS', item: 'https://www.printlog3d.com/pla-vs-abs' },
      ],
    },
  ],
};

export default function PlaVsAbsPage() {
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
              <span>PLA vs ABS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              PLA vs ABS: When to Upgrade and When to Stay Put
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              Most beginners assume ABS is the next step after PLA. It isn't.
              For most printers, PETG is a better upgrade than ABS — easier to print, no fumes, no enclosure required.
              This page shows you when ABS is actually worth the hassle and when to stay on PLA.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-label="PLA vs ABS comparison table" className="py-14 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">PLA vs ABS: Know the Gap Before You Switch</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-violet-50">
                    <th className="px-4 py-3 font-semibold text-gray-700 w-44">Property</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">PLA</th>
                    <th className="px-4 py-3 font-semibold text-violet-700">ABS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Print temp', '190-220°C', '230-250°C'],
                    ['Bed temp', 'Optional (45-60°C)', '100-110°C (required)'],
                    ['Enclosure', 'No', 'Required'],
                    ['Heat resistance', '~60°C deformation', '~100°C deformation'],
                    ['Strength', 'Moderate', 'High'],
                    ['Post-processing', 'Limited', 'Sandable, acetone-smoothable'],
                    ['Fumes', 'None', 'Styrene (ventilate)'],
                    ['Difficulty', 'Easy', 'Hard'],
                  ].map(([prop, pla, abs]) => (
                    <tr key={prop} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{prop}</td>
                      <td className="px-4 py-3 text-gray-600">{pla}</td>
                      <td className="px-4 py-3 text-gray-600">{abs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Why most don't need ABS */}
        <section aria-label="Why most printers don't need ABS" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Three Reasons ABS Will Frustrate You Before It Helps You</h2>
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">1. Warping is a real problem</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ABS warps badly without an enclosed, heated chamber. If your printer doesn't have an
                  enclosure, you will fight warping on almost every ABS print — especially on larger parts.
                  PLA prints flat without any of this friction.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">2. The fumes require real ventilation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ABS emits styrene during printing. Styrene is a suspected carcinogen. You need active
                  ventilation or HEPA filtration to print ABS safely. PLA is essentially odorless.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">3. Better options exist for most use cases</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  PETG is stronger than PLA, handles up to 80°C, and doesn't need an enclosure. For outdoor
                  use, ASA is UV-stable and easier to print than ABS. For most people, ABS is never the
                  right next step after PLA.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The upgrade path */}
        <section aria-label="The better filament upgrade path" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Upgrade Path That Gets You Printing Better Parts Faster</h2>
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-start mb-6">
              {[
                { label: 'PLA', sub: 'Learn the printer' },
                { label: 'PETG', sub: 'Functional parts' },
                { label: 'ASA', sub: 'Outdoor parts' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 text-center">
                    <p className="font-bold text-violet-700">{step.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{step.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-gray-400 font-bold text-lg hidden sm:block">→</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">
              ABS is a side branch for specific needs, not the natural next step after PLA. Most experienced
              printers never use ABS regularly. PETG handles the load for 90% of functional parts, and ASA
              covers outdoor applications without ABS's warping and fume issues.
            </p>
          </div>
        </section>

        {/* When ABS is right */}
        <section aria-label="When ABS is the correct material" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Use ABS When One of These Four Situations Fits Your Print</h2>
            <div className="space-y-4">
              <div className="flex gap-4 bg-white rounded-xl px-5 py-4 border border-gray-200">
                <span className="text-violet-600 font-bold text-lg">1.</span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  You need parts that survive above 80°C and you already have an enclosure — or a printer
                  with one built in (Bambu X1 Carbon, Prusa XL, etc.).
                </p>
              </div>
              <div className="flex gap-4 bg-white rounded-xl px-5 py-4 border border-gray-200">
                <span className="text-violet-600 font-bold text-lg">2.</span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  You want acetone vapor smoothing for a factory-smooth finish. ABS is the only common
                  FDM filament this works on. PETG doesn't respond to acetone.
                </p>
              </div>
              <div className="flex gap-4 bg-white rounded-xl px-5 py-4 border border-gray-200">
                <span className="text-violet-600 font-bold text-lg">3.</span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  You're replicating original plastic parts that were ABS — matching the coefficient of
                  thermal expansion for bonding to existing plastic components.
                </p>
              </div>
              <div className="flex gap-4 bg-white rounded-xl px-5 py-4 border border-gray-200">
                <span className="text-violet-600 font-bold text-lg">4.</span>
                <p className="text-gray-700 text-sm leading-relaxed">
                  You need acetone solvent bonding for strong multi-part assemblies. ABS joints bonded
                  with acetone or MEK are stronger than adhesive bonding.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PLA strengths people forget */}
        <section aria-label="PLA strengths worth remembering" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Experienced Printers Still Reach for PLA</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A lot of experienced printers still reach for PLA — not because they haven't learned ABS,
              but because PLA is actually the right tool for a large class of prints.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Very sharp detail resolution. Better than ABS at the same layer height.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>No warping. Prints flat every time.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>No fumes. Safe to print indoors without ventilation.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Huge color and finish selection. More options than any other filament type.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Consistent across brands. PLA from different manufacturers prints similarly.</span></li>
            </ul>
            <p className="mt-4 text-gray-600 leading-relaxed">
              For anything that doesn't need heat resistance or outdoor use, PLA is often the correct answer
              even for experienced printers.
            </p>
          </div>
        </section>

        {/* Cross-links */}
        <section aria-label="Related material guides" className="py-14 px-4 bg-violet-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Keep Going: Related Material Guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/pla-vs-petg', title: 'PLA vs PETG', desc: 'The most common comparison — when to step up.' },
                { href: '/abs-vs-petg', title: 'ABS vs PETG', desc: 'Which is better for functional parts?' },
                { href: '/3d-printing-filament-guide', title: 'All 7 Materials', desc: 'Full guide to every filament type.' },
                { href: '/3d-print-stringing', title: 'Fix Stringing', desc: 'Retraction, temp, and combing explained.' },
              ].map(({ href, title, desc }) => (
                <Link key={href} href={href} className="block bg-white rounded-xl p-5 border border-gray-100 hover:border-violet-200 hover:shadow-sm transition-all">
                  <p className="font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Build a Settings Library You Can Trust Across Both Materials.
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              PLA from different brands prints differently. ABS from different brands definitely prints differently.
              Log your temp, bed adhesion method, and enclosure notes per spool in PrintLog3D.
              When you revisit that brand, you open the app and start from what already worked.
              No tuning from scratch. No wasted test prints.
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
