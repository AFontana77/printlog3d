import Link from 'next/link';
import Image from 'next/image';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { STAGES, WORKSHOP, resourcesForStage } from '@/lib/workshop';
import type { Metadata } from 'next';

/**
 * Workshop hub — the second gateway.
 *
 * The material index stays the front door; this is everything that happens
 * around the print. The stage order is a real sequence a part goes through, not
 * a taxonomy invented to hold pages, and a stage with no resource yet is shown
 * rather than hidden so the gap is visible instead of pretended away.
 */

const BASE = 'https://www.printlog3d.com';

export const metadata: Metadata = {
  title: 'The 3D printing workshop',
  description:
    'What you need before, during and after the print: measuring parts, removing supports, sanding, heat-set inserts, filament storage and nozzle maintenance.',
  alternates: { canonical: `${BASE}/workshop` },
};

export default function WorkshopHubPage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Workshop guides',
    itemListElement: WORKSHOP.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.heading,
      url: `${BASE}/workshop/${r.slug}`,
    })),
  };

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <main id="main-content" className="pt-20">
        <section className="pt-14 pb-12 px-6 relative overflow-hidden" style={{ background: 'var(--surface-1)' }}>
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] brand-hatch pointer-events-none" />
          <div className="max-w-5xl mx-auto relative">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5 max-w-3xl text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.04, letterSpacing: '-0.02em' }}
            >
              The print is only{' '}
              <span style={{ color: 'var(--brand-primary)' }}>half the job.</span>
            </h1>
            <p className="text-lg max-w-[62ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
              Getting the part off the plate is where the settings guides end and this begins.
              Measuring it, cleaning it up, finishing it, putting real threads in it, and keeping
              the machine and the filament in a state to do it again.
            </p>
          </div>
        </section>

        <section className="py-14 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <ol className="space-y-3">
              {STAGES.map((stage, i) => {
                const items = resourcesForStage(stage.id);
                return (
                  <li
                    key={stage.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-5 rounded-xl border"
                    style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
                  >
                    <div className="flex items-center gap-4 sm:w-64 flex-shrink-0">
                      <span
                        aria-hidden="true"
                        className="tabular-nums text-sm font-semibold w-6"
                        style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-display)' }}
                      >
                        {i + 1}
                      </span>
                      <Image
                        src={`/brand/icons/${stage.icon}.png`}
                        alt=""
                        aria-hidden="true"
                        width={48}
                        height={48}
                        loading={i < 2 ? 'eager' : 'lazy'}
                        className="h-12 w-12 flex-shrink-0"
                      />
                      <span>
                        <span
                          className="block font-semibold"
                          style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
                        >
                          {stage.label}
                        </span>
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>{stage.verb}</p>
                      {items.length ? (
                        <ul className="flex flex-wrap gap-x-5 gap-y-1">
                          {items.map((r) => (
                            <li key={r.slug}>
                              <Link
                                href={`/workshop/${r.slug}`}
                                className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4"
                              >
                                {r.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Nothing written yet.
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="py-14 px-6 border-t" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
            >
              Still choosing a material?
            </h2>
            <p className="leading-relaxed mb-5 max-w-[62ch]" style={{ color: 'var(--body-text)' }}>
              The workshop assumes the print already happened. If you are still deciding what to
              run, the material index has the settings, and each material page links back to the
              workshop steps that matter for it.
            </p>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-dark underline underline-offset-4 min-h-[44px]"
            >
              All materials &rarr;
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
