import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { EmailCaptureForm } from '@/components/EmailCaptureForm';
import { MATERIAL_PROFILES } from '@/lib/materials';
import { FIELD_GUIDE_COUNT } from '@/lib/fieldGuide';
import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * The settings sheet.
 *
 * This page previously promised a PDF that did not exist. The button said
 * "Send Me the Free PDF", the copy said "Enter your email. We send the PDF."
 * and /api/subscribe only ever stored the address and emailed a notification
 * to the site owner. No file was ever built and none was ever sent, while the
 * meta description simultaneously claimed "no signup required".
 *
 * Both halves are fixed here. The PDF is real and downloads directly with no
 * email required, which is what the page always claimed.
 *
 * The file is now the owner-supplied Filament Settings Field Guide, installed
 * byte-for-byte. It replaced a version generated from MATERIAL_PROFILES by
 * scripts/build_cheatsheet.py; that generator is retained but SUPERSEDED, and
 * must not be run against this path or it will overwrite the owner's file. The
 * previous URL redirects here rather than 404ing.
 */

const PDF = '/PrintLog3D-Filament-Settings-Field-Guide.pdf';
const BASE = 'https://www.printlog3d.com';

export const metadata: Metadata = {
  title: 'Free filament settings cheat sheet (PDF)',
  description: `A printable reference with nozzle and bed temperatures, enclosure and drying requirements for ${FIELD_GUIDE_COUNT} filament materials. Direct download, no signup required.`,
  alternates: { canonical: `${BASE}/free-download` },
};

const CONTENTS = [
  `The ${FIELD_GUIDE_COUNT} materials you are most likely to load, on one table, from PLA to PEEK`,
  'Nozzle and bed temperature ranges',
  'Enclosure needed: yes or no, per material',
  'Part cooling and the drying temperature each material wants',
  'A second page listing the fault each material actually fails with',
];

export default function FreeDownloadPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        <section className="pt-20 pb-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--brand-primary)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-8 flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '24px',
                  height: '1px',
                  background: 'var(--brand-primary)',
                  flexShrink: 0,
                }}
              />
              FREE DOWNLOAD &middot; PDF REFERENCE SHEET
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--foreground)',
                lineHeight: 1.05,
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Free 3D print{' '}
              <span style={{ color: 'var(--brand-primary)' }}>settings cheat sheet.</span>
            </h1>
            <p
              style={{
                color: 'var(--body-text)',
                fontFamily: 'var(--font-body)',
                maxWidth: '52ch',
                lineHeight: 1.6,
              }}
              className="text-base mb-8"
            >
              Two pages. Nozzle and bed temperatures, enclosure and drying needs for{' '}
              {FIELD_GUIDE_COUNT} materials, plus the fault each one actually fails with. Print it and
              hang it next to your machine.
            </p>

            <a
              href={PDF}
              download
              style={{
                background: 'var(--brand-primary)',
                color: 'var(--on-primary)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
                borderRadius: '0.25rem',
                textTransform: 'uppercase',
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold min-h-[48px] transition-colors press-feedback"
            >
              Download the PDF &darr;
            </a>
            <p
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
              className="text-xs mt-3"
            >
              Direct download. No email needed.
            </p>
          </div>
        </section>

        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--foreground)',
                  lineHeight: 1.15,
                }}
                className="text-2xl font-bold mb-5"
              >
                What is on it
              </h2>
              <ul className="space-y-3">
                {CONTENTS.map((c) => (
                  <li
                    key={c}
                    style={{ color: 'var(--body-text)', fontFamily: 'var(--font-body)' }}
                    className="text-sm leading-relaxed flex gap-3"
                  >
                    <span aria-hidden="true" style={{ color: 'var(--brand-primary)' }}>
                      &bull;
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
              <p
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
                className="text-xs mt-6 leading-relaxed"
              >
                Every figure is a typical manufacturer-published range for that material class. They are not
                measurements we took. Where your filament maker publishes different numbers, use theirs.
              </p>
            </div>

            <div>
              <div
                style={{
                  background: 'var(--surface-0)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.25rem',
                  padding: '2rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--muted-foreground)',
                    letterSpacing: '0.1em',
                    fontSize: '0.65rem',
                  }}
                  className="uppercase font-semibold mb-3"
                >
                  Optional
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--foreground)',
                    lineHeight: 1.15,
                  }}
                  className="text-xl font-bold mb-3"
                >
                  Hear when we add a material
                </h2>
                <p
                  style={{ color: 'var(--body-text)', fontFamily: 'var(--font-body)' }}
                  className="text-sm mb-6"
                >
                  You already have the sheet. This is just the list we use when a new material guide goes up
                  or the sheet gets revised.
                </p>
                <EmailCaptureForm buttonLabel="Join the list" />
                <p
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
                  className="text-xs mt-4"
                >
                  Unsubscribe any time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-20 px-6"
          style={{
            background: 'var(--surface-2)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--brand-primary)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-4 flex items-center gap-3"
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '24px',
                  height: '1px',
                  background: 'var(--brand-primary)',
                  flexShrink: 0,
                }}
              />
              GO DEEPER
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--foreground)',
                lineHeight: 1.05,
              }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              The sheet is the short version
            </h2>
            <p
              style={{
                color: 'var(--body-text)',
                fontFamily: 'var(--font-body)',
                maxWidth: '52ch',
              }}
              className="text-base mb-8"
            >
              Each material has a full page here covering what it is good for, what to avoid it for, how to
              dry it, and the fault people hit most often.
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
                  textTransform: 'uppercase',
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold min-h-[48px] transition-colors press-feedback"
              >
                All {MATERIAL_PROFILES.length} material profiles &rarr;
              </Link>
              <Link
                href="/how-to-dry-filament"
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
                How to dry filament
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
