import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Printing Filament Guide: PLA, PETG, ABS, ASA, Nylon, TPU, Resin',
  description: 'The complete 3D printing filament guide: every material type explained with print settings, strengths, weaknesses, and which to use for your project. From PLA for beginners to Nylon for engineering parts.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '3D Printing Filament Guide: PLA, PETG, ABS, ASA, Nylon, TPU, Resin',
      description: 'The complete 3D printing filament guide: every material type explained with print settings, strengths, weaknesses, and which to use for your project.',
      url: 'https://www.printlog3d.com/3d-printing-filament-guide',
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
        { '@type': 'ListItem', position: 2, name: '3D Printing Filament Guide', item: 'https://www.printlog3d.com/3d-printing-filament-guide' },
      ],
    },
  ],
};

const materials = [
  { name: 'PLA', printTemp: '190-220°C', bedTemp: '45-60°C (optional)', enclosure: 'No', difficulty: 'Beginner', bestFor: 'General printing, models, prototypes' },
  { name: 'PETG', printTemp: '230-250°C', bedTemp: '70-85°C', enclosure: 'No', difficulty: 'Intermediate', bestFor: 'Functional parts, mild heat, food-safe' },
  { name: 'ABS', printTemp: '230-250°C', bedTemp: '100-110°C', enclosure: 'Yes (required)', difficulty: 'Advanced', bestFor: 'High-heat parts, chemical resistance' },
  { name: 'ASA', printTemp: '240-260°C', bedTemp: '90-100°C', enclosure: 'Yes (recommended)', difficulty: 'Advanced', bestFor: 'Outdoor, UV-resistant' },
  { name: 'Nylon', printTemp: '240-280°C', bedTemp: '70-90°C', enclosure: 'Yes', difficulty: 'Advanced', bestFor: 'High strength, self-lubricating' },
  { name: 'TPU', printTemp: '220-240°C', bedTemp: '30-60°C', enclosure: 'No', difficulty: 'Intermediate', bestFor: 'Flexible parts, gaskets, grips' },
  { name: 'Resin (SLA/DLP)', printTemp: 'N/A (UV cure)', bedTemp: 'N/A', enclosure: 'No', difficulty: 'Intermediate', bestFor: 'Ultra-fine detail, jewelry, miniatures' },
];

const decisionRows = [
  { q: 'Decorative or prototype?', a: 'PLA' },
  { q: 'Functional part, mild heat?', a: 'PETG' },
  { q: 'High heat above 80°C or chemical exposure?', a: 'ABS or ASA' },
  { q: 'Outdoors long-term?', a: 'ASA (not ABS, not PETG)' },
  { q: 'Flexible part?', a: 'TPU' },
  { q: 'Ultra-fine detail?', a: 'Resin (different printer required)' },
  { q: 'Maximum strength?', a: 'Nylon (dry it first)' },
];

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'oklch(0.43 0.22 295)',
  letterSpacing: '0.15em',
  fontSize: '0.7rem',
};

const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'oklch(0.15 0.02 295)',
  lineHeight: 1.1,
};

const bodyStyle: React.CSSProperties = {
  color: 'oklch(0.35 0.018 295)',
  fontFamily: 'var(--font-body)',
  lineHeight: 1.65,
};

const h3Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'oklch(0.15 0.02 295)',
};

const linkStyle: React.CSSProperties = { color: 'oklch(0.43 0.22 295)' };

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={eyebrowStyle} className="uppercase font-semibold mb-6 flex items-center gap-3">
    <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
    {children}
  </div>
);

