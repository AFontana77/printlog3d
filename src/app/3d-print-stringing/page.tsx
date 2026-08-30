import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { GearAdvice, type GearSpec } from '@/components/GearAdvice';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import Link from 'next/link';
import { MATERIAL_PROFILES } from '@/lib/materials';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Print Stringing: Causes, Fixes & Settings by Material',
  description: 'Fix 3D print stringing with this step-by-step guide: retraction distance by extruder type, temperature reduction, combing, travel speed, and why PETG strings more than PLA (and what to do about it).',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: '3D Print Stringing: Causes, Fixes and Settings by Material',
      description: 'Fix 3D print stringing: retraction distance by extruder type, temperature reduction, combing, travel speed, and material-specific notes for PLA, PETG, TPU, and Nylon.',
      url: 'https://www.printlog3d.com/3d-print-stringing',
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
        { '@type': 'ListItem', position: 2, name: '3D Print Stringing', item: 'https://www.printlog3d.com/3d-print-stringing' },
      ],
    },
  ],
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'var(--brand-primary)',
  letterSpacing: '0.15em',
  fontSize: '0.7rem',
};
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

const FIXES = [
  {
    n: '01',
    title: 'Check retraction distance',
    body: 'Retraction pulls plastic back into the nozzle before a travel move. Too little and plastic leaks. Too much and you risk grinding the filament or pulling molten plastic into the cold zone.',
    table: [
      { extruder: 'Bowden extruder', detail: '(Ender 3, CR-10 style)', value: '4-7mm' },
      { extruder: 'Direct drive', detail: '(Bambu, Prusa MK4, Voron)', value: '0.5-2mm' },
    ],
    note: 'Start at the middle of the range. Adjust by 0.5mm increments and test.',
  },
  {
    n: '02',
    title: 'Lower print temperature by 5°C',
    body: 'Hotter plastic is more fluid. More fluid means more ooze during travel. Drop temp by 5°C and test. Keep going in 5°C steps until stringing improves or print quality starts to suffer (under-extrusion, weak layer bonds).',
    temps: [
      { mat: 'PLA', target: 'Try 195°C', from: '(from 210°C)' },
      { mat: 'PETG', target: 'Try 235°C', from: '(from 245°C)' },
      { mat: 'ABS', target: 'Try 235°C', from: '(from 245°C)' },
      { mat: 'TPU', target: 'Try 225°C', from: '(from 235°C)' },
    ],
  },
  {
    n: '03',
    title: 'Enable combing in your slicer',
    body: 'Combing tells the slicer to route travel moves over already-printed areas instead of open air. Even if some ooze happens, it lands on printed material, not empty space, so no thread forms. In Cura, go to "Travel" settings and set Combing Mode to "Not in Skin" or "All." In PrusaSlicer and Bambu Studio, it is called "Avoid crossing perimeters." This single setting often eliminates most stringing on complex prints without changing any physical parameters.',
  },
  {
    n: '04',
    title: 'Increase travel speed',
    body: 'Faster travel means less time for plastic to ooze. This is separate from print speed. A target of 150-200 mm/s travel speed works well for most printers. Faster printers (Bambu, Voron) can go higher. Slower printers (stock Ender 3) should stay at the lower end to avoid frame vibration causing print artifacts.',
  },
];

const MATERIAL_NOTES = [
  { material: 'PLA', note: "Minimal stringing with standard settings. If PLA is stringing badly, retraction is set wrong or you are printing too hot. PLA is the easiest material to dial in. Stringing should be nearly zero with correct settings." },
  { material: 'PETG', note: 'Strings more than PLA. This is normal. Some thin wisps are acceptable and easy to remove with a heat gun pass. If you have heavy cobwebbing, lower temp first (5°C), then check retraction. Enable combing. PETG stringing should never be as heavy as what you see from Nylon or wet filament.' },
  { material: 'TPU', note: 'Strings heavily due to high flexibility. Reduce retraction to near-zero (0-1mm on direct drive) and print slow (30-35 mm/s). Combing helps a lot. Accept some stringing. TPU is difficult to print completely clean and most stringing snaps off easily once the print is done.' },
  { material: 'Nylon', note: 'Strings badly when wet. Always dry Nylon before printing: 70-80°C for 12+ hours. After drying, tune retraction and use combing. Dry Nylon should string at roughly the same level as PETG.' },
];

