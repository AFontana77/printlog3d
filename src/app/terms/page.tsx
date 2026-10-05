import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';
import { ogFor } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  openGraph: ogFor('/terms'),
  title: 'Terms of Service',
  description: 'Terms of service for the printlog3d.com website.',
};

const headingStyle = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
};

const bodyStyle = {
  color: 'var(--body-text)',
  fontFamily: 'var(--font-body)',
};

const linkStyle = {
  color: 'var(--brand-primary)',
};

export default function TermsPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        <section className="py-16 px-4" style={{ background: 'var(--surface-0)' }}>
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
              LEGAL · TERMS
            </div>
            <h1 style={{ ...headingStyle, lineHeight: 1.05 }} className="text-4xl sm:text-5xl font-bold mb-3">
              Terms of Service
            </h1>
            <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }} className="text-sm mb-10">
              Last updated: October 5, 2026
            </p>

            <p style={bodyStyle} className="leading-relaxed mb-6">
              These Terms of Service govern your use of the website at printlog3d.com.
              By using the website, you agree to these terms.
              If you do not agree, do not use the service.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">1. Who We Are</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              Anvil Road LLC operates printlog3d.com.
              Contact: <a href="mailto:support@printlog3d.com" style={linkStyle} className="hover:underline">support@printlog3d.com</a>
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">2. Use of the Service</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              PrintLog3D is a website with a filament material reference and a free settings sheet. You may use the service for personal, non-commercial purposes only.
              You agree not to misuse the service or use it in any way that violates applicable law.
            </p>
            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">3. User Accounts</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              The website does not currently offer user accounts.
              If we add optional accounts in the future, we will update these terms to describe how they work.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">4. Intellectual Property</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              All content, design, code, and reference data on the PrintLog3D website are owned by Anvil Road LLC
              or licensed to us. You may not copy, reproduce, or redistribute any part of the service without written permission.
            </p>
            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">5. Limitation of Liability</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              PrintLog3D is provided &ldquo;as is&rdquo; without warranties of any kind. Anvil Road LLC is not liable for any damages
              arising from use of the website, including data loss, inaccurate reference information, or service interruptions.
              Our total liability to you is limited to the amount you paid us, if any.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">6. Changes to These Terms</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              We may update these terms from time to time. We will post the revised terms at this URL with a new last updated date.
              Continued use of the service after changes constitutes your acceptance of the updated terms.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">7. Governing Law</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              These terms are governed by the laws of the State of New Jersey, United States, without regard to conflict of law principles.
              Any disputes must be brought in the courts of New Jersey.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">8. Contact</h2>
            <p style={bodyStyle} className="leading-relaxed">
              Questions about these terms? Email <a href="mailto:support@printlog3d.com" style={linkStyle} className="hover:underline">support@printlog3d.com</a>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