export default function FilamentGuidePage() {
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
              <span style={{ color: 'oklch(0.48 0.015 295)' }}>3D Printing Filament Guide</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.15 0.02 295)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              3D printing <span style={{ color: 'oklch(0.43 0.22 295)' }}>filament guide.</span>
            </h1>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="text-base">
              The wrong material choice wastes a spool and fails the part. The right one prints first try and holds up for years. Seven filament types cover every FDM use case. This page tells you which one to reach for and what settings to start with.
            </p>
          </div>
        </section>

        {/* Settings reference table */}
        <section aria-label="Filament settings reference table" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>SPEC TABLE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Every material at a glance.</h2>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden', fontVariantNumeric: 'tabular-nums' }}>
              <div style={{ background: 'oklch(0.92 0.012 295)', padding: '0.625rem 1rem', display: 'grid', gridTemplateColumns: '110px 130px 130px 130px 110px 1fr', gap: '0.75rem' }}>
                {['Material', 'Print Temp', 'Bed Temp', 'Enclosure', 'Difficulty', 'Best For'].map((h) => (
                  <span key={h} style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.48 0.015 295)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">
                    {h}
                  </span>
                ))}
              </div>
              {materials.map((m, i) => (
                <div
                  key={m.name}
                  style={{
                    padding: '0.875rem 1rem',
                    borderTop: '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '110px 130px 130px 130px 110px 1fr',
                    gap: '0.75rem',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)' }} className="text-sm font-semibold">{m.name}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.15 0.02 295)' }} className="text-sm">{m.printTemp}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.15 0.02 295)' }} className="text-sm">{m.bedTemp}</span>
                  <span style={{ ...bodyStyle }} className="text-sm">{m.enclosure}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)' }} className="text-xs uppercase font-semibold">{m.difficulty}</span>
                  <span style={{ ...bodyStyle }} className="text-sm">{m.bestFor}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLA */}
        <section aria-label="PLA filament overview" className="py-20 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PLA</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Start here: PLA for learning, PETG for real parts.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-3">
              PLA is the most beginner-friendly filament. It prints at low temps, produces no harsh fumes, and warps very little. It is made from corn starch, so it is biodegradable. The weak point: PLA deforms around 60°C. Leave a PLA print in a hot car and it warps. PLA+ versions add impact resistance and some flexibility. For most indoor uses, PLA is still the right answer even for experienced printers.
            </p>
            <p style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }} className="text-sm">
              Compare options: <Link href="/pla-vs-petg" style={linkStyle} className="underline hover:no-underline">PLA vs PETG</Link> or <Link href="/pla-vs-abs" style={linkStyle} className="underline hover:no-underline">PLA vs ABS</Link>
            </p>
          </div>
        </section>

        {/* PETG */}
        <section aria-label="PETG filament overview" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PETG</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Move to PETG when the part needs to hold up.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-3">
              PETG is the natural step up from PLA. It is stronger, handles more heat (up to ~80°C), and some brands are food-safe certified. The trade-off: it strings more than PLA, and it bonds aggressively to bare glass beds. Use a PEI sheet or glue stick. No enclosure needed.
            </p>
            <p style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }} className="text-sm">
              Read the full breakdown: <Link href="/pla-vs-petg" style={linkStyle} className="underline hover:no-underline">PLA vs PETG</Link> or <Link href="/abs-vs-petg" style={linkStyle} className="underline hover:no-underline">ABS vs PETG</Link>
            </p>
          </div>
        </section>

        {/* ABS */}
        <section aria-label="ABS filament overview" className="py-20 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>ABS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">ABS: high heat and acetone finishing, with real trade-offs.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-3">
              ABS is the classic workhorse, the same plastic used in LEGO bricks. It holds up to ~100°C and can be smoothed with acetone vapor for a near-injection-mold finish. The downside: it emits styrene fumes during printing (ventilate) and warps badly without an enclosed build volume. Most people do not actually need ABS anymore. PETG covers 90% of functional part needs, and ASA is a better outdoor choice than ABS.
            </p>
            <p style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }} className="text-sm">
              See: <Link href="/abs-vs-petg" style={linkStyle} className="underline hover:no-underline">ABS vs PETG</Link> and <Link href="/pla-vs-abs" style={linkStyle} className="underline hover:no-underline">PLA vs ABS</Link>
            </p>
          </div>
        </section>

        {/* ASA */}
        <section aria-label="ASA filament overview" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>ASA</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Use ASA for anything that lives outdoors.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }}>
              ASA is ABS modified for UV resistance. It does not yellow in sunlight and handles the same temperature range as ABS (~100°C). For almost every outdoor application, ASA is the better call over ABS. It needs slightly higher temps than ABS but prints similarly. An enclosure is recommended to prevent warping, though it tolerates slightly more draft than ABS.
            </p>
          </div>
        </section>

        {/* Nylon */}
        <section aria-label="Nylon filament overview" className="py-20 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>NYLON</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">When you need more than hobby filaments.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-3">
              Nylon has the highest strength of any common FDM filament. It is also self-lubricating, which makes it ideal for gears, bearings, and moving parts. The major catch: Nylon is hygroscopic. It absorbs moisture from open air in as little as 1 to 2 hours and prints terribly when wet. You must store Nylon in an airtight container and dry it before every print run.
            </p>
            <p style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }} className="text-sm">
              Read: <Link href="/how-to-dry-filament" style={linkStyle} className="underline hover:no-underline">How to dry filament</Link>
            </p>
          </div>
        </section>

        {/* TPU */}
        <section aria-label="TPU filament overview" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>TPU</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">TPU: the only filament that bends without breaking.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }}>
              TPU is flexible and rubber-like. Shore hardness varies by brand. 95A is common and feels similar to a shoe sole. Print slow (30 to 40 mm/s) and use a direct drive extruder if possible. Bowden setups can print TPU but require very low retraction and slower speeds to avoid jamming. Good for phone cases, grips, gaskets, and any part that needs to flex and return.
            </p>
          </div>
        </section>

        {/* Resin */}
        <section aria-label="Resin overview" className="py-20 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>RESIN</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Resin: when detail matters more than anything else.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }}>
              Resin printing is a completely different process from FDM. SLA and DLP printers use UV light to cure liquid photopolymer resin layer by layer. The result: far more detailed prints than FDM can produce. The trade-off: liquid resin is toxic and requires careful handling, an IPA wash station, and a UV post-cure lamp. Resin is not interchangeable with FDM filament. You need a different printer type entirely.
            </p>
          </div>
        </section>

        {/* Decision flowchart */}
        <section aria-label="How to choose your filament" className="py-20 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>DECISION GUIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Which filament should you use? Answer in 30 seconds.</h2>
            <div style={{ border: '1px solid oklch(0.84 0.015 295)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ background: 'oklch(0.92 0.012 295)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 240px' }}>
                <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.48 0.015 295)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Question</span>
                <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.48 0.015 295)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Answer</span>
              </div>
              {decisionRows.map((row, i) => (
                <div
                  key={row.q}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid oklch(0.84 0.015 295)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 240px',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <span style={{ ...bodyStyle }} className="text-sm">{row.q}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'oklch(0.43 0.22 295)' }} className="text-sm font-semibold">{row.a}</span>
                </div>
              ))}
            </div>
            <p style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }} className="mt-8 text-sm">
              Need side-by-side detail? See <Link href="/pla-vs-petg" style={linkStyle} className="underline hover:no-underline">PLA vs PETG</Link>, <Link href="/abs-vs-petg" style={linkStyle} className="underline hover:no-underline">ABS vs PETG</Link>, or <Link href="/pla-vs-abs" style={linkStyle} className="underline hover:no-underline">PLA vs ABS</Link>. If your prints have problems, start with our guides on <Link href="/3d-print-stringing" style={linkStyle} className="underline hover:no-underline">stringing</Link> and <Link href="/how-to-dry-filament" style={linkStyle} className="underline hover:no-underline">drying filament</Link>.
            </p>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Download the app" className="py-20 px-6" style={{ background: 'oklch(0.92 0.012 295)', borderTop: '1px solid oklch(0.84 0.015 295)' }}>
          <div className="max-w-3xl mx-auto">
            <Eyebrow>FREE APP</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Log every material you try. Never start from zero again.</h2>
            <p style={{ ...bodyStyle, maxWidth: '52ch' }} className="mb-8">
              Every material has its own quirks. So does every brand within that material. Log your print temp, bed temp, retraction, and notes per spool in PrintLog3D. When you revisit that material six months later, you have a starting point that actually worked. No guessing. No wasted first prints.
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
