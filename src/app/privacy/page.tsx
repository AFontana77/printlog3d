import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for the printlog3d.com website and the PrintLog3D mobile app, once it is released.',
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

export default function PrivacyPage() {
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
              LEGAL · POLICY
            </div>
            <h1 style={{ ...headingStyle, lineHeight: 1.05 }} className="text-4xl sm:text-5xl font-bold mb-3">
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }} className="text-sm mb-10">
              Last updated: April 17, 2026
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">1. Who We Are</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              Anvil Road LLC operates printlog3d.com. A PrintLog3D mobile app is in development and is not yet released. This policy will be updated to cover the app before it launches.
              Contact: <a href="mailto:support@printlog3d.com" style={linkStyle} className="hover:underline">support@printlog3d.com</a>
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">2. Information We Collect</h2>
            <p style={bodyStyle} className="mb-3">This website collects the minimum data needed to run it:</p>
            <ul style={bodyStyle} className="list-disc pl-6 mb-4 space-y-2">
              <li><strong style={{ color: 'var(--foreground)' }}>Email address.</strong> If you sign up for the free settings sheet or another form on this site, we collect your email address. See section 8 for details.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Basic site analytics.</strong> We use Google Tag Manager to see which pages are visited and which outbound links are clicked. This does not include your name or email unless you separately submit a form.</li>
            </ul>
            <p style={bodyStyle} className="mb-4">The website does not have a print log feature. That is planned for the PrintLog3D mobile app, which is in development. When the app is released, we will update this policy to explain what it collects before it collects anything.</p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">3. How We Use Your Information</h2>
            <ul style={bodyStyle} className="list-disc pl-6 mb-4 space-y-1">
              <li>To operate the website</li>
              <li>To send the settings sheet and any emails you sign up for</li>
              <li>To respond to support requests</li>
              <li>To understand which pages and outbound links people use, so we can improve the site</li>
            </ul>
            <p style={bodyStyle} className="mb-4">We do not use your data for advertising. We do not sell your data to any third party.</p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">4. Third-Party Services</h2>
            <ul style={bodyStyle} className="list-disc pl-6 mb-4 space-y-1">
              <li><strong style={{ color: 'var(--foreground)' }}>Google Tag Manager.</strong> Measures site traffic and outbound clicks. See section 2.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Resend.</strong> Sends the settings sheet and any email updates you sign up for.</li>
            </ul>
            <p style={bodyStyle} className="mb-4">When the PrintLog3D app is released, we will update this section to list any additional services it uses, such as purchase processing.</p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">5. Data Deletion</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              You can ask us to delete your email address at any time by emailing support@printlog3d.com, or by using the unsubscribe link in any email we send. We do not currently store any other personal data about website visitors beyond the basic analytics described in section 2, which does not identify you by name.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">6. Children</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              This website is not directed at children under 13. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">7. Changes to This Policy</h2>
            <p style={bodyStyle} className="leading-relaxed mb-4">
              We may update this policy, including when the PrintLog3D app is released. We will post the revised policy at this URL with a new last updated date.
              Continued use of the website after changes constitutes acceptance of the updated policy.
            </p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">8. Email you give us on this website</h2>

            <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)' }} className="text-sm mb-10">If you enter your email address in a signup form on this website, we store it so we can send you the updates you asked for. We also record which page you signed up from and when you gave consent. We use Resend to send and manage that mail. We do not sell your address, and every email has an unsubscribe link. This is separate from anything described above: your email address is not linked to any other data on this site or in any of our apps.</p>

            <h2 style={headingStyle} className="text-xl font-semibold mt-10 mb-3">9. Contact</h2>
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
