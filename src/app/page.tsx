import Link from 'next/link';
import Image from 'next/image';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MATERIAL_PROFILES } from '@/lib/materials';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import type { Metadata } from 'next';

/**
 * Homepage: authority gateway.
 *
 * Every number and every material name derives from MATERIAL_PROFILES. The
 * previous version hardcoded a spec preview that disagreed with the pages it
 * linked to, and advertised TPU, which this site does not document.
 *
 * The app is described as in development because it is: the iTunes lookup for
 * com.anvilroad.printlog3d returns resultCount 0.
 */

const BASE = 'https://www.printlog3d.com';

export const metadata: Metadata = {
  title: 'Filament settings for every material',
  description:
    'Nozzle and bed temperatures, enclosure and drying requirements, and the fault each material actually fails with. Seventeen materials, one page each, from PLA to PEEK.',
  alternates: { canonical: BASE },
};

/** Icon file per material, from the brand package. Falls back to the family icon. */
const ICON: Record<string, string> = {
  PLA: 'pla', 'PLA Matte': 'pla', 'PLA Silk': 'pla', 'PLA Wood': 'pla', 'PLA Metal': 'pla',
  PETG: 'petg', 'PETG-CF': 'composite-filaments', PCTG: 'petg', CPE: 'petg',
  ABS: 'abs', ASA: 'asa', HIPS: 'abs',
  'Nylon PA6': 'nylon', 'Nylon PA12': 'nylon', 'PA-CF': 'composite-filaments',
  PC: 'polycarbonate', PEEK: 'peek',
};

const TASKS = [
  { icon: 'material-profiles', label: 'Choose a filament', href: '/library', hint: 'Compare all 17 by temperature, enclosure and difficulty.' },
  { icon: 'stringing', label: 'Fix stringing', href: '/3d-print-stringing', hint: 'Retraction, temperature, and the moisture cause people miss.' },
  { icon: 'drying', label: 'Dry filament', href: '/how-to-dry-filament', hint: 'Which materials need it, at what temperature, for how long.' },
  { icon: 'compare', label: 'Compare materials', href: '/pla-vs-petg', hint: 'PLA against PETG and ABS, with the trade-offs stated.' },
  { icon: 'peek', label: 'Print an advanced material', href: '/library/peek', hint: 'What PEEK, polycarbonate and carbon-fibre nylon really need.' },
  { icon: 'printable-sheet', label: 'Get the field guide', href: '/free-download', hint: 'Every setting on a printable sheet. Free, no signup.' },
];

const LEVELS = [
  { level: 'Beginner', blurb: 'Prints on a stock machine.' },
  { level: 'Intermediate', blurb: 'Needs an enclosure or a dryer.' },
  { level: 'Advanced', blurb: 'Enclosure, dry box, and a hot end past 250C.' },
  { level: 'Expert', blurb: 'Beyond most desktop printers.' },
] as const;

export default function HomePage() {
  const needsDrying = MATERIAL_PROFILES.filter((m) => m.needsDrying).length;
  const needsEnclosure = MATERIAL_PROFILES.filter((m) => m.enclosure === 'Required').length;

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
        {/* Hero */}
        <section className="pt-16 pb-14 px-6 relative overflow-hidden" style={{ background: 'var(--surface-1)' }}>
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06] brand-hatch pointer-events-none"
          />
          <div className="max-w-5xl mx-auto relative">
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden="true" className="accent-rule" style={{ display: 'inline-block', width: 28, height: 2 }} />
              <span
                className="uppercase font-semibold tracking-[0.15em] text-[0.7rem]"
                style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}
              >
                {MATERIAL_PROFILES.length} materials &middot; one settings reference
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }}
            >
              Dial in the right settings for{' '}
              <span style={{ color: 'var(--brand-primary)' }}>every filament.</span>
            </h1>

            <p
              className="text-lg mb-9 max-w-2xl leading-relaxed"
              style={{ color: 'var(--body-text)' }}
            >
              Nozzle and bed temperature, whether it needs an enclosure, whether it needs drying,
              and the fault it actually fails with. One page per material, written to be used at
              the machine rather than read once.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/library"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold uppercase tracking-wider min-h-[48px] rounded transition-colors press-feedback"
                style={{ background: 'var(--brand-primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)' }}
              >
                Find filament settings
              </Link>
              <Link
                href="/free-download"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold uppercase tracking-wider min-h-[48px] rounded border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
              >
                Download the field guide
              </Link>
            </div>

            <p className="mt-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Typical manufacturer-published ranges for each material class. Not measurements we took.
            </p>
          </div>
        </section>

        {/* At a glance */}
        <section className="py-10 px-6 border-y" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { n: String(MATERIAL_PROFILES.length), l: 'materials documented' },
              { n: String(needsDrying), l: 'that need drying first' },
              { n: String(needsEnclosure), l: 'that need an enclosure' },
              { n: '6', l: 'in-depth guides' },
            ].map((s) => (
              <div key={s.l}>
                <div
                  className="text-3xl sm:text-4xl font-bold tabular-nums"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }}
                >
                  {s.n}
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Task router */}
        <section className="py-16 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-3xl font-bold mb-8"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              What are you trying to do?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TASKS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="group flex gap-4 p-5 rounded-xl border transition-all hover:shadow-md"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
                >
                  <Image
                    src={`/brand/icons/${t.icon}.png`}
                    alt=""
                    aria-hidden="true"
                    width={40}
                    height={40}
                    loading="lazy"
                    className="h-10 w-10 flex-shrink-0"
                  />
                  <span>
                    <span className="block font-semibold" style={{ color: 'var(--foreground)' }}>{t.label}</span>
                    <span className="block text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {t.hint}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Material library */}
        <section className="py-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <h2
                className="text-3xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                The material library
              </h2>
              <Link href="/library" className="text-sm font-semibold text-brand hover:text-brand-dark underline underline-offset-4 min-h-[44px] flex items-center">
                All {MATERIAL_PROFILES.length} materials, side by side
              </Link>
            </div>

            {LEVELS.map(({ level, blurb }) => {
              const group = MATERIAL_PROFILES.filter((m) => m.difficulty === level);
              if (!group.length) return null;
              return (
                <div key={level} className="mb-8 last:mb-0">
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}>
                    {level}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>{blurb}</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.map((m) => (
                      <Link
                        key={m.slug}
                        href={`/library/${m.slug}`}
                        className="flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-md"
                        style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
                      >
                        <Image
                          src={`/brand/icons/${ICON[m.category] ?? 'material-profiles'}.png`}
                          alt=""
                          aria-hidden="true"
                          width={32}
                          height={32}
                          loading="lazy"
                          className="h-8 w-8 flex-shrink-0"
                        />
                        <span className="min-w-0">
                          <span className="block font-semibold truncate" style={{ color: 'var(--foreground)' }}>{m.category}</span>
                          <span className="block text-xs tabular-nums mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                            {m.printTempC}&deg;C &middot; bed {m.bedTempC}&deg;C
                            {m.enclosure === 'Required' ? ' · enclosure' : ''}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Field guide */}
        <section className="py-16 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[auto_1fr] gap-8 items-center">
            <Image
              src="/brand/badges/free-settings-sheet.png"
              alt=""
              aria-hidden="true"
              width={112}
              height={112}
              loading="lazy"
              className="h-24 w-24 lg:h-28 lg:w-28"
            />
            <div>
              <h2
                className="text-3xl font-bold mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                The Filament Settings Field Guide
              </h2>
              <p className="leading-relaxed mb-6 max-w-2xl" style={{ color: 'var(--body-text)' }}>
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
