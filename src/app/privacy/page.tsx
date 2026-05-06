import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PrintLog3D',
  description: 'Privacy policy for the PrintLog3D mobile application and printlog3d.com website.',
};

const headingStyle = {
  fontFamily: 'var(--font-display)',
  color: 'oklch(0.15 0.02 295)',
};

const bodyStyle = {
  color: 'oklch(0.35 0.018 295)',
  fontFamily: 'var(--font-body)',
};

const linkStyle = {
  color: 'oklch(0.43 0.22 295)',
};

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        <section className="py-16 px-4" style={{ background: 'oklch(0.99 0.004 295)' }}>
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
              LEGAL · POLICY
            </div>
            <h1 style={{ ...headingStyle, lineHeight: 1.05 }} className="text-4xl sm:text-5xl font-bold mb-3">
              Privacy Policy
            </h1>
            <p style={{ color: 'oklch(0.48 0.015 295)', fontFamily: 'var(--font-body)' }} className="text-sm mb-10">
              Last updated: April 17, 2026
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">1. Who We Are</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              Anvil Road LLC operates printlog3d.com and the PrintLog3D mobile application.
              Contact: <a href="mailto:support@printlog3d.com" style={linkStyle} className="hover:underline">support@printlog3d.com</a>
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">2. Information We Collect</h2>
            <ul style={bodyStyle} className="list-disc pl-6 mb-4 space-y-1">
              <li><strong style={{ color: 'oklch(0.15 0.02 295)' }}>Account email address</strong> — optional, for cross-device sync only.</li>
              <li><strong style={{ color: 'oklch(0.15 0.02 295)' }}>Print logs you create</strong> — stored locally on your device and, if you have an account, in our secure cloud database (Supabase).</li>
              <li><strong style={{ color: 'oklch(0.15 0.02 295)' }}>Purchase confirmation</strong> — via RevenueCat when you unlock premium features. We do not receive your payment details.</li>
              <li><strong style={{ color: 'oklch(0.15 0.02 295)' }}>Device identifiers</strong> — used by RevenueCat to associate your purchase with your device.</li>
            </ul>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">3. How We Use Your Information</h2>
            <ul style={bodyStyle} className="list-disc pl-6 mb-4 space-y-1">
              <li>To operate the app and sync your data across devices (if you have an account)</li>
              <li>To restore your purchase on new devices</li>
              <li>To respond to support requests</li>
            </ul>
            <p style={bodyStyle} className="mb-4">We do not use your data for advertising. We do not sell your data to any third party.</p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">4. Third-Party Services</h2>
            <ul style={bodyStyle} className="list-disc pl-6 mb-4 space-y-1">
              <li><strong style={{ color: 'oklch(0.15 0.02 295)' }}>Supabase</strong> — secure cloud database for optional account sync. Hosted on AWS US-East.</li>
              <li><strong style={{ color: 'oklch(0.15 0.02 295)' }}>RevenueCat</strong> — in-app purchase management and subscription tracking.</li>
              <li><strong style={{ color: 'oklch(0.15 0.02 295)' }}>Apple App Store / Google Play</strong> — app distribution and payment processing.</li>
            </ul>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">5. Data Deletion</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              You may delete your account and all associated cloud data at any time from the app settings.
              We will delete your data within 30 days of the request. Local device data is deleted when you uninstall the app.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">6. Children</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              This app is not directed at children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">7. Changes to This Policy</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              We may update this policy. We will post the revised policy at this URL with a new last updated date.
              Continued use of the app after changes constitutes acceptance of the updated policy.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">8. Contact</h2>
            <p style={bodyStyle} className="leading-relaxed">
              Questions about this policy? Email <a href="mailto:support@printlog3d.com" style={linkStyle} className="hover:underline">support@printlog3d.com</a>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
