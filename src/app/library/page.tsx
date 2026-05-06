import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getCategories, toSlug } from '@/lib/items';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PrintLog3D Library — 3D Filament Database',
  description: 'Browse filaments by material type — print temp, bed temp, brand comparisons, and print settings guides. Available in the free PrintLog3D app.',
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  PLA: 'The most common material — 190-230°C, easy to print, minimal warping.',
  PETG: 'Food-safe and impact-resistant — 230-250°C, better heat resistance than PLA.',
  ABS: 'High temperature resistance — needs enclosure, 230-250°C, heated bed essential.',
  ASA: 'UV-resistant version of ABS — outdoor-safe, similar profile to ABS.',
  Nylon: 'High strength and self-lubricating — requires dry storage, 240-280°C.',
  TPU: 'Flexible and rubber-like — Shore hardness varies, 220-240°C, direct drive preferred.',
  Resin: 'Photopolymer for SLA/DLP printers — ultra-fine detail, different printer type required.',
};

export default async function LibraryPage() {
  const categories = await getCategories();
  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="pt-20 pb-16 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.43 0.22 295)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-8 flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
              LIBRARY · {categories.length} MATERIAL TYPES
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
                fontVariantNumeric: 'tabular-nums',
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span style={{ color: 'oklch(0.43 0.22 295)' }}>{totalCount.toLocaleString()}</span> filaments.<br />
              Sorted by material.
            </h1>
            <p
              style={{
                color: 'oklch(0.35 0.018 295)',
                fontFamily: 'var(--font-body)',
                maxWidth: '52ch',
                lineHeight: 1.6,
                fontVariantNumeric: 'tabular-nums',
              }}
              className="text-base mb-4"
            >
              {totalCount.toLocaleString()} filaments across {categories.length} material types. Print temp, bed temp, brand guides, and settings for every major filament category.
            </p>
            <p
              style={{
                color: 'oklch(0.48 0.015 295)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
              className="uppercase font-semibold"
            >
              Full search available in the free app.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.43 0.22 295)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-6 flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
              BROWSE BY MATERIAL
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
              }}
              className="text-3xl sm:text-4xl font-bold mb-10"
            >
              Pick your material. Get the specs.
            </h2>

            {/* Spec table for categories */}
            <div
              style={{
                border: '1px solid oklch(0.84 0.015 295)',
                borderRadius: '0.25rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'oklch(0.92 0.012 295)',
                  padding: '0.625rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '140px 80px 1fr 120px',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                {['Material', 'Count', 'Description', ''].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.48 0.015 295)',
                      letterSpacing: '0.1em',
                      fontSize: '0.65rem',
                    }}
                    className="uppercase font-semibold"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {categories.map((cat, i) => (
                <Link
                  key={cat.category}
                  href={`/library/${toSlug(cat.category)}`}
                  className="group block transition-colors"
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid oklch(0.84 0.015 295)',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                    display: 'grid',
                    gridTemplateColumns: '140px 80px 1fr 120px',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.43 0.22 295)',
                      letterSpacing: '0.04em',
                    }}
                    className="text-base font-semibold"
                  >
                    {cat.category}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.15 0.02 295)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                    className="text-sm"
                  >
                    {cat.count}
                  </span>
                  <p
                    style={{ color: 'oklch(0.35 0.018 295)', fontFamily: 'var(--font-body)' }}
                    className="text-sm leading-relaxed"
                  >
                    {CATEGORY_DESCRIPTIONS[cat.category] ?? `Browse ${cat.count} ${cat.category} filaments with print settings and brand guides.`}
                  </p>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.43 0.22 295)',
                      letterSpacing: '0.08em',
                      fontSize: '0.7rem',
                      textAlign: 'right',
                    }}
                    className="uppercase font-semibold"
                  >
                    Browse &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section
          className="py-20 px-6"
          style={{
            background: 'oklch(0.92 0.012 295)',
            borderTop: '1px solid oklch(0.84 0.015 295)',
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.43 0.22 295)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-4 flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
              FREE APP · NO SUBSCRIPTION
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
              }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Search the full database in the app.
            </h2>
            <p
              style={{
                color: 'oklch(0.35 0.018 295)',
                fontFamily: 'var(--font-body)',
                maxWidth: '52ch',
              }}
              className="text-base mb-8"
            >
              The PrintLog3D app gives you the complete filament library with full-text search, filters, and your personal print log. Free.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'oklch(0.43 0.22 295)',
                  color: 'oklch(0.99 0 0)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  borderRadius: '0.25rem',
                  textTransform: 'uppercase',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold min-h-[48px] transition-colors press-feedback"
              >
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: '1px solid oklch(0.84 0.015 295)',
                  color: 'oklch(0.43 0.22 295)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  borderRadius: '0.25rem',
                  background: 'transparent',
                  textTransform: 'uppercase',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold min-h-[48px] transition-colors"
              >
                Google Play
              </a>
            </div>
            <p
              style={{
                color: 'oklch(0.48 0.015 295)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mt-6"
            >
              Free. No subscription. No credit card.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
