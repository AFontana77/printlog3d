import Link from 'next/link';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { MATERIAL_PROFILES } from '@/lib/materials';
import { PRODUCTS } from '@/lib/products';
import { PROGRAMS, isMonetised } from '@/lib/merchants';
import type { Metadata } from 'next';

/**
 * Editorial policy, methodology and corrections.
 *
 * Written to be checkable rather than reassuring. The counts and the merchant
 * table are derived from the same modules the site renders from, so this page
 * cannot describe a commercial arrangement that is not actually configured —
 * which is the failure mode of every "our promise to you" page ever written.
 */

const TITLE = 'Editorial policy, sources and corrections';
const DESC =
  'How PrintLog3D sources its numbers, the difference between manufacturer-published specifications and first-party testing, how products are selected, and how commission does and does not affect what appears here.';
const URL = 'https://www.printlog3d.com/editorial-policy';
const LAST_REVIEWED = '2026-08-31';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESC,
      url: URL,
      dateModified: LAST_REVIEWED,
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
        { '@type': 'ListItem', position: 2, name: 'Editorial policy', item: URL },
      ],
    },
  ],
};

const h2 = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
} as React.CSSProperties;
const body = { color: 'var(--body-text)', lineHeight: 1.7 } as React.CSSProperties;
const link = { color: 'var(--brand-primary)' } as React.CSSProperties;

export default function EditorialPolicyPage() {
  const programs = Object.values(PROGRAMS);
  const live = programs.filter((p) => isMonetised(p.key));
  const pending = programs.filter((p) => !isMonetised(p.key));

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main-content" className="pt-20">
        <section className="pt-16 pb-10 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ ...h2, lineHeight: 1.05 }}>
              How this site decides what to tell you.
            </h1>
            <p className="text-lg max-w-[62ch]" style={body}>
              PrintLog3D publishes numbers people rely on at a machine. This page says where those
              numbers come from, what we have and have not done ourselves, and how money does and
              does not affect what appears here.
            </p>
            <p className="text-sm mt-5" style={{ color: 'var(--muted-foreground)' }}>
              Last reviewed: {LAST_REVIEWED}
            </p>
          </div>
        </section>

        <article className="py-12 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-3xl mx-auto space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-3" style={h2}>
                Manufacturer specification is not our test result
              </h2>
              <p className="mb-3" style={body}>
                Every temperature, drying time, enclosure requirement and price band on this site is
                a <strong>typical manufacturer-published or widely-documented range for the material
                class</strong>. It is not a measurement we took.
              </p>
              <p className="mb-3" style={body}>
                We say that plainly rather than in a footnote, because the distinction changes how
                you should use the figure. A published range is a safe place to start. It is not a
                promise about your machine, your spool or your room, and any site that presents it
                as one is telling you something it cannot know.
              </p>
              <p style={body}>
                <strong>PrintLog3D has not conducted first-party physical testing.</strong> When it
                does, that data will appear under its own label, separated from published ranges,
                with the method stated. Until then, no claim on this site rests on our own measurements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={h2}>
                Where the numbers come from
              </h2>
              <p className="mb-3" style={body}>
                Material data is held in one place and every page renders from it, so a correction
                reaches the material profile, the comparison tables, the drying tool and the
                downloadable field guide at the same time. There is no second copy to fall out of
                step.
              </p>
              <p style={body}>
                Ranges are drawn from filament manufacturers&apos; own published figures, including
                Prusa, Polymaker, Bambu Lab, 3DXTech, FormFutura and AON3D, cross-checked between
                grades. Where published grades genuinely disagree, the range on this site is wide on
                purpose rather than averaged into a single number no manufacturer states.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={h2}>
                How products are selected
              </h2>
              <p className="mb-3" style={body}>
                The requirement comes first. A product appears only where something documented on
                this site creates a genuine need for it, and only where a listing meets the stated
                specification. There are {PRODUCTS.length} products on the site in total, which is
                deliberately few.
              </p>
              <p className="mb-3" style={body}>
                Each listing is confirmed live, with real imagery, before it is published. Products
                are rejected regularly and for specific reasons: one was dropped for claiming fit
                with a single printer brand while being presented as generic.
              </p>
              <p style={body}>
                <strong>Commission plays no part in whether something is listed.</strong> Several
                suppliers named on this site pay us nothing, and they stay named because they are
                the right answer. Where a product does not exist for a requirement, the requirement
                is published without one.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={h2}>
                Affiliate relationships, in full
              </h2>
              <p className="mb-4" style={body}>
                This table is generated from the site&apos;s own commerce configuration, so it
                cannot describe a relationship that is not actually active.
              </p>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[30rem] text-sm border-collapse">
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th scope="col" className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--foreground)' }}>Merchant</th>
                      <th scope="col" className="text-left py-2 pr-4 font-semibold" style={{ color: 'var(--foreground)' }}>Do we earn?</th>
                      <th scope="col" className="text-left py-2 font-semibold" style={{ color: 'var(--foreground)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...live, ...pending].map((p) => (
                      <tr key={p.key} style={{ borderBottom: '1px solid var(--border)' }}>
                        <th scope="row" className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--body-text)' }}>{p.brand}</th>
                        <td className="py-2 pr-4" style={{ color: isMonetised(p.key) ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                          {isMonetised(p.key) ? 'Yes' : 'No'}
                        </td>
                        <td className="py-2" style={{ color: 'var(--muted-foreground)' }}>
                          {isMonetised(p.key) ? 'Active affiliate program' : 'Linked editorially, no relationship'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4" style={body}>
                As an Amazon Associate we earn from qualifying purchases. That costs you nothing
                extra. Full detail is on the{' '}
                <Link href="/disclosure" style={link} className="underline underline-offset-4">
                  disclosure page
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={h2}>
                How often this is rechecked
              </h2>
              <p className="mb-3" style={body}>
                Product listings are re-verified against the retailer&apos;s API, and a listing that
                has gone will be removed rather than left to rot into a dead link. Material data is
                reviewed when a manufacturer publishes a revision or when a reader tells us
                something looks wrong.
              </p>
              <p style={body}>
                Every material page carries its own review date, and the{' '}
                {MATERIAL_PROFILES.length} profiles are checked as a set rather than individually,
                because they are generated from one source.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={h2}>
                Corrections
              </h2>
              <p className="mb-3" style={body}>
                If a number here is wrong, we would rather know. Corrections to technical data are
                made at the source, which means they propagate to every page and to the downloadable
                guide together.
              </p>
              <p style={body}>
                Tell us at{' '}
                <Link href="/support" style={link} className="underline underline-offset-4">
                  our support page
                </Link>
                . Include the material and the figure you believe is wrong, and the manufacturer
                document if you have one. A correction backed by a published spec sheet will
                generally be made the same week.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3" style={h2}>
                What we will not do
              </h2>
              <ul className="space-y-2" style={body}>
                <li>Present a published range as our own measurement.</li>
                <li>Publish a product we have not confirmed exists and is available.</li>
                <li>Let a commission decide whether a supplier is named.</li>
                <li>Claim a certification that belongs to a specific grade, for a whole material class.</li>
                <li>Recommend our own printing service for a material it cannot print.</li>
              </ul>
            </section>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
