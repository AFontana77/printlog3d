import Link from 'next/link';
import Image from 'next/image';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MATERIAL_PROFILES, iconFor } from '@/lib/materials';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import type { Metadata } from 'next';

/**
 * Homepage.
 *
 * The lookup IS the product, so the material index is the page rather than a
 * section below a pitch. An earlier draft carried two card grids of the same
 * shape — a task router and a material grid — which is the lazy container twice
 * over; they are collapsed into one index plus a typographic guides band.
 *
 * Every number and material name derives from MATERIAL_PROFILES. A previous
 * version hardcoded a spec preview that disagreed with the pages it linked to,
 * and advertised TPU before this site documented it.
 */

const BASE = 'https://www.printlog3d.com';

export const metadata: Metadata = {
  title: 'Filament settings for every material',
  description: `Nozzle and bed temperatures, enclosure and drying requirements, and the fault each material actually fails with. ${MATERIAL_PROFILES.length} materials, one page each, from PLA to PEEK.`,
  alternates: { canonical: BASE },
};


const LEVELS = [
  { level: 'Beginner', blurb: 'Prints on a stock machine, no extra hardware.' },
  { level: 'Intermediate', blurb: 'Needs one thing you may not own: an enclosure, a dryer, or a hardened nozzle.' },
  { level: 'Advanced', blurb: 'Enclosure, dry box, and a hot end comfortable well past 250°C.' },
  { level: 'Expert', blurb: 'Beyond what most desktop printers can physically do.' },
] as const;

const GUIDES = [
  { icon: 'drying', label: 'How to dry filament', href: '/how-to-dry-filament', line: 'Which materials need it, at what temperature, for how long.' },
  { icon: 'stringing', label: 'How to stop stringing', href: '/3d-print-stringing', line: 'Retraction, temperature, and the moisture cause most people miss.' },
  { icon: 'material-profiles', label: 'The full filament guide', href: '/3d-printing-filament-guide', line: 'How the material families differ and when each one earns its place.' },
  { icon: 'compare', label: 'PLA vs PETG', href: '/pla-vs-petg', line: 'The comparison people actually search for, answered with the trade-offs.' },
];

export default function HomePage() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PrintLog3D',
    url: BASE,
    publisher: { '@type': 'Organization', name: 'Anvil Road LLC' },
  };

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />

      <main id="main-content" className="pt-20">
        <section className="pt-16 pb-12 px-6 relative overflow-hidden" style={{ background: 'var(--surface-1)' }}>
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] brand-hatch pointer-events-none" />
          <div className="max-w-5xl mx-auto relative">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.04, letterSpacing: '-0.02em' }}
            >
              Dial in the right settings for{' '}
              <span style={{ color: 'var(--brand-primary)' }}>every filament.</span>
            </h1>

            <p className="text-lg mb-8 max-w-[62ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
              Nozzle and bed temperature, whether it needs an enclosure, whether it needs drying,
              and the fault it actually fails with. {MATERIAL_PROFILES.length} materials, one page
              each, written to be used at the machine rather than read once.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#materials"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold uppercase tracking-wider min-h-[48px] rounded transition-colors press-feedback"
                style={{ background: 'var(--brand-primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)' }}
              >
                Find your material
              </Link>
              <Link
                href="/free-download"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold uppercase tracking-wider min-h-[48px] rounded border transition-colors hover:bg-brand-tint"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
              >
                Free field guide
              </Link>
            </div>
          </div>
        </section>

        {/* The index is the page. */}
        <section id="materials" className="py-14 px-6" style={{ background: 'var(--surface-0)' }} aria-label="Material index">
          <div className="max-w-5xl mx-auto">
            {LEVELS.map(({ level, blurb }, li) => {
              const group = MATERIAL_PROFILES.filter((m) => m.difficulty === level);
              if (!group.length) return null;
              return (
                <div key={level} className={li === 0 ? 'mb-12' : 'mb-12 pt-12 border-t'} style={li === 0 ? undefined : { borderColor: 'var(--border)' }}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                    <h2
                      className="text-2xl sm:text-3xl font-bold"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
                    >
                      {level}
                    </h2>
                    <span className="text-sm tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                      {group.length} materials
                    </span>
                  </div>
                  <p className="text-sm mb-7 max-w-[62ch]" style={{ color: 'var(--muted-foreground)' }}>{blurb}</p>

                  <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
                    {group.map((m) => (
                      <li key={m.slug}>
                        <Link
                          href={`/library/${m.slug}`}
                          className="group flex items-center gap-4 py-3 -mx-3 px-3 rounded-lg transition-colors hover:bg-brand-tint"
                        >
                          <Image
                            src={`/brand/icons/${iconFor(m)}.png`}
                            alt=""
                            aria-hidden="true"
                            width={56}
                            height={56}
                            loading={li === 0 ? 'eager' : 'lazy'}
                            className="h-14 w-14 flex-shrink-0"
                          />
                          <span className="min-w-0">
                            <span
                              className="block font-semibold truncate transition-colors group-hover:text-brand"
                              style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
                            >
                              {m.category}
                            </span>
                            <span className="block text-xs tabular-nums mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                              {m.printTempC}&deg;C nozzle &middot; {m.bedTempC}&deg;C bed
                            </span>
                            <span className="block text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                              {m.enclosure === 'Required' ? 'Enclosure' : 'No enclosure'}
                              {m.needsDrying ? ' · dry first' : ''}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <p className="text-sm max-w-[62ch]" style={{ color: 'var(--muted-foreground)' }}>
              Every figure is a typical manufacturer-published range for that material class, not a
              measurement we took.{' '}
              <Link href="/library" className="text-brand hover:text-brand-dark underline underline-offset-4">
                Compare all {MATERIAL_PROFILES.length} side by side
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="py-14 px-6 border-t" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
            >
              When something goes wrong
            </h2>
            <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {GUIDES.map((g) => (
                <li key={g.href}>
                  <Link href={g.href} className="group flex items-center gap-5 py-5 transition-colors">
                    <Image
                      src={`/brand/icons/${g.icon}.png`}
                      alt=""
                      aria-hidden="true"
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 flex-shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className="block font-semibold transition-colors group-hover:text-brand"
                        style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
                      >
                        {g.label}
                      </span>
                      <span className="block text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                        {g.line}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-brand flex-shrink-0" style={{ fontSize: '1.25rem' }}>&rarr;</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 px-6 border-t" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <Image
              src="/brand/badges/free-settings-sheet.png"
              alt=""
              aria-hidden="true"
              width={128}
              height={128}
              loading="lazy"
              className="h-28 w-28 flex-shrink-0"
            />
            <div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
              >
                The Filament Settings Field Guide
              </h2>
              <p className="leading-relaxed mb-6 max-w-[62ch]" style={{ color: 'var(--body-text)' }}>
                Every material on one printable reference: nozzle and bed temperature, enclosure,
                drying, and what each one fails with. Keep it by the machine. Free, and no email
                required.
              </p>
              <Link
                href="/free-download"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold uppercase tracking-wider min-h-[48px] rounded transition-colors press-feedback"
                style={{ background: 'var(--brand-accent)', color: 'var(--on-accent)', fontFamily: 'var(--font-display)' }}
              >
                Get the field guide
              </Link>
            </div>
          </div>
        </section>

        <OwnedServiceCta variant="guide-thanks" />
      </main>
      <SiteFooter />
    </>
  );
}