/**
 * Two items, both tied to this page's own diagnosis. Wet filament is the most
 * common cause of stringing that survives retraction tuning, so a dryer is the
 * fix and dry storage is what stops it coming back. Nothing else belongs here.
 */
const STRINGING_GEAR: GearSpec[] = [
  {
    category: 'Filament dryer',
    requirement: 'Must reach 65C for PETG, 80C if you print nylon',
    why: 'If stringing survives correct retraction and a lower nozzle temperature, the filament is wet. Drying it is the fix, and no slicer setting substitutes for it. Budget units stopping at 55C will not dry PETG properly.',
    searchTerms: 'filament dryer 65C',
  },
  {
    category: 'Airtight storage with desiccant',
    requirement: 'Sealed container plus rechargeable silica gel',
    why: 'PETG re-absorbs moisture within a couple of weeks on an open shelf, so a spool you dried last month is wet again. Storage is what makes the fix stick.',
    searchTerms: 'airtight filament storage container desiccant',
  },
];

const RELATED = [
  { href: '/how-to-dry-filament', title: 'How to Dry Filament', desc: 'Signs of wet filament and all 3 drying methods.' },
  { href: '/pla-vs-petg', title: 'PLA vs PETG', desc: 'Why PETG strings more and when to use each.' },
  { href: '/abs-vs-petg', title: 'ABS vs PETG', desc: 'Which is better for functional parts?' },
  { href: '/library', title: `All ${MATERIAL_PROFILES.length} Materials`, desc: 'Print settings, enclosure and drying for every material.' },
];

