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
import { MATERIAL_PROFILES } from '@/lib/materials';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ABS vs PETG: Which Is Better for Functional Parts?',
  description: "ABS vs PETG compared: heat resistance, warp risk, fumes, ease of print, and why PETG wins for most functional parts unless you specifically need ABS's higher temperature tolerance.",
};

const jsonLd = comparisonJsonLd({
  title: 'ABS vs PETG: Which Is Better for Functional Parts?',
  description: "ABS vs PETG compared: heat resistance, warp risk, fumes, ease of print, and why PETG wins for most functional parts unless you specifically need ABS's higher temperature tolerance.",
  url: 'https://www.printlog3d.com/abs-vs-petg',
  breadcrumb: 'ABS vs PETG',
});



// Derived from materials.ts so this table cannot contradict the material
// pages. Only the editorial rows, which have no canonical field, are literal.
const SPECS: SpecRow[] = specRows('ABS', 'PETG', [
  ['Heat resistance', '~100°C deformation', '~80°C deformation'],
  ['Chemical resistance', 'Good', 'Moderate'],
  ['Fumes', 'Yes (styrene)', 'Minimal'],
  ['Warping risk', 'High without enclosure', 'Low'],
  ['Post-processing', 'Sandable, acetone-smoothable', 'Limited (sanding dulls surface)'],
]);

const ABS_WINS = [
  { n: '01', title: 'Parts that need to survive above 80°C', body: 'PETG deforms around 80°C. ABS holds to ~100°C. If your part lives near a heat source, engine bay, oven-adjacent, under-hood, ABS has the edge.' },
  { n: '02', title: 'Acetone vapor smoothing', body: 'Acetone dissolves ABS surface to create a near-injection-mold finish. No layer lines visible. PETG does not respond to acetone. If surface finish matters, ABS gives you a finishing option that PETG simply does not have.' },
  { n: '03', title: 'Solvent bonding', body: 'ABS parts can be bonded with acetone or MEK to create joints stronger than adhesive bonding. This is useful for multi-piece assemblies where super glue will not hold the load.' },
  { n: '04', title: 'Chemical resistance', body: 'ABS resists many oils and organic solvents better than PETG. For parts that contact lubricants, fuels, or cleaning chemicals, ABS holds up better.' },
];

const PETG_WINS = [
  { title: 'No enclosure required', body: 'PETG does not warp without an enclosed chamber. ABS almost certainly will warp without one, especially on large flat prints. If your printer is open-frame, PETG is the obvious choice.' },
  { title: 'No styrene fumes', body: 'ABS emits styrene, a suspected carcinogen. Always print ABS with ventilation or a filtration enclosure. PETG is much safer. No harsh fumes, fine to print in an office or home workspace.' },
  { title: 'Better layer adhesion', body: 'PETG bonds between layers better than ABS. For most mechanical loading scenarios, a PETG print is actually stronger than ABS despite the lower heat resistance.' },
  { title: 'More forgiving to print', body: 'PETG has a wider process window. ABS requires tight temp control, a warm enclosure, and a hot bed. PETG tolerates more variation and fails less often.' },
];

const FAQ = [
  {
    question: 'Is PETG as strong as ABS?',
    answer:
      "For most parts, near enough, and it is far easier to print. ABS wins on heat, holding shape to roughly 100C against PETG's 80C. Below that, PETG usually does the job without an enclosure or fumes.",
  },
  {
    question: 'Do I need an enclosure for PETG?',
    answer:
      'No. PETG shrinks little enough to print on an open frame, which is the single biggest practical difference between the two. ABS needs still, warm air or it lifts.',
  },
  {
    question: 'Can PETG be acetone smoothed?',
    answer:
      'No. Acetone does nothing useful to PETG, and sanding dulls it rather than polishing it. If a smooth finish matters, ABS gives you a finishing route PETG does not have.',
  },
  {
    question: 'Which is better for functional parts?',
    answer:
      "PETG for most, ABS when heat is involved. PETG's flexibility means a bracket bends instead of snapping, and it needs no special hardware to print reliably.",
  },
  {
    question: 'Does ABS or PETG smell more?',
    answer:
      "ABS, clearly. It releases styrene and needs ventilation. PETG's emissions are minimal by comparison, which matters if the printer shares a room with you.",
  },
];

