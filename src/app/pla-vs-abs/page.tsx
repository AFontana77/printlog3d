import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ComparisonBuying } from '@/components/ComparisonBuying';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import Link from 'next/link';
import { specRows, type SpecRow } from '@/components/ComparisonSpecs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PLA vs ABS: When to Upgrade and When to Stick with PLA',
  description: "PLA vs ABS compared: why most beginners don't need ABS, when ABS's heat resistance and machinability are worth the hassle, and the better upgrade path (PLA to PETG to ASA).",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'PLA vs ABS: When to Upgrade and When to Stick with PLA',
      description: "PLA vs ABS compared: why most beginners don't need ABS, when ABS's heat resistance and machinability are worth the hassle, and the better upgrade path.",
      url: 'https://www.printlog3d.com/pla-vs-abs',
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
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

const eyebrowStyle: React.CSSProperties = { fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', letterSpacing: '0.15em', fontSize: '0.7rem' };
const h2Style: React.CSSProperties = { fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.1 };
const h3Style: React.CSSProperties = { fontFamily: 'var(--font-display)', color: 'var(--foreground)' };
const bodyStyle: React.CSSProperties = { color: 'var(--body-text)', fontFamily: 'var(--font-body)', lineHeight: 1.65 };
const linkStyle: React.CSSProperties = { color: 'var(--brand-primary)' };

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={eyebrowStyle} className="uppercase font-semibold mb-6 flex items-center gap-3">
    <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--brand-primary)', flexShrink: 0 }} />
    {children}
  </div>
);

// Derived from materials.ts so this table cannot contradict the material
// pages. Only the editorial rows, which have no canonical field, are literal.
const SPECS: SpecRow[] = specRows('PLA', 'ABS', [
  ['Heat resistance', '~60°C deformation', '~100°C deformation'],
  ['Strength', 'Moderate', 'High'],
  ['Post-processing', 'Limited', 'Sandable, acetone-smoothable'],
  ['Fumes', 'None', 'Styrene (ventilate)'],
]);

const REASONS = [
  { n: '01', title: 'Warping is a real problem', body: "ABS warps badly without an enclosed, heated chamber. If your printer does not have an enclosure, you will fight warping on almost every ABS print, especially on larger parts. PLA prints flat without any of this friction." },
  { n: '02', title: 'The fumes require real ventilation', body: 'ABS emits styrene during printing. Styrene is a suspected carcinogen. You need active ventilation or HEPA filtration to print ABS safely. PLA is essentially odorless.' },
  { n: '03', title: 'Better options exist for most use cases', body: "PETG is stronger than PLA, handles up to 80°C, and does not need an enclosure. For outdoor use, ASA is UV-stable and easier to print than ABS. For most people, ABS is never the right next step after PLA." },
];

const ABS_USES = [
  { n: '01', body: 'You need parts that survive above 80°C and you already have an enclosure, or a printer with one built in (Bambu X1 Carbon, Prusa XL, etc.).' },
  { n: '02', body: 'You want acetone vapor smoothing for a factory-smooth finish. ABS is the only common FDM filament this works on. PETG does not respond to acetone.' },
  { n: '03', body: 'You are replicating original plastic parts that were ABS. Matching the coefficient of thermal expansion for bonding to existing plastic components.' },
  { n: '04', body: 'You need acetone solvent bonding for strong multi-part assemblies. ABS joints bonded with acetone or MEK are stronger than adhesive bonding.' },
];

const PLA_STRENGTHS = [
  'Very sharp detail resolution. Better than ABS at the same layer height.',
  'No warping. Prints flat every time.',
  'No fumes. Safe to print indoors without ventilation.',
  'Huge color and finish selection. More options than any other filament type.',
  'Consistent across brands. PLA from different manufacturers prints similarly.',
];

const RELATED = [
  { href: '/pla-vs-petg', title: 'PLA vs PETG', desc: 'The most common comparison. When to step up.' },
  { href: '/abs-vs-petg', title: 'ABS vs PETG', desc: 'Which is better for functional parts?' },
  { href: '/library', title: 'All 17 Materials', desc: 'Print settings, enclosure and drying for every material.' },
  { href: '/3d-print-stringing', title: 'Fix Stringing', desc: 'Retraction, temp, and combing explained.' },
];

