import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Dry Filament — Signs of Wet Filament & 3 Drying Methods | PrintLog3D',
  description:
    'Learn to spot wet filament (popping sounds, rough surface, stringing) and how to dry it with a filament dryer, food dehydrator, or oven. Includes drying temps and times for PLA, PETG, Nylon, and TPU.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Dry Filament — Signs of Wet Filament and 3 Drying Methods',
      description:
        'Spot wet filament and dry it correctly with a filament dryer, food dehydrator, or oven. Includes drying temps and times for PLA, PETG, Nylon, and TPU.',
      url: 'https://www.printlog3d.com/how-to-dry-filament',
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
        { '@type': 'ListItem', position: 2, name: 'How to Dry Filament', item: 'https://www.printlog3d.com/how-to-dry-filament' },
      ],
    },
  ],
};

export default function HowToDryFilamentPage() {
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
              <span>How to Dry Filament</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How to Dry Filament
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              Bad prints often have nothing to do with your slicer settings. The filament is wet.
              Moisture turns to steam in the nozzle and ruins the surface, the layer bonds, and the stringing.
              Dry the filament and those problems disappear. Here is how to tell if yours is wet and how to fix it.
            </p>
          </div>
        </section>

        {/* Signs of wet filament */}
        <section aria-label="Signs that your filament is wet" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Filament Is Wet. Here Is How to Tell.</h2>
            <div className="space-y-4">
              {[
                {
                  num: '1',
                  title: 'Popping or cracking from the nozzle',
                  desc: 'Small water pockets vaporize as they hit the hot end. You can hear it — a faint crackling or popping while printing. This is the clearest sign of wet filament.',
                },
                {
                  num: '2',
                  title: 'Rough, bubbly, or fuzzy surface texture',
                  desc: 'Steam escaping through the extruded bead creates small bubbles and a rough surface. Prints that used to come out smooth suddenly look textured or pebbled.',
                },
                {
                  num: '3',
                  title: 'More stringing than usual',
                  desc: 'Wet filament strings badly even on settings that worked last week. If your stringing got worse without changing anything, moisture is likely the cause.',
                },
                {
                  num: '4',
                  title: 'Weak, brittle layer adhesion',
                  desc: 'Layers delaminate under light force. Wet filament doesn\'t fuse as well between layers, so the print snaps along layer lines instead of through the material.',
                },
                {
                  num: '5',
                  title: 'White wisps of steam from the nozzle',
                  desc: 'Visible steam or white smoke coming off the nozzle during printing is a definitive sign. The filament is boiling water as it extrudes.',
                },
              ].map(({ num, title, desc }) => (
                <div key={num} className="flex gap-4 bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                  <span className="text-violet-600 font-bold text-lg min-w-[24px]">{num}.</span>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{title}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Which filaments absorb moisture fastest */}
        <section aria-label="Moisture absorption by filament type" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Know Which Filaments Go Bad Fastest So You Dry the Right Ones</h2>
            <p className="text-gray-600 mb-6">Fastest to slowest — listed from most to least moisture-sensitive:</p>
            <div className="space-y-3">
              {[
                { material: 'Nylon', speed: 'Hours', detail: 'Absorbs moisture from open air in 1-2 hours in humid conditions. Must be printed dry and stored sealed.', color: 'bg-red-50 border-red-200' },
                { material: 'TPU', speed: 'Hours to 1 day', detail: 'Nearly as fast as Nylon. Store sealed with desiccant between uses.', color: 'bg-orange-50 border-orange-200' },
                { material: 'PETG', speed: 'Days', detail: 'Absorbs moisture within a few days in normal room humidity. Dry before any print run if the spool has been open more than a week.', color: 'bg-amber-50 border-amber-200' },
                { material: 'PLA+', speed: 'Days to 1 week', detail: 'Absorbs faster than standard PLA. Additives that improve flexibility also attract moisture.', color: 'bg-yellow-50 border-yellow-200' },
                { material: 'ABS / ASA', speed: 'Many days', detail: 'Moderate absorption rate. Usually fine for a few weeks in normal conditions.', color: 'bg-blue-50 border-blue-200' },
                { material: 'Standard PLA', speed: 'Weeks', detail: 'The most moisture-resistant common filament. Low risk for short-term storage in normal humidity.', color: 'bg-green-50 border-green-200' },
              ].map(({ material, speed, detail, color }) => (
                <div key={material} className={`flex gap-4 rounded-xl px-5 py-4 border ${color}`}>
                  <div className="min-w-[100px]">
                    <p className="font-bold text-gray-900">{material}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{speed}</p>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 drying methods */}
        <section aria-label="Three methods for drying filament" className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">The Three Ways to Dry Filament (Ranked by Safety)</h2>

            {/* Method 1 */}
            <div className="mb-8 bg-violet-50 rounded-2xl p-6 border border-violet-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-violet-700 text-white text-sm font-bold px-3 py-1 rounded-full">Best</span>
                <h3 className="text-xl font-bold text-gray-900">1. Dedicated Filament Dryer ($30-60)</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                The easiest option. Set it and leave it. SUNLU, Sovol, and eSUN all make good ones.
                You can print directly from the dryer while it runs — no need to wait.
              </p>
              <div className="bg-white rounded-xl p-4 border border-violet-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Recommended temps and times:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    ['PLA', '45-50°C', '4-8 hours'],
                    ['PETG / ABS / ASA', '65°C', '4-8 hours'],
                    ['Nylon', '70-80°C', '12+ hours'],
                    ['TPU', '45-55°C', '4-6 hours'],
                  ].map(([mat, temp, time]) => (
                    <div key={mat} className="bg-violet-50 rounded-lg px-3 py-2">
                      <p className="font-semibold text-gray-800">{mat}</p>
                      <p className="text-gray-500">{temp} / {time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Method 2 */}
            <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Food Dehydrator</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Works well if the dehydrator reaches high enough temps. Many units max at 70°C —
                fine for most materials. The key check: measure if a standard 1kg spool fits inside
                before buying. Some smaller dehydrators can't fit a full spool without removing a shelf
                tray. Run at the same temps listed above. 4-6 hours is usually enough for PLA, PETG,
                and ABS. Nylon needs more time.
              </p>
            </div>

            {/* Method 3 */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">Use Caution</span>
                <h3 className="text-xl font-bold text-gray-900">3. Household Oven</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                This works but requires care. Most ovens don't hold temperature accurately below 100°C —
                the actual temp can swing 10-15°C above or below the dial setting. PLA will soften and
                warp if the oven runs hot (PLA deforms at 60°C).
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                If using an oven: verify temperature with a separate digital oven thermometer before
                putting filament in. Crack the door slightly for airflow. Not recommended unless you've
                confirmed temperature accuracy. For Nylon and TPU, use a dedicated dryer instead.
              </p>
            </div>
          </div>
        </section>

        {/* Storage after drying */}
        <section aria-label="How to store filament after drying" className="py-14 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Keep It Dry Between Prints</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Drying fixes the problem — but only until the spool absorbs moisture again. Proper storage
              keeps filament dry between uses.
            </p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Airtight bag or container with silica gel desiccant packets. This is the minimum for Nylon and TPU.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Vacuum storage bags remove air entirely — best option for long-term Nylon and TPU storage.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Desiccant packs recharge in an oven at 120°C for 1 hour. Reuse them indefinitely.</span></li>
              <li className="flex gap-2"><span className="text-violet-600 font-bold mt-0.5">+</span><span>Log the date you opened each spool. After 2-3 weeks in humid air, PETG and TPU likely need drying again.</span></li>
            </ul>
          </div>
        </section>

        {/* Cross-links */}
        <section aria-label="Related guides" className="py-10 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 mb-3">Related guides:</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/3d-printing-filament-guide" className="text-violet-700 underline text-sm hover:text-violet-900">3D Printing Filament Guide</Link>
              <span className="text-gray-300">|</span>
              <Link href="/3d-print-stringing" className="text-violet-700 underline text-sm hover:text-violet-900">Fix Stringing</Link>
              <span className="text-gray-300">|</span>
              <Link href="/pla-vs-petg" className="text-violet-700 underline text-sm hover:text-violet-900">PLA vs PETG</Link>
              <span className="text-gray-300">|</span>
              <Link href="/abs-vs-petg" className="text-violet-700 underline text-sm hover:text-violet-900">ABS vs PETG</Link>
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-16 px-4 bg-violet-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Log Open Dates and Dry Dates. Never Print Wet Filament by Accident.
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You opened a PETG spool two weeks ago. Is it still dry? You won't know unless you logged the date.
              Log your open date and last dry date per spool in PrintLog3D.
              Before your next print session, check the app. If it's been more than a week in humid air, dry it first.
              Clean prints start before you hit print.
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
