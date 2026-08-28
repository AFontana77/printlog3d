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
        <section className="py-16 px-4" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-3xl mx-auto">
            <div
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--brand-primary)',
                letterSpacing: '0.15em',
                fontSize: '0.7rem',
              }}
              className="uppercase font-semibold mb-8 flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: '24px', height: '1px', background: 'var(--brand-primary)', flexShrink: 0 }} />
              SUPPORT · CONTACT
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--foreground)',
                lineHeight: 1.05,
              }}
              className="text-4xl sm:text-5xl font-bold mb-4"
            >
              Support
            </h1>
            <p
              style={{ color: 'var(--body-text)', fontFamily: 'var(--font-body)' }}
              className="text-base mb-10"
            >
              Get help with PrintLog3D or give us feedback.
            </p>

            <div
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                borderRadius: '0.25rem',
                padding: '1.5rem',
                marginBottom: '3rem',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--muted-foreground)',
                  letterSpacing: '0.1em',
                  fontSize: '0.65rem',
                }}
                className="uppercase font-semibold mb-2"
              >
                EMAIL SUPPORT
              </div>
              <p
                style={{ color: 'var(--body-text)', fontFamily: 'var(--font-body)' }}
                className="text-sm mb-3"
              >
                We respond within 1 to 2 business days.
              </p>
              <a
                href="mailto:support@printlog3d.com"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--brand-primary)',
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
                color: 'var(--foreground)',
              }}
              className="text-2xl font-bold mb-6"
            >
              Frequently Asked Questions
            </h2>

            <div
              style={{
                border: '1px solid var(--border)',
                borderRadius: '0.25rem',
                overflow: 'hidden',
              }}
            >
              {FAQS.map((faq, i) => (
                <details
                  key={faq.q}
                  style={{
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
                  }}
                >
                  <summary
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--foreground)',
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
                    <span style={{ color: 'var(--brand-primary)' }} className="text-lg">+</span>
                  </summary>
                  <div
                    style={{
                      color: 'var(--body-text)',
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
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }}
              className="mt-10 text-sm text-center"
            >
              See our <a href="/privacy" style={{ color: 'var(--brand-primary)' }} className="hover:underline">Privacy Policy</a> for information on how we handle your data.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
