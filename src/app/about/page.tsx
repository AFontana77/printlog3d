import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import { MATERIAL_PROFILES } from '@/lib/materials';
import { OWNED_SERVICE } from '@/lib/ownedService';
import type { Metadata } from 'next';
import { ogFor } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  openGraph: ogFor('/about'),
  title: 'About',
  description: `PrintLog3D is a free filament settings reference. ${MATERIAL_PROFILES.length} materials, one page each, built from ranges the filament makers publish. Who runs it and how it earns.`,
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'var(--brand-primary)',
  letterSpacing: '0.15em',
  fontSize: '0.7rem',
};
const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
  lineHeight: 1.1,
};
const bodyStyle: React.CSSProperties = {
  color: 'var(--body-text)',
  fontFamily: 'var(--font-body)',
  maxWidth: '60ch',
  lineHeight: 1.65,
};
const linkStyle: React.CSSProperties = { color: 'var(--brand-primary)' };

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={eyebrowStyle} className="uppercase font-semibold mb-6 flex items-center gap-3">
    <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--brand-primary)', flexShrink: 0 }} />
    {children}
  </div>
);

/** What a reader can actually do here today. Every entry is a live route. */
const ON_THE_SITE = [
  { href: '/library', label: 'The material library', line: `${MATERIAL_PROFILES.length} filament materials, one page each.` },
  { href: '/3d-printing-filament-guide', label: 'The filament guide', line: 'How the main material families differ.' },
  { href: '/3d-printer-troubleshooting', label: 'Troubleshooting', line: 'Start from what the print is doing wrong.' },
  { href: '/workshop', label: 'The workshop', line: 'Measuring, sanding, gluing and other jobs around the print.' },
  { href: '/3d-printing-cost-calculator', label: 'The cost calculator', line: 'What one print costs, using your own numbers.' },
  { href: '/recommended-gear', label: 'Recommended gear', line: 'Tools that fix a named problem, with the reason for each.' },
  { href: '/free-download', label: 'The free field guide', line: 'Every material on a printable PDF.' },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        {/* Hero */}
        <section className="pt-20 pb-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <div style={eyebrowStyle} className="uppercase font-semibold mb-8 flex items-center gap-3">
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--brand-primary)', flexShrink: 0 }} />
              ABOUT · ANVIL ROAD LLC
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--foreground)',
                lineHeight: 1.05,
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              A plain reference for <span style={{ color: 'var(--brand-primary)' }}>filament settings.</span>
            </h1>
            <p style={bodyStyle} className="text-base mb-6">
              PrintLog3D is a free reference site for 3D printing filament. It covers{' '}
              {MATERIAL_PROFILES.length} materials, one page each. Each page gives the nozzle and bed
              temperature, says if you need an enclosure, tells you how to dry the spool, and names the
              fault that material most often hits.
            </p>
            <p style={bodyStyle} className="text-base mb-8">
              It is a website and a printable guide. There is no app and no account. You can read
              every page and download the guide for free.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/library"
                style={{
                  background: 'var(--brand-primary)',
                  color: 'var(--on-primary)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  borderRadius: '0.25rem',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold uppercase min-h-[48px] transition-colors press-feedback"
              >
                Browse the Materials &rarr;
              </Link>
              <Link
                href="/free-download"
                style={{
                  border: '1px solid var(--border)',
                  color: 'var(--brand-primary)',
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

        {/* Sources */}
        <section className="py-16 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>WHERE THE NUMBERS COME FROM</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">
              Published ranges, not our own results
            </h2>
            <p style={bodyStyle} className="text-base mb-4">
              The temperatures, drying times and price bands on this site are typical ranges that
              filament makers publish. They are not measurements we took. We have not done our
              own testing, and each material page says so.
            </p>
            <p style={bodyStyle} className="text-base">
              Use a range as a safe place to start. Your spool and your printer have the last word.
              The{' '}
              <Link href="/editorial-policy" style={linkStyle} className="underline underline-offset-4">
                editorial policy
              </Link>{' '}
              names the makers we draw from and explains how to send a correction.
            </p>
          </div>
        </section>

        {/* What is here */}
        <section className="py-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>WHAT IS ON THE SITE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-8">
              Seven places to start
            </h2>
            <ul style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {ON_THE_SITE.map((item, i) => (
                <li
                  key={item.href}
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <Link
                    href={item.href}
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }}
                    className="text-sm font-semibold underline underline-offset-4"
                  >
                    {item.label}
                  </Link>
                  <p style={{ color: 'var(--body-text)', fontFamily: 'var(--font-body)' }} className="text-sm mt-1">
                    {item.line}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Money */}
        <section className="py-16 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>HOW THE SITE EARNS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">
              Amazon links, and one service we own
            </h2>
            <p style={bodyStyle} className="text-base mb-4">
              Some links on this site go to Amazon. As an Amazon Associate we earn from qualifying
              purchases. That costs you nothing extra.
            </p>
            <p style={bodyStyle} className="text-base">
              We also own {OWNED_SERVICE.name}, a print service. We say so each time we link to it.
              The{' '}
              <Link href="/disclosure" style={linkStyle} className="underline underline-offset-4">
                disclosure page
              </Link>{' '}
              says which links are paid and which are not.
            </p>
          </div>
        </section>

        {/* Anvil Road */}
        <section className="py-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>PUBLISHER</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-4">
              Run by Anvil Road LLC
            </h2>
            <p style={bodyStyle} className="text-base">
              PrintLog3D is published by Anvil Road LLC, a small independent publisher based in New
              Jersey. If a number here looks wrong, or you have a question, write to us through the{' '}
              <Link href="/support" style={linkStyle} className="underline underline-offset-4">
                support page
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
