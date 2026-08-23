import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PLA vs PETG: Which Filament Should You Use?',
  description: 'PLA vs PETG compared side by side: print temperature, heat resistance, flexibility, bed adhesion, and which to use for functional parts, outdoor prints, and food-contact items.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'PLA vs PETG: Which Filament Should You Use?',
      description: 'PLA vs PETG compared side by side: print temperature, heat resistance, flexibility, bed adhesion, and which to use for functional parts, outdoor prints, and food-contact items.',
      url: 'https://www.printlog3d.com/pla-vs-petg',
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
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

const eyebrowStyle: React.CSSProperties = { fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)', letterSpacing: '0.15em', fontSize: '0.7rem' };
const h2Style: React.CSSProperties = { fontFamily: 'var(--font-display)', color: 'oklch(0.15 0.02 295)', lineHeight: 1.1 };
const h3Style: React.CSSProperties = { fontFamily: 'var(--font-display)', color: 'oklch(0.15 0.02 295)' };
const bodyStyle: React.CSSProperties = { color: 'oklch(0.35 0.018 295)', fontFamily: 'var(--font-body)', lineHeight: 1.65 };
const linkStyle: React.CSSProperties = { color: 'oklch(0.43 0.22 295)' };

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={eyebrowStyle} className="uppercase font-semibold mb-6 flex items-center gap-3">
    <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
    {children}
  </div>
);

const SPECS: [string, string, string][] = [
  ['Print temp', '190-220°C', '230-250°C'],
  ['Bed temp', '45-60°C (or none)', '70-85°C'],
  ['Enclosure needed', 'No', 'No'],
  ['Heat resistance', 'Low (~60°C)', 'Moderate (~80°C)'],
  ['Layer adhesion', 'Good', 'Excellent'],
  ['UV resistance', 'Poor (yellows)', 'Moderate'],
  ['Flexibility', 'Brittle', 'Semi-flexible'],
  ['Stringing tendency', 'Low', 'Higher'],
  ['Ease of print', 'Very easy', 'Moderate'],
];

const PLA_USES = [
  'Indoor decorative prints, models, and figures.',
  "Rapid prototypes where strength does not matter.",
  'Anything that will not see heat above 60°C. Leave PLA in a hot car and it warps.',
  'Dialing in a new printer. PLA is the most forgiving material available.',
];

const PETG_USES = [
  'Functional parts that need to hold together under stress: brackets, clips, mounts.',
  'Anything that might get warm: engine bay accessories, outdoor brackets.',
  'Snap-fit parts that need to flex without snapping.',
  'Food container lids. Check that your brand is food-safe certified. Not all PETG is.',
];

const PETG_PROBLEMS = [
  { n: '01', title: 'Sticking too hard to the glass bed', body: "PETG bonds aggressively to bare glass and will chip it when you remove the print. Fix: apply a thin layer of Elmer's glue stick to the bed before printing, or switch to a PEI sheet. PEI releases PETG cleanly once the bed cools." },
  { n: '02', title: 'More stringing than PLA', body: 'PETG strings more than PLA. Some thin wisps are normal. For heavy cobwebbing: reduce print temp by 5°C, increase travel speed, and enable combing mode in your slicer.', linkHref: '/3d-print-stringing', linkText: 'See our stringing fix guide' },
  { n: '03', title: 'Rough, bubbly top surface', body: 'Rough surfaces often mean wet filament. PETG absorbs moisture within a few days in humid air. Dry it at 65°C for 4 to 6 hours before printing.', linkHref: '/how-to-dry-filament', linkText: 'See our filament drying guide' },
];

const PETG_LIMITS = [
  'High heat above 80°C. Use ASA or ABS for those applications.',
  'Ultra-fine detail. PLA resolves sharper edges at the same layer height.',
  'Chemical resistance in harsh solvents. ABS handles more chemicals than PETG.',
];

const VERDICT = [
  { label: 'Decorative model', answer: 'PLA' },
  { label: 'Bracket that holds weight indoors', answer: 'PETG' },
  { label: 'Outdoor sign or mount', answer: 'ASA' },
  { label: 'Flexible gasket or grip', answer: 'TPU' },
];

