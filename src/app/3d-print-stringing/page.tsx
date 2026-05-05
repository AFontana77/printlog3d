import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Print Stringing — Causes, Fixes & Settings by Material | PrintLog3D',
  description:
    'Fix 3D print stringing with this step-by-step guide: retraction distance by extruder type, temperature reduction, combing, travel speed, and why PETG strings more than PLA (and what to do about it).',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '3D Print Stringing — Causes, Fixes and Settings by Material',
      description:
        'Fix 3D print stringing: retraction distance by extruder type, temperature reduction, combing, travel speed, and material-specific notes for PLA, PETG, TPU, and Nylon.',
      url: 'https://www.printlog3d.com/3d-print-stringing',
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
        { '@type': 'ListItem', position: 2, name: '3D Print Stringing', item: 'https://www.printlog3d.com/3d-print-stringing' },
      ],
    },
  ],
};

export default function StringingPage() {
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
              <span>3D Print Stringing</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              3D Print Stringing: Causes and Fixes
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              Thin plastic threads between separate parts of your print are called stringing. It's the
              most common print quality problem beyond PLA. Here's what causes it and how to fix it —
              one setting at a time.
            </p>
          </div>
        </section>

        {/* What stringing is */}
        <section aria-label="What causes stringing" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Causes Stringing</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              When the nozzle moves between two printed areas without extruding, molten plastic can
              leak out and leave a thin thread. The technical term for that movement is a travel move.
              Stringing happens when plastic is still fluid enough to ooze during travel.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Some materials stay fluid longer at a given temperature than others. PETG and TPU are
              more prone to stringing than PLA — this is normal, not a sign something is broken.
              The fix is the same across materials: pull plastic back before travel (retraction),
              reduce temp to make it less fluid, and move fast so there's less time to ooze.
            </p>
          </div>
        </section>

        {/* Fix checklist */}
        <section aria-label="Stringing fix checklist in order of impact" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Fix Checklist (In Order of Impact)</h2>

            <div className="space-y-6">
              {/* Fix 1 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-violet-700 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">1</span>
                  <h3 className="text-lg font-bold text-gray-900">Check retraction distance</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Retraction pulls plastic back into the nozzle before a travel move. Too little and
                  plastic leaks. Too much and you risk grinding the filament or pulling molten plastic
                  into the cold zone.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
                    <p className="font-semibold text-violet-700 text-sm">Bowden extruder</p>
                    <p className="text-sm text-gray-600">(Ender 3, CR-10 style)</p>
                    <p className="font-bold text-gray-900 mt-1">4-7mm</p>
                  </div>
                  <div className="bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
                    <p className="font-semibold text-violet-700 text-sm">Direct drive</p>
                    <p className="text-sm text-gray-600">(Bambu, Prusa MK4, Voron)</p>
                    <p className="font-bold text-gray-900 mt-1">0.5-2mm</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">Start at the middle of the range. Adjust by 0.5mm increments and test.</p>
              </div>

              {/* Fix 2 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-violet-700 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">2</span>
                  <h3 className="text-lg font-bold text-gray-900">Lower print temperature by 5°C</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Hotter plastic is more fluid. More fluid means more ooze during travel. Drop temp
                  by 5°C and test. Keep going in 5°C steps until stringing improves or print quality
                  starts to suffer (under-extrusion, weak layer bonds).
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    ['PLA', 'Try 195°C', '(from 210°C)'],
                    ['PETG', 'Try 235°C', '(from 245°C)'],
                    ['ABS', 'Try 235°C', '(from 245°C)'],
                    ['TPU', 'Try 225°C', '(from 235°C)'],
                  ].map(([mat, target, from]) => (
                    <div key={mat} className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
                      <p className="font-semibold text-gray-800">{mat}</p>
                      <p className="text-violet-700">{target}</p>
                      <p className="text-gray-400 text-xs">{from}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fix 3 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-violet-700 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">3</span>
                  <h3 className="text-lg font-bold text-gray-900">Enable combing in your slicer</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Combing tells the slicer to route travel moves over already-printed areas instead of
                  open air. Even if some ooze happens, it lands on printed material — not empty space —
                  so no thread forms. In Cura, go to "Travel" settings and set Combing Mode to
                  "Not in Skin" or "All." In PrusaSlicer and Bambu Studio, it's called "Avoid crossing
                  perimeters." This single setting often eliminates most stringing on complex prints
                  without changing any physical parameters.
                </p>
              </div>

              {/* Fix 4 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-violet-700 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">4</span>
                  <h3 className="text-lg font-bold text-gray-900">Increase travel speed</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Faster travel means less time for plastic to ooze. This is separate from print speed.
                  A target of 150-200 mm/s travel speed works well for most printers. Faster printers
                  (Bambu, Voron) can go higher. Slower printers (stock Ender 3) should stay at the
                  lower end to avoid frame vibration causing print artifacts.
                </p>
              </div>

              {/* Fix 5 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-violet-700 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">5</span>
                  <h3 className="text-lg font-bold text-gray-900">Dry the filament</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Wet filament strings dramatically worse than dry material. If you've tried the four
                  steps above and still have heavy stringing, drying is probably the culprit — especially
                  for PETG, TPU, and Nylon. See our{' '}
                  <Link href="/how-to-dry-filament" className="text-violet-700 underline hover:text-violet-900">complete filament drying guide</Link>{' '}
                  for temps, times, and methods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Material-specific notes */}
        <section aria-label="Stringing notes by filament material" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Notes by Material</h2>
            <div className="space-y-4">
              {[
                {
                  material: 'PLA',
                  note: 'Minimal stringing with standard settings. If PLA is stringing badly, retraction is set wrong or you\'re printing too hot. PLA is the easiest material to dial in — stringing should be nearly zero with correct settings.',
                },
                {
                  material: 'PETG',
                  note: 'Strings more than PLA — this is normal. Some thin wisps are acceptable and easy to remove with a heat gun pass. If you have heavy cobwebbing, lower temp first (5°C), then check retraction. Enable combing. PETG stringing should never be as heavy as what you see from Nylon or wet filament.',
                },
                {
                  material: 'TPU',
                  note: 'Strings heavily due to high flexibility. Reduce retraction to near-zero (0-1mm on direct drive) and print slow (30-35 mm/s). Combing helps a lot. Accept some stringing — TPU is difficult to print completely clean and most stringing snaps off easily once the print is done.',
                },
                {
                  material: 'Nylon',
                  note: 'Strings badly when wet. Always dry Nylon before printing — 70-80°C for 12+ hours. After drying, tune retraction and use combing. Dry Nylon should string at roughly the same level as PETG.',
                },
              ].map(({ material, note }) => (
                <div key={material} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                  <p className="font-bold text-gray-900 mb-2">{material}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to test */}
        <section aria-label="How to test your stringing fixes" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Test Your Settings</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Print a stringing torture test. The classic "spiked sphere" or Cthulhu model from Printables
              or Thingiverse works well. It has many tall spikes and open space between them — exactly the
              conditions that reveal stringing. One test print takes 15-25 minutes and tells you more than
              30 minutes of guessing.
            </p>
            <div className="bg-amber-50 rounded-xl px-5 py-4 border border-amber-200">
              <p className="font-semibold text-gray-900 mb-1">Critical rule: change one variable per test</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Change ONE setting, print the test, evaluate. Never change two variables at once.
                If you change temp and retraction at the same time and stringing gets better, you won't
                know which fix worked — or which one to keep.
              </p>
            </div>
          </div>
        </section>

        {/* Related guides */}
        <section aria-label="Related guides" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Related Guides</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/how-to-dry-filament', title: 'How to Dry Filament', desc: 'Signs of wet filament and all 3 drying methods.' },
                { href: '/pla-vs-petg', title: 'PLA vs PETG', desc: 'Why PETG strings more and when to use each.' },
                { href: '/abs-vs-petg', title: 'ABS vs PETG', desc: 'Which is better for functional parts?' },
                { href: '/3d-printing-filament-guide', title: 'All 7 Filament Types', desc: 'Complete settings reference for every material.' },
              ].map(({ href, title, desc }) => (
                <Link key={href} href={href} className="block bg-gray-50 rounded-xl p-5 border border-gray-100 hover:border-violet-200 hover:shadow-sm transition-all">
                  <p className="font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-16 px-4 bg-violet-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Log your retraction and temp settings per material in PrintLog3D.
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Find your baseline that works. Know exactly what to go back to when you switch filament brands. Free.
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
