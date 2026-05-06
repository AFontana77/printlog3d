import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { EmailCaptureForm } from '@/components/EmailCaptureForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free 3D Print Settings Cheat Sheet',
  description: 'One-page quick reference — temperature ranges, bed adhesion tips, and speed settings for 8 common materials. Free printable from PrintLog3D — no signup required.',
};

const CONTENTS = [
  'PLA, PETG, TPU, ABS, ASA, Nylon, PC, and CF blend settings',
  'Print temp and bed temp ranges',
  'Cooling fan recommendations',
  'Enclosure required: yes/no per material',
  'Printable — hang it next to your printer',
];

export default function FreeDownloadPage() {
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
              FREE DOWNLOAD · PDF REFERENCE SHEET
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
              }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              Free 3D print <span style={{ color: 'oklch(0.43 0.22 295)' }}>settings cheat sheet.</span>
            </h1>
            <p
              style={{
                color: 'oklch(0.35 0.018 295)',
                fontFamily: 'var(--font-body)',
                maxWidth: '52ch',
                lineHeight: 1.6,
              }}
              className="text-base mb-12"
            >
              One-page quick reference — temperature ranges, bed adhesion tips, and speed settings for 8 common materials. Print it. Hang it next to your machine. Stop second-guessing.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Contents panel */}
              <div
                style={{
                  background: 'oklch(0.99 0.004 295)',
                  border: '1px solid oklch(0.84 0.015 295)',
                  borderRadius: '0.25rem',
                  overflow: 'hidden',
                }}
              >
                <div style={{ background: 'oklch(0.92 0.012 295)', padding: '0.625rem 1.25rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.48 0.015 295)',
                      letterSpacing: '0.1em',
                      fontSize: '0.65rem',
                    }}
                    className="uppercase font-semibold"
                  >
                    What is inside
                  </span>
                </div>
                {CONTENTS.map((item, i) => (
                  <div
                    key={item}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderTop: '1px solid oklch(0.84 0.015 295)',
                      background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'oklch(0.43 0.22 295)',
                        minWidth: '24px',
                        fontSize: '0.75rem',
                        marginTop: '2px',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p
                      style={{ color: 'oklch(0.35 0.018 295)', fontFamily: 'var(--font-body)' }}
                      className="text-sm leading-relaxed"
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Capture panel */}
              <div
                style={{
                  background: 'oklch(0.99 0.004 295)',
                  border: '1px solid oklch(0.84 0.015 295)',
                  borderRadius: '0.25rem',
                  padding: '2rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.48 0.015 295)',
                    letterSpacing: '0.1em',
                    fontSize: '0.65rem',
                  }}
                  className="uppercase font-semibold mb-3"
                >
                  Get your free copy
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'oklch(0.15 0.02 295)',
                    lineHeight: 1.15,
                  }}
                  className="text-xl font-bold mb-3"
                >
                  Enter your email. We send the PDF.
                </h2>
                <p
                  style={{ color: 'oklch(0.35 0.018 295)', fontFamily: 'var(--font-body)' }}
                  className="text-sm mb-6"
                >
                  Straight to your inbox. No spam.
                </p>
                <EmailCaptureForm buttonLabel="Send Me the Free PDF" />
                <p
                  style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }}
                  className="text-xs mt-4"
                >
                  Unsubscribe any time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* App CTA */}
        <section
          className="py-20 px-6"
          style={{
            background: 'oklch(0.92 0.012 295)',
            borderTop: '1px solid oklch(0.84 0.015 295)',
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.43 0.22 295)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-4 flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'oklch(0.43 0.22 295)', flexShrink: 0 }} />
              FULL DATABASE
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
              }}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Want the searchable database?
            </h2>
            <p
              style={{
                color: 'oklch(0.35 0.018 295)',
                fontFamily: 'var(--font-body)',
                maxWidth: '52ch',
              }}
              className="text-base mb-8"
            >
              The free PDF covers the basics. The PrintLog3D app gives you the full searchable library plus your personal log — free on iPhone and Android.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
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
                Get on App Store &rarr;
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
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
                Get on Google Play
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