export default function StringingPage() {
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
              <span style={{ color: 'var(--muted-foreground)' }}>3D Print Stringing</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              3D print stringing: <span style={{ color: 'var(--brand-primary)' }}>causes and fixes.</span>
            </h1>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="text-base">
              Stringing means the settings are off. Not slightly off. Wrong in a specific, fixable way. Five adjustments cover 90% of stringing problems. Work through them in order and the threads disappear.
            </p>
          </div>
        </section>

        {/* What stringing is */}
        <section aria-label="What causes stringing" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>ROOT CAUSE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Why your print strings (the real reasons).</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-4">
              When the nozzle moves between two printed areas without extruding, molten plastic can leak out and leave a thin thread. The technical term for that movement is a travel move. Stringing happens when plastic is still fluid enough to ooze during travel.
            </p>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }}>
              Some materials stay fluid longer at a given temperature than others. PETG and TPU are more prone to stringing than PLA. This is normal, not a sign something is broken. The fix is the same across materials: pull plastic back before travel (retraction), reduce temp to make it less fluid, and move fast so there is less time to ooze.
            </p>
          </div>
        </section>

        {/* Fix checklist */}
        <section aria-label="Stringing fix checklist in order of impact" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>FIX SEQUENCE · IN ORDER</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">The five-step fix that stops 90% of stringing.</h2>

            <div className="space-y-4">
              {FIXES.map((fix) => (
                <div
                  key={fix.n}
                  style={{
                    background: 'var(--surface-0)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.25rem',
                    padding: '1.5rem 1.5rem',
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr',
                    gap: '1.5rem',
                    alignItems: 'start',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--brand-primary)',
                      fontSize: '2rem',
                      lineHeight: 1,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                    className="font-bold"
                  >
                    {fix.n}
                  </span>
                  <div>
                    <h3 style={h3Style} className="text-lg font-bold mb-3">{fix.title}</h3>
                    <p style={{ ...bodyStyle }} className="text-sm mb-4">{fix.body}</p>
                    {fix.table && (
                      <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden', fontVariantNumeric: 'tabular-nums' }}>
                        {fix.table.map((row, i) => (
                          <div
                            key={row.extruder}
                            style={{
                              padding: '0.75rem 1rem',
                              borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                              display: 'grid',
                              gridTemplateColumns: '1fr 100px',
                              gap: '0.75rem',
                              alignItems: 'center',
                              background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                            }}
                          >
                            <div>
                              <p style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{row.extruder}</p>
                              <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }} className="text-xs">{row.detail}</p>
                            </div>
                            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }} className="text-base font-bold text-right">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {fix.temps && (
                      <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden', fontVariantNumeric: 'tabular-nums' }}>
                        {fix.temps.map((t, i) => (
                          <div
                            key={t.mat}
                            style={{
                              padding: '0.625rem 1rem',
                              borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                              display: 'grid',
                              gridTemplateColumns: '80px 100px 1fr',
                              gap: '0.75rem',
                              alignItems: 'center',
                              background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                            }}
                          >
                            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{t.mat}</span>
                            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }} className="text-sm font-bold">{t.target}</span>
                            <span style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }} className="text-xs">{t.from}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {fix.note && (
                      <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }} className="text-xs mt-3">{fix.note}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Fix 5 */}
              <div
                style={{
                  background: 'var(--surface-0)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.25rem',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr',
                  gap: '1.5rem',
                  alignItems: 'start',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', fontSize: '2rem', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }} className="font-bold">05</span>
                <div>
                  <h3 style={h3Style} className="text-lg font-bold mb-3">Dry the filament</h3>
                  <p style={{ ...bodyStyle }} className="text-sm">
                    Wet filament strings dramatically worse than dry material. If you have tried the four steps above and still have heavy stringing, drying is probably the culprit, especially for PETG, TPU, and Nylon. See our{' '}
                    <Link href="/how-to-dry-filament" style={linkStyle} className="underline hover:no-underline">complete filament drying guide</Link>{' '}
                    for temps, times, and methods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Material-specific notes */}
        <section aria-label="Stringing notes by filament material" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>BY MATERIAL</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Why PETG always strings more than PLA.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ background: 'var(--surface-2)', padding: '0.625rem 1.25rem', display: 'grid', gridTemplateColumns: '140px 1fr' }}>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Material</span>
                <span style={{ fontFamily: 'var(--font-display)', color: 'var(--muted-foreground)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold">Notes</span>
              </div>
              {MATERIAL_NOTES.map((m, i) => (
                <div
                  key={m.material}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid var(--border)',
                    display: 'grid',
                    gridTemplateColumns: '140px 1fr',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }} className="text-sm font-semibold">{m.material}</span>
                  <p style={{ ...bodyStyle }} className="text-sm">{m.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to test */}
        <section aria-label="How to test your stringing fixes" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>TEST PROTOCOL</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">Test your fix in 20 minutes, not two hours.</h2>
            <p style={{ ...bodyStyle, maxWidth: '60ch' }} className="mb-6">
              Print a stringing torture test. The classic spiked sphere or Cthulhu model from Printables or Thingiverse works well. It has many tall spikes and open space between them, exactly the conditions that reveal stringing. One test print takes 15 to 25 minutes and tells you more than 30 minutes of guessing.
            </p>
            <div style={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: '0.25rem', padding: '1.25rem 1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)', letterSpacing: '0.1em', fontSize: '0.65rem' }} className="uppercase font-semibold mb-2">Critical Rule</div>
              <p style={h3Style} className="font-bold mb-2">Change one variable per test.</p>
              <p style={{ ...bodyStyle }} className="text-sm">
                Change ONE setting, print the test, evaluate. Never change two variables at once. If you change temp and retraction at the same time and stringing gets better, you will not know which fix worked, or which one to keep.
              </p>
            </div>
          </div>
        </section>

        {/* Related guides */}
        <GearAdvice
          heading="If it is wet filament"
          intro="Stringing that survives correct retraction and a lower nozzle temperature is usually moisture. Two things fix it and keep it fixed."
          items={STRINGING_GEAR}
        />

        <OwnedServiceCta variant="troubleshooting" />

        <section aria-label="Related guides" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>RELATED</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Fix the next problem.</h2>
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
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">Write down the settings that fixed it.</h2>
            <p style={{ ...bodyStyle, maxWidth: '52ch' }} className="mb-8">
              The retraction distance that fixed your stringing is worth keeping. Our one-page settings sheet has the temperature and retraction starting points for every material we document, with room to write in what actually worked. A logging app is in development and we will say so here when it ships.
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
      </main>
      <SiteFooter />
    </>
  );
}
