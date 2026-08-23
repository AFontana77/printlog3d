import Link from 'next/link';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';
import { MATERIAL_PROFILES } from '@/lib/materials';

export const metadata: Metadata = {
  title: "Filament Materials and Print Settings",
  description: "Nozzle and bed temperatures, enclosure needs and drying guidance for 17 filament materials, from PLA to PEEK. Typical manufacturer-published ranges, one page per material.",
};

// Derived, so the preview can never disagree with the page it links to.
const PREVIEW_SLUGS = ["pla", "petg", "abs", "asa", "peek"];
const SPEC_ROWS = PREVIEW_SLUGS.map((slug) => {
  const m = MATERIAL_PROFILES.find((x) => x.slug === slug);
  if (!m) throw new Error(`Homepage preview references unknown material: ${slug}`);
  return { mat: m.category, nozzle: `${m.printTempC}°C`, bed: `${m.bedTempC}°C` };
});

const FEATURE_ROWS = [
  { feature: "Material reference", desc: "17 materials with typical print temp, bed temp, and known issue notes." },
  { feature: "Print log", desc: "Log slicer settings, filament batch, nozzle temp, and result for every print." },
  { feature: "Settings history", desc: "See what actually worked for a given material. Your settings, not YouTube." },
  { feature: "Failure notes", desc: "Log warping, stringing, or layer adhesion issues. Know what to avoid next time." },
];

