import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PrintLog3D',
  description: 'The story behind PrintLog3D. Search 1,260 filaments with tested print settings. Log your prints. Dial in your profiles.',
};

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="pt-20 pb-16 px-6" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-5xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.43 0.22 295)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-8 flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
              ABOUT · ANVIL ROAD LLC
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Built for printers who log <span style={{ color: 'oklch(0.43 0.22 295)' }}>everything.</span>
            </h1>
            <p
              style={{
                color: 'oklch(0.35 0.018 295)',
                fontFamily: 'var(--font-body)',
                maxWidth: '60ch',
                lineHeight: 1.65,
              }}
              className="text-base mb-6"
            >
              PrintLog3D was built for 3D printing enthusiasts who have wasted spools learning the hard way. Every printer is different. Every brand of PLA prints differently. The settings that work for Hatchbox PLA on a Bambu P1S are not the same as eSUN PLA on an Ender 3. PrintLog3D pairs a curated filament database with a personal print log so you search before you slice and record what worked before you forget. The app for iPhone and Android adds a slicer profile assistant and print time tracker. Stop printing from memory. Start printing from data.
            </p>
            <p
              style={{
                color: 'oklch(0.35 0.018 295)',
                fontFamily: 'var(--font-body)',
                maxWidth: '60ch',
                lineHeight: 1.65,
              }}
              className="text-base mb-8"
            >
              PrintLog3D is published by Anvil Road LLC, a small product studio building practical apps and reference tools for hobbyists, professionals, and makers. Every product in the portfolio follows the same principle: a curated, searchable database paired with a personal log. Search what the experts know. Record what you discover.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/library"
                style={{
                  background: 'oklch(0.43 0.22 295)',
                  color: 'oklch(0.99 0 0)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  borderRadius: '0.25rem',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase min-h-[48px] transition-colors press-feedback"
              >
                Browse the Library &rarr;
              </Link>
              <Link
                href="/free-download"
                style={{
                  border: '1px solid oklch(0.84 0.015 295)',
                  color: 'oklch(0.43 0.22 295)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  borderRadius: '0.25rem',
                  background: 'transparent',
                  textTransform: 'uppercase',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold min-h-[48px] transition-colors"
              >
                Free Download
              </Link>
            </div>
          </div>
        </section>

        {/* Anvil Road */}
        <section className="py-16 px-6" style={{ background: 'oklch(0.99 0.004 295)' }}>
          <div className="max-w-5xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.43 0.22 295)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-6 flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
              PUBLISHER
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.1,
              }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Built by Anvil Road LLC
            </h2>
            <p
              style={{
                color: 'oklch(0.35 0.018 295)',
                fontFamily: 'var(--font-body)',
                maxWidth: '60ch',
                lineHeight: 1.65,
              }}
              className="text-base"
            >
              Anvil Road is an independent publisher and app studio based in New Jersey. We build reference databases, log apps, KDP books, and companion print products across a range of hobby and professional categories. PrintLog3D is one of 20+ apps in the Anvil Road portfolio. All apps are free to start, with one-time unlocks for unlimited features. No subscriptions.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
