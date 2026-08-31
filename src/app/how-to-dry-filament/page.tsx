import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { GearAdvice, type GearSpec } from '@/components/GearAdvice';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import { DryingDecision } from '@/components/DryingDecision';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Dry Filament: Signs of Wet Filament & 3 Drying Methods',
  description: 'Learn to spot wet filament (popping sounds, rough surface, stringing) and how to dry it with a filament dryer, food dehydrator, or oven. Includes drying temps and times for PLA, PETG, Nylon, and TPU.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'How to Dry Filament: Signs of Wet Filament and 3 Drying Methods',
      description: 'Spot wet filament and dry it correctly with a filament dryer, food dehydrator, or oven. Includes drying temps and times for PLA, PETG, Nylon, and TPU.',
      url: 'https://www.printlog3d.com/how-to-dry-filament',
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
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

const SIGNS = [
  { num: '01', title: 'Popping or cracking from the nozzle', desc: 'Small water pockets vaporize as they hit the hot end. You can hear it: a faint crackling or popping while printing. This is the clearest sign of wet filament.' },
  { num: '02', title: 'Rough, bubbly, or fuzzy surface texture', desc: 'Steam escaping through the extruded bead creates small bubbles and a rough surface. Prints that used to come out smooth suddenly look textured or pebbled.' },
  { num: '03', title: 'More stringing than usual', desc: 'Wet filament strings badly even on settings that worked last week. If your stringing got worse without changing anything, moisture is likely the cause.' },
  { num: '04', title: 'Weak, brittle layer adhesion', desc: 'Layers delaminate under light force. Wet filament does not fuse as well between layers, so the print snaps along layer lines instead of through the material.' },
  { num: '05', title: 'White wisps of steam from the nozzle', desc: 'Visible steam or white smoke coming off the nozzle during printing is a definitive sign. The filament is boiling water as it extrudes.' },
];

const ABSORB_RATES = [
  { material: 'Nylon', speed: 'Hours', detail: 'Absorbs moisture from open air in 1 to 2 hours in humid conditions. Must be printed dry and stored sealed.' },
  { material: 'TPU', speed: 'Hours to 1 day', detail: 'Nearly as fast as Nylon. Store sealed with desiccant between uses.' },
  { material: 'PETG', speed: 'Days', detail: 'Absorbs moisture within a few days in normal room humidity. Dry before any print run if the spool has been open more than a week.' },
  { material: 'PLA+', speed: 'Days to 1 week', detail: 'Absorbs faster than standard PLA. Additives that improve flexibility also attract moisture.' },
  { material: 'ABS / ASA', speed: 'Many days', detail: 'Moderate absorption rate. Usually fine for a few weeks in normal conditions.' },
  { material: 'Standard PLA', speed: 'Weeks', detail: 'The most moisture-resistant common filament. Low risk for short-term storage in normal humidity.' },
];

const DRYER_TEMPS = [
  ['PLA', '45-50°C', '4-8 hours'],
  ['PETG / ABS / ASA', '65°C', '4-8 hours'],
  ['Nylon', '70-80°C', '12+ hours'],
  ['TPU', '45-55°C', '4-6 hours'],
];

const STORAGE_TIPS = [
  'Airtight bag or container with silica gel desiccant packets. This is the minimum for Nylon and TPU.',
  'Vacuum storage bags remove air entirely. Best option for long-term Nylon and TPU storage.',
  'Desiccant packs recharge in an oven at 120°C for 1 hour. Reuse them indefinitely.',
  'Log the date you opened each spool. After 2 to 3 weeks in humid air, PETG and TPU likely need drying again.',
];

/**
 * Derived from the DRYER_TEMPS table above: nylon at 70-80C is the hottest case
 * this guide documents, so 80C is the number that decides whether a given unit
 * can actually do the job. Budget dryers commonly stop at 55-60C, which covers
 * PLA and nothing else demanding.
 */
