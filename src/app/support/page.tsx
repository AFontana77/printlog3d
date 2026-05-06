import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — PrintLog3D',
  description: 'Get help with the PrintLog3D app. Contact support or browse common questions.',
};

const FAQS = [
  {
    q: 'How do I get the app?',
    a: 'Search "PrintLog3D" in the App Store or Google Play. The app is free to download. The $6.99 one-time unlock removes entry limits and adds premium features.',
  },
  {
    q: 'What does the $6.99 unlock include?',
    a: 'Unlimited print logs, settings history per filament, failure notes, and PDF export. One-time payment, no subscription, no expiration.',
  },
  {
    q: 'How do I restore my purchase?',
    a: 'Open the app, go to Settings, and tap "Restore Purchases." Make sure you are signed in to the same Apple ID or Google account you used to purchase.',
  },
  {
    q: 'Does the app require an account?',
    a: 'No account is required for offline use. An optional free account lets you sync your print logs across devices.',
  },
  {
    q: 'Is there a subscription?',
    a: 'No. PrintLog3D is free to download with entry limits, and $6.99 one-time to unlock everything. No monthly fees, ever.',
  },
  {
    q: 'How do I delete my account and data?',
    a: 'Go to Settings in the app and tap "Delete Account." This removes all cloud data within 30 days. Local data is removed when you uninstall the app.',
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
              App Support
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
