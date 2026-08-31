import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ComparisonBuying } from '@/components/ComparisonBuying';
import { Faq } from '@/components/Faq';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import Link from 'next/link';
import { specRows, type SpecRow } from '@/components/ComparisonSpecs';
import {
  Eyebrow,
  SpecGrid,
  comparisonJsonLd,
  bodyStyle,
  h2Style,
  h3Style,
  linkStyle,
} from '@/components/comparison/shared';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PLA vs PETG: Which Filament Should You Use?',
  description: 'PLA vs PETG compared side by side: print temperature, heat resistance, flexibility, bed adhesion, and which to use for functional parts, outdoor prints, and food-contact items.',
};

const jsonLd = comparisonJsonLd({
  title: 'PLA vs PETG: Which Filament Should You Use?',
  description: 'PLA vs PETG compared side by side: print temperature, heat resistance, flexibility, bed adhesion, and which to use for functional parts, outdoor prints, and food-contact items.',
  url: 'https://www.printlog3d.com/pla-vs-petg',
  breadcrumb: 'PLA vs PETG',
});



// Derived from materials.ts so this table cannot contradict the material
// pages. Only the editorial rows, which have no canonical field, are literal.
const SPECS: SpecRow[] = specRows('PLA', 'PETG', [
  ['Heat resistance', 'Low (~60°C)', 'Moderate (~80°C)'],
  ['Layer adhesion', 'Good', 'Excellent'],
  ['UV resistance', 'Poor (yellows)', 'Moderate'],
  ['Flexibility', 'Brittle', 'Semi-flexible'],
  ['Stringing tendency', 'Low', 'Higher'],
]);

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

const FAQ = [
  {
    question: 'Is PETG better than PLA?',
    answer:
      'For anything functional, usually. PETG survives heat to around 80C where PLA softens near 60C, and it bends rather than snapping. PLA is easier to print and gives crisper detail, so it stays the better choice for display pieces.',
  },
  {
    question: 'Can I print PETG on the same printer as PLA?',
    answer:
      'Yes. PETG needs a hotter nozzle and a hotter bed but no enclosure, so any printer that runs PLA will run PETG. Expect to spend a little time on stringing, which is the one thing PETG is genuinely fussier about.',
  },
  {
    question: 'Why does PETG string so much more than PLA?',
    answer:
      'Mostly moisture. PETG is hygroscopic and PLA barely is, so a spool left open picks up water that boils at the nozzle and leaves threads. Dry the filament before adjusting retraction.',
  },
  {
    question: 'Which is stronger, PLA or PETG?',
    answer:
      'PLA is stiffer and PETG is tougher, which are different things. PLA resists bending harder but fails suddenly; PETG flexes and absorbs impact. For a part that gets knocked about, PETG lasts longer.',
  },
  {
    question: 'Is PLA or PETG better for outdoor use?',
    answer:
      'PETG. PLA is not a serious outdoor material: it softens in a hot car and degrades in sunlight. PETG handles both far better, though ASA beats it for anything permanently exposed.',
  },
];

export default function PlaVsPetgPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section aria-label="Page introduction" className="pt-20 pb-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <div style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontSize: '0.75rem', letterSpacing: '0.05em' }} className="uppercase font-semibold mb-4">
              <Link href="/" className="hover:underline">Home</Link>
              <span style={{ color: 'var(--muted-foreground)', margin: '0 0.5rem' }}>/</span>
              <span style={{ color: 'var(--muted-foreground)' }}>PLA vs PETG</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              PLA vs PETG: <span style={{ color: 'var(--brand-primary)' }}>which to use.</span>
            </h1>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="text-base">
              Pick the wrong filament and the part fails. Pick the right one and it works for years. PLA and PETG cover most of what hobbyists print. This page shows you which to use for every situation.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-label="Side-by-side comparison table" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>SIDE BY SIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Pick the right material in under a minute.</h2>
            <SpecGrid rows={SPECS} />
          </div>
        </section>

        {/* When to use PLA */}
        <section aria-label="When to use PLA" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>USE PLA WHEN</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Use PLA when heat and strength do not matter.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-8">
              PLA works well for anything that stays indoors and stays cool. It prints at the lowest temps, requires no heated bed, and forgives almost every tuning mistake. That makes it ideal for learning a new printer.
            </p>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PLA_USES.map((u, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: '0.75rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums' }} className="text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{u}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When to use PETG */}
        <section aria-label="When to use PETG" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>USE PETG WHEN</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Switch to PETG when the part has a job to do.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-8">
              PETG is the step-up material for parts that actually need to hold up. It handles more stress, more heat, and more flex than PLA, without needing an enclosure.
            </p>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PETG_USES.map((u, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: '0.75rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums' }} className="text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{u}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PETG problems */}
        <section aria-label="Common PETG problems and fixes" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PETG · COMMON ISSUES</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Fix these three PETG issues before you waste a spool.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PETG_PROBLEMS.map((p, i) => (
                <div
                  key={p.n}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gap: '1rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums' }} className="text-lg font-bold">{p.n}</span>
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
        <section aria-label="PETG limitations" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PETG LIMITS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Where PETG falls short.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PETG_LIMITS.map((l, i) => (
                <div
                  key={i}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr',
                    gap: '0.75rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-accent)', fontVariantNumeric: 'tabular-nums' }} className="text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section aria-label="Quick verdict by use case" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>DECISION GUIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Ten-second decision guide.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-2)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 200px' }}>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">If you are printing</span>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Use</span>
              </div>
              {VERDICT.map((v, i) => (
                <div
                  key={v.label}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 200px',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ ...bodyStyle }} className="text-sm">{v.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{v.answer}</span>
                </div>
              ))}
            </div>
            <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }} className="mt-8 text-sm">
              Not sure which material fits your project? See our <Link href="/3d-printing-filament-guide" style={linkStyle} className="underline hover:no-underline">complete filament guide</Link> for all 7 material types. Or compare <Link href="/abs-vs-petg" style={linkStyle} className="underline hover:no-underline">ABS vs PETG</Link> and <Link href="/pla-vs-abs" style={linkStyle} className="underline hover:no-underline">PLA vs ABS</Link>.
            </p>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Free settings sheet" className="py-20 px-6" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto">
            <Eyebrow>FREE SETTINGS SHEET</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Both materials, one reference sheet.</h2>
            <p style={{ ...bodyStyle, maxWidth: '52ch' }} className="mb-8">
              PETG from one brand and PETG from another need different retraction settings. Our one-page settings sheet gives you the starting point for both materials, with the temperatures and drying requirements side by side. A logging app is in development and we will say so here when it ships.
            </p>
            <Link
              href="/free-download"
              style={{
                background: 'var(--brand-primary)',
                color: 'var(--on-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
                borderRadius: '0.25rem',
                textTransform: 'uppercase',
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold min-h-[48px] transition-colors press-feedback"
            >
              Get the free field guide
            </Link>
          </div>
        </section>
        <Faq items={FAQ} heading="Common questions" />

        <ComparisonBuying slugs={['pla', 'petg']} />

        <OwnedServiceCta variant="comparison" />

      </main>
      <SiteFooter />
    </>
  );
}