const DRYING_EQUIPMENT: GearSpec[] = [
  {
    category: 'Filament dryer',
    requirement: 'Must reach 70C to cover nylon',
    why: 'A unit that stops at 55-60C will dry PLA and little else. Nylon needs 70-80C for 12 hours or more, so 70C is the floor worth buying and anything higher is margin. Maximum temperature is the specification that decides whether a dryer is worth owning, and it is usually buried in the spec sheet rather than the product title.',
    searchTerms: 'filament dryer nylon',
  },
  {
    category: 'Hygrometer',
    requirement: 'Small digital unit that fits in a storage box',
    why: 'The cheapest way to stop guessing. If the box reads under 20% relative humidity the filament inside is fine, and you can skip a drying cycle you did not need.',
    searchTerms: 'mini digital hygrometer',
  },
  {
    category: 'Airtight storage with rechargeable desiccant',
    requirement: 'Sealed container plus indicating silica gel',
    why: 'Drying a spool achieves nothing if it then sits on an open shelf. Indicating desiccant changes colour when spent, and recharges in an oven at 120C for an hour, so it is a one-time purchase.',
    searchTerms: 'airtight filament storage container rechargeable desiccant',
  },
  {
    category: 'Vacuum storage bags',
    requirement: 'Valve type, sized for a 1 kg spool',
    why: 'For spools you will not touch for months. Removing the air entirely beats desiccant alone for long-term nylon and TPU storage.',
    searchTerms: 'vacuum storage bags filament spool',
  },
];