export default function PlaVsAbsPage() {
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
              <span style={{ color: 'var(--muted-foreground)' }}>PLA vs ABS</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              PLA vs ABS: <span style={{ color: 'var(--brand-primary)' }}>upgrade or stay?</span>
            </h1>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="text-base">
              Most beginners assume ABS is the next step after PLA. It is not. For most printers, PETG is a better upgrade than ABS. Easier to print, no fumes, no enclosure required. This page shows you when ABS is actually worth the hassle and when to stay on PLA.
            </p>
          </div>
        </section>

        {/* Comparison table */}
        <section aria-label="PLA vs ABS comparison table" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>SIDE BY SIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">PLA vs ABS: know the gap before you switch.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden', fontVariantNumeric: 'tabular-nums' }}>
              <div style={{ background: 'var(--surface-2)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '180px 1fr 1fr' }}>
                {['Property', 'PLA', 'ABS'].map((h) => (
                  <span key={h} style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">{h}</span>
                ))}
              </div>
              {SPECS.map(([prop, pla, abs], i) => (
                <div
                  key={prop}
                  style={{
                    padding: '0.875rem 1.25rem',
                    borderTop: '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 1fr',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{prop}</span>
                  <span style={{ ...bodyStyle }} className="text-sm">{pla}</span>
                  <span style={{ ...bodyStyle }} className="text-sm">{abs}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why most don't need ABS */}
        <section aria-label="Why most printers don't need ABS" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>FRICTION POINTS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Three reasons ABS will frustrate you before it helps you.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {REASONS.map((r, i) => (
                <div
                  key={r.n}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gap: '1rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums' }} className="text-lg font-bold">{r.n}</span>
                  <div>
                    <p style={h3Style} className="font-bold mb-2">{r.title}</p>
                    <p style={{ ...bodyStyle }} className="text-sm">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upgrade path */}
        <section aria-label="The better filament upgrade path" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>UPGRADE PATH</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">The path that gets you printing better parts faster.</h2>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch mb-8">
              {[
                { label: 'PLA', sub: 'Learn the printer' },
                { label: 'PETG', sub: 'Functional parts' },
                { label: 'ASA', sub: 'Outdoor parts' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-3 flex-1">
                  <div
                    style={{
                      flex: 1,
                      background: 'var(--surface-0)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.25rem',
                      padding: '1.25rem 1rem',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', letterSpacing: '0.05em' }} className="text-2xl font-bold mb-1">{step.label}</p>
                    <p style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.08em', fontSize: '0.65rem' }} className="uppercase font-semibold">{step.sub}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <span style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }} className="text-2xl font-bold hidden sm:block">→</span>
                  )}
                </div>
              ))}
            </div>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }}>
              ABS is a side branch for specific needs, not the natural next step after PLA. Most experienced printers never use ABS regularly. PETG handles the load for 90% of functional parts, and ASA covers outdoor applications without ABS warping and fume issues.
            </p>
          </div>
        </section>

        {/* When ABS is right */}
        <section aria-label="When ABS is the correct material" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>USE ABS WHEN</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Four situations where ABS is the right material.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {ABS_USES.map((u, i) => (
                <div
                  key={u.n}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gap: '1rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums' }} className="text-lg font-bold">{u.n}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{u.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLA strengths */}
        <section aria-label="PLA strengths worth remembering" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PLA STRENGTHS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Why experienced printers still reach for PLA.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-8">
              A lot of experienced printers still reach for PLA. Not because they have not learned ABS, but because PLA is actually the right tool for a large class of prints.
            </p>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {PLA_STRENGTHS.map((s, i) => (
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
                  <p style={{ ...bodyStyle }} className="text-sm">{s}</p>
                </div>
              ))}
            </div>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mt-8">
              For anything that does not need heat resistance or outdoor use, PLA is often the correct answer even for experienced printers.
            </p>
          </div>
        </section>

        {/* Cross-links */}
        <section aria-label="Related material guides" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>RELATED</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Keep going.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {RELATED.map((r, i) => (
                <Link
                  key={r.href}
                  href={r.href}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '240px 1fr 100px',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{r.title}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{r.desc}</p>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', letterSpacing: '0.08em', fontSize: '0.7rem', textAlign: 'right' }} className="uppercase font-semibold">Read &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Free settings sheet" className="py-20 px-6" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto">
            <Eyebrow>FREE SETTINGS SHEET</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Both materials, one reference sheet.</h2>
            <p style={{ ...bodyStyle, maxWidth: '52ch' }} className="mb-8">
              PLA and ABS behave nothing alike, and the settings that matter differ for each. Our one-page settings sheet has both, including the enclosure and drying requirements that decide whether an ABS print succeeds. A logging app is in development and we will say so here when it ships.
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
              Get the Free App
            </Link>
          </div>
        </section>
        <ComparisonBuying slugs={['pla', 'abs']} />

        <OwnedServiceCta variant="comparison" />

      </main>
      <SiteFooter />
    </>
  );
}