export default function PlaVsPetgPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section aria-label="Page introduction" className="pt-20 pb-16 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)', fontSize: '0.75rem', letterSpacing: '0.05em' }} className="uppercase font-semibold mb-4">
              <Link href="/" className="hover:underline">Home</Link>
              <span style={{ color: 'oklch(0.55 0.015 295)', margin: '0 0.5rem' }}>/</span>
              <span style={{ color: 'oklch(0.48 0.015 295)' }}>PLA vs PETG</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.15 0.02 295)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              PLA vs PETG: <span style={{ color: 'oklch(0.43 0.22 295)' }}>which to use.</span>
            </h1>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="text-base">
              Pick the wrong filament and the part fails. Pick the right one and it works for years. PLA and PETG cover most of what hobbyists print. This page shows you which to use for every situation.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-label="Side-by-side comparison table" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>SIDE BY SIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Pick the right material in under a minute.</h2>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden', fontVariantNumeric: 'tabular-nums' }}>
              <div style={{ background: 'oklch(0.92 0.012 295)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '180px 1fr 1fr' }}>
                {['Property', 'PLA', 'PETG'].map((h) => (
                  <span key={h} style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.48 0.015 295)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">{h}</span>
                ))}
              </div>
              {SPECS.map(([prop, pla, petg], i) => (
                <div
                  key={prop}
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderTop: '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 1fr',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)' }} className="text-sm font-semibold">{prop}</span>
                  <span style={{ ...bodyStyle }} className="text-sm">{pla}</span>
                  <span style={{ ...bodyStyle }} className="text-sm">{petg}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When to use PLA */}
        <section aria-label="When to use PLA" className="py-20 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>USE PLA WHEN</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Use PLA when heat and strength do not matter.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-8">
              PLA works well for anything that stays indoors and stays cool. It prints at the lowest temps, requires no heated bed, and forgives almost every tuning mistake. That makes it ideal for learning a new printer.
            </p>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PLA_USES.map((u, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: '0.75rem',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)', fontVariantNumeric: 'tabular-nums' }} className="text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{u}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When to use PETG */}
        <section aria-label="When to use PETG" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>USE PETG WHEN</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Switch to PETG when the part has a job to do.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-8">
              PETG is the step-up material for parts that actually need to hold up. It handles more stress, more heat, and more flex than PLA, without needing an enclosure.
            </p>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PETG_USES.map((u, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: '0.75rem',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)', fontVariantNumeric: 'tabular-nums' }} className="text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{u}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PETG problems */}
        <section aria-label="Common PETG problems and fixes" className="py-20 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PETG · COMMON ISSUES</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Fix these three PETG issues before you waste a spool.</h2>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PETG_PROBLEMS.map((p, i) => (
                <div
                  key={p.n}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: i === 0 ? 'none' : '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gap: '1rem',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)', fontVariantNumeric: 'tabular-nums' }} className="text-lg font-bold">{p.n}</span>
                  <div>
                    <p style={h3Style} className="font-bold mb-2">{p.title}</p>
                    <p style={{ ...bodyStyle }} className="text-sm">
                      {p.body}
                      {p.linkHref && (
                        <> <Link href={p.linkHref} style={linkStyle} className="underline hover:no-underline">{p.linkText}</Link>.</>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PETG limits */}
        <section aria-label="PETG limitations" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PETG LIMITS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Where PETG falls short.</h2>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PETG_LIMITS.map((l, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: '0.75rem',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.62 0.16 315)', fontVariantNumeric: 'tabular-nums' }} className="text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section aria-label="Quick verdict by use case" className="py-20 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>DECISION GUIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Ten-second decision guide.</h2>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ background: 'oklch(0.92 0.012 295)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 200px' }}>
                <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.48 0.015 295)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">If you are printing</span>
                <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.48 0.015 295)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Use</span>
              </div>
              {VERDICT.map((v, i) => (
                <div
                  key={v.label}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ ...bodyStyle }} className="text-sm">{v.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)' }} className="text-sm font-semibold">{v.answer}</span>
                </div>
              ))}
            </div>
            <p style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }} className="mt-8 text-sm">
              Not sure which material fits your project? See our <Link href="/3d-printing-filament-guide" style={linkStyle} className="underline hover:no-underline">complete filament guide</Link> for all 7 material types. Or compare <Link href="/abs-vs-petg" style={linkStyle} className="underline hover:no-underline">ABS vs PETG</Link> and <Link href="/pla-vs-abs" style={linkStyle} className="underline hover:no-underline">PLA vs ABS</Link>.
            </p>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-20 px-6" style={{ background: 'oklch(0.92 0.012 295)', borderTop: '1px solid oklch(0.84 0.015 295)' }}>
          <div className="max-w-3xl mx-auto">
            <Eyebrow>FREE APP</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Stop reprinting calibration squares. Build a settings library.</h2>
            <p style={{ ...bodyStyle, maxWidth: '52ch' }} className="mb-8">
              PETG from one brand and PETG from another need different retraction settings. Log your print temp, bed temp, and retraction distance per spool in PrintLog3D. Next time you open that same brand, you know the settings that worked. No calibration cube. No wasted filament.
            </p>
            <Link
              href="/free-download"
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
              Get the Free App
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