export default function HowToDryFilamentPage() {
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
              <span style={{ color: 'var(--muted-foreground)' }}>How to Dry Filament</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              How to <span style={{ color: 'var(--brand-primary)' }}>dry filament.</span>
            </h1>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="text-base">
              Bad prints often have nothing to do with your slicer settings. The filament is wet. Moisture turns to steam in the nozzle and ruins the surface, the layer bonds, and the stringing. Dry the filament and those problems disappear. Here is how to tell if yours is wet and how to fix it.
            </p>
          </div>
        </section>

        {/* Signs of wet filament */}
        <section aria-label="Signs that your filament is wet" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>DIAGNOSIS · 5 SIGNS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Your filament is wet. Here is how to tell.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {SIGNS.map((s, i) => (
                <div
                  key={s.num}
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gap: '1rem',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums' }} className="text-lg font-bold">{s.num}</span>
                  <div>
                    <p style={h3Style} className="font-semibold mb-1">{s.title}</p>
                    <p style={{ ...bodyStyle }} className="text-sm">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Absorption rates */}
        <section aria-label="Moisture absorption by filament type" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>ABSORPTION RATES</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Know which filaments go bad fastest.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-10">
              Fastest to slowest. Listed from most to least moisture-sensitive.
            </p>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-2)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '140px 140px 1fr' }}>
                {['Material', 'Speed', 'Detail'].map((h) => (
                  <span key={h} style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">{h}</span>
                ))}
              </div>
              {ABSORB_RATES.map((r, i) => (
                <div
                  key={r.material}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '140px 140px 1fr',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{r.material}</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }} className="text-sm">{r.speed}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3 drying methods */}
        <section aria-label="Three methods for drying filament" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>METHODS · RANKED BY SAFETY</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">The three ways to dry filament.</h2>

            {/* Method 1 */}
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '0.25rem', padding: '1.5rem', marginBottom: '1rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ background: 'var(--brand-primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', fontSize: '0.65rem', padding: '0.25rem 0.5rem', borderRadius: '0.125rem' }} className="uppercase font-semibold">Best</span>
                <h3 style={h3Style} className="text-xl font-bold">01. Dedicated filament dryer ($30-60)</h3>
              </div>
              <p style={{ ...bodyStyle }} className="text-sm mb-5">
                The easiest option. Set it and leave it. SUNLU, Sovol, and eSUN all make good ones. You can print directly from the dryer while it runs. No need to wait.
              </p>
              <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden', fontVariantNumeric: 'tabular-nums' }}>
                <div style={{ background: 'var(--surface-2)', padding: '0.5rem 1rem', display: 'grid', gridTemplateColumns: '1fr 100px 100px' }}>
                  {['Material', 'Temp', 'Time'].map((h) => (
                    <span key={h} style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.6rem' }} className="uppercase font-semibold">{h}</span>
                  ))}
                </div>
                {DRYER_TEMPS.map((row, i) => (
                  <div
                    key={row[0]}
                    style={{
                      padding: '0.625rem 1rem',
                      borderTop: '1px solid var(--border)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 100px 100px',
                      background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{row[0]}</span>
                    <span style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }} className="text-sm">{row[1]}</span>
                    <span style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }} className="text-sm">{row[2]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Method 2 */}
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '0.25rem', padding: '1.5rem', marginBottom: '1rem' }}>
              <h3 style={h3Style} className="text-xl font-bold mb-3">02. Food dehydrator</h3>
              <p style={{ ...bodyStyle }} className="text-sm">
                Works well if the dehydrator reaches high enough temps. Many units max at 70°C. Fine for most materials. The key check: measure if a standard 1kg spool fits inside before buying. Some smaller dehydrators cannot fit a full spool without removing a shelf tray. Run at the same temps listed above. 4 to 6 hours is usually enough for PLA, PETG, and ABS. Nylon needs more time.
              </p>
            </div>

            {/* Method 3 */}
            <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: '0.25rem', padding: '1.5rem' }}>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ background: 'var(--brand-accent)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', fontSize: '0.65rem', padding: '0.25rem 0.5rem', borderRadius: '0.125rem' }} className="uppercase font-semibold">Use Caution</span>
                <h3 style={h3Style} className="text-xl font-bold">03. Household oven</h3>
              </div>
              <p style={{ ...bodyStyle }} className="text-sm mb-3">
                This works but requires care. Most ovens do not hold temperature accurately below 100°C. The actual temp can swing 10 to 15°C above or below the dial setting. PLA will soften and warp if the oven runs hot (PLA deforms at 60°C).
              </p>
              <p style={{ ...bodyStyle }} className="text-sm">
                If using an oven: verify temperature with a separate digital oven thermometer before putting filament in. Crack the door slightly for airflow. Not recommended unless you have confirmed temperature accuracy. For Nylon and TPU, use a dedicated dryer instead.
              </p>
            </div>
          </div>
        </section>

        {/* Storage after drying */}
        <section aria-label="How to store filament after drying" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>STORAGE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Keep it dry between prints.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-8">
              Drying fixes the problem, but only until the spool absorbs moisture again. Proper storage keeps filament dry between uses.
            </p>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {STORAGE_TIPS.map((tip, i) => (
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
                  <p style={{ ...bodyStyle }} className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-links */}
        <DryingDecision />

        <GearAdvice
          heading="What you actually need"
          intro="Four things cover every drying and storage case on this page. Each one is listed with the specification that decides whether a given product will do the job, because that is the part product titles tend to omit."
          items={DRYING_EQUIPMENT}
        />

        <section aria-label="Materials beyond consumer drying equipment" className="py-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-3xl mx-auto">
            <h2 style={h2Style} className="text-2xl sm:text-3xl font-bold mb-4">Some materials need an oven, not a dryer.</h2>
            <p style={bodyStyle} className="text-base mb-4">
              Everything above assumes a filament dryer topping out around 80&deg;C, which covers
              every material most people print. It does not cover the high-temperature engineering
              materials. PEEK needs 120 to 150&deg;C for three hours or more, which is a laboratory
              oven, not a spool warmer.
            </p>
            <p style={bodyStyle} className="text-base">
              If you are drying one of those, do not buy a filament dryer and hope. Check the{' '}
              <Link href="/library/peek" style={linkStyle} className="underline hover:no-underline">PEEK</Link>,{' '}
              <Link href="/library/pa-cf" style={linkStyle} className="underline hover:no-underline">PA-CF</Link>{' '}and{' '}
              <Link href="/library/pc" style={linkStyle} className="underline hover:no-underline">polycarbonate</Link>{' '}
              pages for the actual requirement first.
            </p>
          </div>
        </section>

        <OwnedServiceCta variant="troubleshooting" tone="inline" />

        <section aria-label="Related guides" className="py-12 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <p style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold mb-4">Related guides</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/3d-printing-filament-guide" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">3D Printing Filament Guide</Link>
              <Link href="/3d-print-stringing" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">Fix Stringing</Link>
              <Link href="/pla-vs-petg" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">PLA vs PETG</Link>
              <Link href="/abs-vs-petg" style={linkStyle} className="text-sm font-semibold underline hover:no-underline">ABS vs PETG</Link>
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section aria-label="Free settings sheet" className="py-20 px-6" style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto">
            <Eyebrow>FREE SETTINGS SHEET</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Keep the drying numbers by the machine.</h2>
            <p style={{ ...bodyStyle, maxWidth: '52ch' }} className="mb-8">
              Every material on this page is on our one-page settings sheet, including the drying temperature and time each one needs. Print it, keep it by the machine, and note the date you opened each spool on it. A logging app is in development and we will say so here when it ships.
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
      </main>
      <SiteFooter />
    </>
  );
}