const STATS = [
  { num: `${MATERIAL_PROFILES.length}`, label: "materials covered", sub: "PLA · PETG · ABS · ASA · nylon · PEEK · more" },
  { num: "6", label: "in-depth guides", sub: "PLA vs PETG · drying · stringing · more" },
  { num: "$0", label: "to browse", sub: "Free site, free settings sheet" },
];

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">

        {/* Section 1: Hero */}
        <section style={{ background: 'oklch(0.96 0.008 295)' }} className="pt-32 pb-20 px-6">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_380px] gap-12 items-start">

            {/* Left: text */}
            <div>
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
                PrintLog3D · Filament materials + print log
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'oklch(0.15 0.02 295)',
                  lineHeight: 1.05,
                }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              >
                17 materials.<br />
                <span style={{ color: 'oklch(0.43 0.22 295)' }}>One settings reference.</span>
              </h1>

              <p
                style={{
                  color: 'oklch(0.35 0.018 295)',
                  maxWidth: '46ch',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.6,
                }}
                className="text-base mb-8"
              >
                Look up PLA, PETG, ABS, ASA, nylon, polycarbonate and PEEK by temperature and print
                characteristics. Skip the guesswork. Stop printing from memory.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/library"
                  style={{
                    background: 'oklch(0.43 0.22 295)',
                    color: 'oklch(0.99 0 0)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.08em',
                    borderRadius: '0.25rem',
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase min-h-[48px] transition-colors press-feedback"
                >
                  Browse the Materials &rarr;
                </Link>
                <Link
                  href="/free-download"
                  style={{
                    border: '1px solid oklch(0.84 0.015 295)',
                    color: 'oklch(0.43 0.22 295)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.08em',
                    borderRadius: '0.25rem',
                    background: 'transparent',
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase min-h-[48px] transition-colors"
                >
                  Free Settings Sheet
                </Link>
              </div>

              <p
                style={{ color: 'oklch(0.55 0.015 295)', fontVariantNumeric: 'tabular-nums' }}
                className="mt-4 text-sm"
              >
                The PrintLog3D app is in development. The site covers 17 materials, using the typical published range for each one.
              </p>
            </div>

            {/* Right: spec preview panel */}
            <div
              style={{
                background: 'oklch(0.99 0.004 295)',
                border: '1px solid oklch(0.84 0.015 295)',
                borderRadius: '0.25rem',
                overflow: 'hidden',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {/* Header bar */}
              <div style={{ background: 'oklch(0.43 0.22 295)', padding: '0.625rem 1rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.99 0 0)',
                    letterSpacing: '0.12em',
                    fontSize: '0.65rem',
                  }}
                  className="uppercase font-semibold"
                >
                  Filament specs preview
                </span>
              </div>

              {/* Column headers */}
              <div
                style={{
                  borderBottom: '1px solid oklch(0.84 0.015 295)',
                  padding: '0.5rem 1rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 70px 70px',
                }}
              >
                {['Material', 'Nozzle', 'Bed'].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.48 0.015 295)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                    }}
                    className="uppercase font-semibold"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Data rows */}
              {SPEC_ROWS.map((r, i) => (
                <div
                  key={r.mat}
                  style={{
                    padding: '0.625rem 1rem',
                    borderBottom: i < SPEC_ROWS.length - 1 ? '1px solid oklch(0.84 0.015 295)' : 'none',
                    display: 'grid',
                    gridTemplateColumns: '1fr 70px 70px',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span
                    style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.15 0.02 295)' }}
                    className="text-sm font-medium"
                  >
                    {r.mat}
                  </span>
                  <span
                    style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)' }}
                    className="text-sm"
                  >
                    {r.nozzle}
                  </span>
                  <span
                    style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)' }}
                    className="text-sm"
                  >
                    {r.bed}
                  </span>
                </div>
              ))}

              {/* Footer link */}
              <div style={{ padding: '0.625rem 1rem', borderTop: '1px solid oklch(0.84 0.015 295)' }}>
                <Link
                  href="/library"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.43 0.22 295)',
                    letterSpacing: '0.08em',
                    fontSize: '0.75rem',
                  }}
                  className="uppercase font-semibold"
                >
                  View all 17 materials &rarr;
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: Stat strip */}
        <section style={{ background: 'oklch(0.15 0.02 295)' }} className="py-12 px-6">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8">
            {STATS.map((s) => (
              <div key={s.label} style={{ borderLeft: '1px solid oklch(0.28 0.025 295)', paddingLeft: '1.5rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.62 0.16 315)',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                  className="text-5xl font-bold"
                >
                  {s.num}
                </div>
                <div style={{ color: 'oklch(0.85 0.01 295)' }} className="text-sm font-semibold mt-1">
                  {s.label}
                </div>
                <div style={{ color: 'oklch(0.55 0.012 295)' }} className="text-xs mt-0.5">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Value statement + spec-table feature list */}
        <section style={{ background: 'oklch(0.99 0.004 295)' }} className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
                maxWidth: '22ch',
              }}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              Most log apps give you a blank screen.
            </h2>
            <p
              style={{
                color: 'oklch(0.48 0.015 295)',
                maxWidth: '52ch',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.65,
              }}
              className="text-base mb-14"
            >
              PrintLog3D covers 17 filament materials, using the typical published range for each one. Searchable and organized.
              The print log and settings history features below are part of the companion app,
              in development now.
            </p>

            {/* Spec-table feature rows */}
            <div
              style={{
                border: '1px solid oklch(0.84 0.015 295)',
                borderRadius: '0.25rem',
                overflow: 'hidden',
              }}
            >
              {/* Header row */}
              <div
                style={{
                  background: 'oklch(0.92 0.012 295)',
                  padding: '0.625rem 1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.48 0.015 295)',
                    letterSpacing: '0.1em',
                    fontSize: '0.65rem',
                  }}
                  className="uppercase font-semibold"
                >
                  Feature
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.48 0.015 295)',
                    letterSpacing: '0.1em',
                    fontSize: '0.65rem',
                  }}
                  className="uppercase font-semibold"
                >
                  What it does
                </span>
              </div>

              {FEATURE_ROWS.map((f, i) => (
                <div
                  key={f.feature}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '200px 1fr',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.43 0.22 295)',
                      letterSpacing: '0.03em',
                    }}
                    className="text-sm font-semibold"
                  >
                    {f.feature}
                  </span>
                  <p
                    style={{ color: 'oklch(0.35 0.018 295)', fontFamily: 'var(--font-body)' }}
                    className="text-sm leading-relaxed"
                  >
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section
          style={{
            background: 'oklch(0.92 0.012 295)',
            borderTop: '1px solid oklch(0.84 0.015 295)',
          }}
          className="py-20 px-6"
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
              Free to start
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
              }}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              Get the settings sheet first.
            </h2>

            <p
              style={{
                color: 'oklch(0.48 0.015 295)',
                maxWidth: '44ch',
                fontFamily: 'var(--font-body)',
              }}
              className="text-lg mb-8"
            >
              Download the printable filament reference sheet. Use it at your desk today, no app needed.
              A companion app with the full material reference and print log is in development. We will
              share it here when it ships.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/free-download"
                style={{
                  background: 'oklch(0.43 0.22 295)',
                  color: 'oklch(0.99 0 0)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  borderRadius: '0.25rem',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase min-h-[48px] transition-colors press-feedback"
              >
                Get the Free PDF
              </Link>
              <Link
                href="/library"
                style={{
                  border: '1px solid oklch(0.84 0.015 295)',
                  color: 'oklch(0.43 0.22 295)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  borderRadius: '0.25rem',
                  background: 'transparent',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase min-h-[48px] transition-colors"
              >
                Browse the Materials
              </Link>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
