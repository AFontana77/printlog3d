import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — PrintLog3D',
  description: 'Privacy policy for the PrintLog3D mobile application and printlog3d.com website.',
};

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        <section className="py-16 px-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-400 text-sm mb-8">Last updated: April 17, 2026</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Who We Are</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Anvil Road LLC operates printlog3d.com and the PrintLog3D mobile application.
              Contact: <a href="mailto:support@printlog3d.com" className="text-violet-700 hover:underline">support@printlog3d.com</a>
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-1">
              <li><strong>Account email address</strong> — optional, for cross-device sync only.</li>
              <li><strong>Print logs you create</strong> — stored locally on your device and, if you have an account, in our secure cloud database (Supabase).</li>
              <li><strong>Purchase confirmation</strong> — via RevenueCat when you unlock premium features. We do not receive your payment details.</li>
              <li><strong>Device identifiers</strong> — used by RevenueCat to associate your purchase with your device.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-1">
              <li>To operate the app and sync your data across devices (if you have an account)</li>
              <li>To restore your purchase on new devices</li>
              <li>To respond to support requests</li>
            </ul>
            <p className="text-gray-600 mb-4">We do not use your data for advertising. We do not sell your data to any third party.</p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Third-Party Services</h2>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-1">
              <li><strong>Supabase</strong> — secure cloud database for optional account sync. Hosted on AWS US-East.</li>
              <li><strong>RevenueCat</strong> — in-app purchase management and subscription tracking.</li>
              <li><strong>Apple App Store / Google Play</strong> — app distribution and payment processing.</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Data Deletion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may delete your account and all associated cloud data at any time from the app settings.
              We will delete your data within 30 days of the request. Local device data is deleted when you uninstall the app.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Children</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              This app is not directed at children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">7. Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may update this policy. We will post the revised policy at this URL with a new last updated date.
              Continued use of the app after changes constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">8. Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about this policy? Email <a href="mailto:support@printlog3d.com" className="text-violet-700 hover:underline">support@printlog3d.com</a>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
