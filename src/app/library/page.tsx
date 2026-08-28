import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MATERIAL_PROFILES } from '@/lib/materials';
import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * Materials index.
 *
 * This page used to headline a filament count taken from the `items` table.
 * That count described a fabricated brand-by-material grid, and the per-card
 * temperature blurbs here disagreed with the ones on the pages they linked to
 * (PLA was quoted as 190-230C here and 180-220C on the material page). Both
 * problems come from holding the same fact in two places, so the copy now
 * derives from MATERIAL_PROFILES, the single definition of a material.
 */

const BASE = 'https://www.printlog3d.com';

export const metadata: Metadata = {
  title: 'Filament materials: print settings for 17 material types',
  description:
    'Nozzle and bed temperatures, enclosure requirements and drying for PLA, PETG, ABS, ASA, nylon, polycarbonate, PEEK and more. Typical manufacturer-published ranges, set out per material.',
  alternates: { canonical: `${BASE}/library` },
};

const DIFFICULTY_ORDER = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export default function MaterialsIndexPage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Filament materials',
    itemListElement: MATERIAL_PROFILES.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.category,
      url: `${BASE}/library/${m.slug}`,
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Materials', item: `${BASE}/library` },
    ],
  };

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" className="pt-20">
        <section className="pt-20 pb-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--brand-primary)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-8 flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '24px',
                  height: '1px',
                  background: 'var(--brand-primary)',
                  flexShrink: 0,
                }}
              />
              MATERIALS &middot; {MATERIAL_PROFILES.length} TYPES
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--foreground)',
                lineHeight: 1.05,
                fontVariantNumeric: 'tabular-nums',
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Every setting,<br />
              <span style={{ color: 'var(--brand-primary)' }}>one page per material.</span>
            </h1>
            <p
              style={{ color: 'var(--body-text)', fontFamily: 'var(--font-body)' }}
              className="text-lg max-w-2xl leading-relaxed"
            >
              Nozzle and bed temperature, whether it needs an enclosure, whether it needs drying, and the
              fault people actually hit with it. These are typical manufacturer-published ranges for each
              material class, not numbers we measured.
            </p>
          </div>
        </section>

        <section className="py-14 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="sr-only">All materials</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse min-w-[42rem]">
                <caption className="sr-only">
                  Print settings for every material covered, showing nozzle temperature, bed temperature,
                  enclosure requirement and drying requirement.
                </caption>
                <thead>
                  <tr className="text-left border-b-2 border-gray-200">
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Material</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Nozzle</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Bed</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Enclosure</th>
                    <th scope="col" className="py-3 pr-4 font-semibold text-gray-900">Dry first</th>
                    <th scope="col" className="py-3 font-semibold text-gray-900">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {MATERIAL_PROFILES.map((m) => (
                    <tr key={m.slug} className="border-b border-gray-100 hover:bg-brand-tint/40">
                      <th scope="row" className="py-3 pr-4 text-left font-medium">
                        <Link
                          href={`/library/${m.slug}`}
                          className="text-brand hover:text-brand-dark underline underline-offset-4"
                        >
                          {m.category}
                        </Link>
                      </th>
                      <td className="py-3 pr-4 text-gray-700 tabular-nums">{m.printTempC}&deg;C</td>
                      <td className="py-3 pr-4 text-gray-700 tabular-nums">{m.bedTempC}&deg;C</td>
                      <td className="py-3 pr-4 text-gray-700">{m.enclosure}</td>
                      <td className="py-3 pr-4 text-gray-700">{m.needsDrying ? 'Yes' : 'Usually not'}</td>
                      <td className="py-3 text-gray-700">{m.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {DIFFICULTY_ORDER.map((level) => {
          const group = MATERIAL_PROFILES.filter((m) => m.difficulty === level);
          if (group.length === 0) return null;
          return (
            <section key={level} className="py-12 px-6 bg-gray-50 border-t border-gray-100">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{level}</h2>
                <p className="text-gray-600 mb-6 text-sm">
                  {level === 'Beginner' && 'Prints on a stock machine with no extra hardware.'}
                  {level === 'Intermediate' && 'Needs one thing you may not own yet, usually an enclosure or a dryer.'}
                  {level === 'Advanced' && 'Needs an enclosure, a dry box, and a hot end that runs well above 250C.'}
                  {level === 'Expert' && 'Needs a high-temperature machine most desktop printers cannot match.'}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/library/${m.slug}`}
                      className="group block bg-white rounded-xl border border-gray-100 p-5 hover:border-brand-soft hover:shadow-md transition-all"
                    >
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-dark transition-colors mb-1">
                        {m.category}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">{m.fullName}</p>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{m.summary}</p>
                      <p className="mt-3 text-xs font-medium text-brand tabular-nums">
                        {m.printTempC}&deg;C nozzle &middot; {m.bedTempC}&deg;C bed
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        <section className="py-14 px-6 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Guides</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                { href: '/3d-printing-filament-guide', label: 'The full filament guide' },
                { href: '/pla-vs-petg', label: 'PLA vs PETG' },
                { href: '/pla-vs-abs', label: 'PLA vs ABS' },
                { href: '/abs-vs-petg', label: 'ABS vs PETG' },
                { href: '/how-to-dry-filament', label: 'How to dry filament' },
                { href: '/3d-print-stringing', label: 'How to stop stringing' },
              ].map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className="text-brand hover:text-brand-dark font-medium underline underline-offset-4"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
