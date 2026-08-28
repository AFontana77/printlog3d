import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for the printlog3d.com website and the PrintLog3D mobile app, once it is released.',
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
              Last updated: April 18, 2026
            </p>

            <p style={bodyStyle} className="leading-relaxed mb-6">
              These Terms of Service govern your use of the website at printlog3d.com and, once it is released, the PrintLog3D mobile app.
              By using the website, or later by downloading the app, you agree to these terms.
              If you do not agree, do not use the service.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">1. Who We Are</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              Anvil Road LLC operates printlog3d.com. A PrintLog3D mobile app is in development and is not yet released.
              Contact: <a href="mailto:support@printlog3d.com" style={linkStyle} className="hover:underline">support@printlog3d.com</a>
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">2. Use of the Service</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              PrintLog3D is a website with a filament material reference and a free settings sheet. A print log app is in development. You may use the service for personal, non-commercial purposes only.
              You agree not to misuse the service or use it in any way that violates applicable law.
            </p>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              If you use the print log once the app is available, you are responsible for all data you enter. We do not verify the accuracy of your logged entries.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">3. User Accounts</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              The website does not currently offer user accounts.
              If we add optional accounts in the future, we will update these terms to describe how they work.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">4. In-App Purchases</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              PrintLog3D does not currently offer any in-app purchase. A companion app is in development and is not yet available.
              If and when the app launches with a paid unlock, that purchase would be processed by Apple App Store or Google Play under their respective policies.
              We do not process payment information directly.
            </p>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              Any future purchase would be tied to your App Store or Google Play account and could be restored on new devices using the restore
              purchases option once that feature exists.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">5. Intellectual Property</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              All content, design, code, and reference data on the PrintLog3D website, and in the mobile app once it is released, are owned by Anvil Road LLC
              or licensed to us. You may not copy, reproduce, or redistribute any part of the service without written permission.
            </p>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              Data you create in the print log, once the app is available, remains yours. We do not claim ownership of your personal records.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">6. Limitation of Liability</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              PrintLog3D is provided &ldquo;as is&rdquo; without warranties of any kind. Anvil Road LLC is not liable for any damages
              arising from use of the website or app, including data loss, inaccurate reference information, or service interruptions.
              Our total liability to you is limited to the amount you paid us, if any.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">7. Changes to These Terms</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              We may update these terms from time to time. We will post the revised terms at this URL with a new last updated date.
              Continued use of the service after changes constitutes your acceptance of the updated terms.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">8. Governing Law</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              These terms are governed by the laws of the State of New Jersey, United States, without regard to conflict of law principles.
              Any disputes must be brought in the courts of New Jersey.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">9. Contact</h2>
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
