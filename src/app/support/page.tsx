import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with the PrintLog3D website. Contact support or browse common questions.',
};

const FAQS = [
  {
    q: 'Is there a PrintLog3D app?',
    a: 'Not yet. The PrintLog3D app is in development. This website is live now with a filament material reference and a free printable settings sheet. We will announce the app here when it ships.',
  },
  {
    q: 'Do I need to pay for anything?',
    a: 'No. The website and the settings sheet are both free. There is no purchase or subscription on printlog3d.com today.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. You can browse the material reference and download the settings sheet without creating an account.',
  },
  {
    q: 'Where does the filament data come from?',
    a: 'From manufacturer datasheets. The figures are typical ranges for each material class, not results from our own testing. Always check your specific spool and your printer before you print.',
  },
  {
    q: 'How do I stop receiving emails?',
    a: 'Every email we send has an unsubscribe link. Click it and we remove you from the list right away.',
  },
  {
    q: 'How do I delete my data?',
    a: 'Email support@printlog3d.com and ask us to remove your email address from our list. We do not store any other personal data on this website.',
  },
];

export default function SupportPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        <section className="py-16 px-4" style={{ background: 'oklch(0.96 0.008 295)' }}>
          <div className="max-w-3xl mx-auto">
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
              SUPPORT · CONTACT
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
                lineHeight: 1.05,
              }}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              Support
            </h1>
            <p
              style={{ color: 'oklch(0.35 0.018 295)', fontFamily: 'var(--font-body)' }}
              className="text-base mb-10"
            >
              Get help with PrintLog3D or give us feedback.
            </p>

            <div
              style={{
                background: 'oklch(0.99 0.004 295)',
                border: '1px solid oklch(0.84 0.015 295)',
                borderRadius: '0.25rem',
                padding: '1.5rem',
                marginBottom: '3rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'oklch(0.48 0.015 295)',
                  letterSpacing: '0.1em',
                  fontSize: '0.65rem',
                }}
                className="uppercase font-semibold mb-2"
              >
                EMAIL SUPPORT
              </div>
              <p
                style={{ color: 'oklch(0.35 0.018 295)', fontFamily: 'var(--font-body)' }}
                className="text-sm mb-3"
              >
                We respond within 1 to 2 business days.
              </p>
              <a
                href="mailto:support@printlog3d.com"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'oklch(0.43 0.22 295)',
                  letterSpacing: '0.04em',
                }}
                className="text-base font-semibold hover:underline"
              >
                support@printlog3d.com
              </a>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                color: 'oklch(0.15 0.02 295)',
              }}
              className="text-2xl font-bold mb-6"
            >
              Frequently Asked Questions
            </h2>

            <div
              style={{
                border: '1px solid oklch(0.84 0.015 295)',
                borderRadius: '0.25rem',
                overflow: 'hidden',
              }}
            >
              {FAQS.map((faq, i) => (
                <details
                  key={faq.q}
                  style={{
                    borderTop: i === 0 ? 'none' : '1px solid oklch(0.84 0.015 295)',
                    background: i % 2 === 0 ? 'oklch(0.99 0.004 295)' : 'oklch(0.97 0.006 295)',
                  }}
                >
                  <summary
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'oklch(0.15 0.02 295)',
                      padding: '1rem 1.25rem',
                      cursor: 'pointer',
                      listStyle: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    className="font-semibold"
                  >
                    {faq.q}
                    <span style={{ color: 'oklch(0.43 0.22 295)' }} className="text-lg">+</span>
                  </summary>
                  <div
                    style={{
                      color: 'oklch(0.35 0.018 295)',
                      fontFamily: 'var(--font-body)',
                      padding: '0 1.25rem 1.25rem',
                    }}
                    className="leading-relaxed text-sm"
                  >
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            <p
              style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }}
              className="mt-10 text-sm text-center"
            >
              See our <a href="/privacy" style={{ color: 'oklch(0.43 0.22 295)' }} className="hover:underline">Privacy Policy</a> for information on how we handle your data.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