export default function AbsVsPetgPage() {
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
              <span style={{ color: 'var(--muted-foreground)' }}>ABS vs PETG</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              ABS vs PETG: <span style={{ color: 'var(--brand-primary)' }}>which wins?</span>
            </h1>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="text-base">
              ABS used to be the go-to for strong parts. PETG changed that. For most functional prints, PETG is easier, safer, and stronger where it counts. This page shows you the four situations where ABS still wins, and when PETG is the smarter call.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-label="ABS vs PETG comparison table" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>SIDE BY SIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">See the key differences before you load the spool.</h2>
            <SpecGrid rows={SPECS} />
          </div>
        </section>

        {/* When ABS wins */}
        <section aria-label="When ABS is the better choice" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>ABS WINS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">The 4 situations where ABS is the right call.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {ABS_WINS.map((w, i) => (
                <div
                  key={w.n}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gap: '1rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums' }} className="text-lg font-bold">{w.n}</span>
                  <div>
                    <p style={h3Style} className="font-bold mb-2">{w.title}</p>
                    <p style={{ ...bodyStyle }} className="text-sm">{w.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When PETG wins */}
        <section aria-label="When PETG is the better choice" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PETG WINS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Use PETG and skip the enclosure, fumes, and warping.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-2)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '240px 1fr' }}>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Advantage</span>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Why it matters</span>
              </div>
              {PETG_WINS.map((w, i) => (
                <div
                  key={w.title}
                  style={{
                    padding: '1.25rem 1.25rem',
                    borderTop: '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr',
                    gap: '1rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{w.title}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ASA alternative */}
        <section aria-label="ASA as an alternative to ABS" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>OUTDOOR · USE ASA INSTEAD</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Outdoor part? Skip ABS. Use ASA.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }}>
              If you are considering ABS because you need UV resistance outdoors, do not. Use ASA. ASA is ABS modified specifically for UV resistance. It does not yellow in sunlight, handles the same heat range as ABS (~100°C), and is actually easier to print than ABS on most setups. ASA has almost entirely replaced ABS for outdoor applications. The only reason to pick ABS over ASA outdoors is if you specifically need acetone vapor smoothing.
            </p>
          </div>
        </section>

        {/* Verdict */}
        <section aria-label="Final verdict" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>VERDICT</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">The one-sentence verdict.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-4">
              Use PETG for 90% of functional parts. It is easier to print, safer to breathe, does not need an enclosure, and bonds layers better than ABS.
            </p>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-8">
              Switch to ABS only if you specifically need heat tolerance above 80°C, acetone smoothing, acetone solvent bonding, or chemical resistance that PETG cannot provide.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/pla-vs-petg" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">PLA vs PETG</Link>
              <Link href="/pla-vs-abs" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">PLA vs ABS</Link>
              <Link href="/library" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">All {MATERIAL_PROFILES.length} materials</Link>
              <Link href="/how-to-dry-filament" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">Dry your filament</Link>
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Free settings sheet" className="py-20 px-6" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto">
            <Eyebrow>FREE SETTINGS SHEET</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Both materials, one reference sheet.</h2>
            <p style={{ ...bodyStyle, maxWidth: '52ch' }} className="mb-8">
              ABS needs enclosure temperatures. PETG needs retraction dialled in per brand. Our one-page settings sheet covers both, alongside every other material we document. A logging app is in development and we will say so here when it ships.
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

        <ComparisonBuying slugs={['abs', 'petg']} />

        <OwnedServiceCta variant="comparison" />

      </main>
      <SiteFooter />
    </>
  );
}
