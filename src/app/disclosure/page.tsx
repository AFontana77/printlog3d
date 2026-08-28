import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  AMAZON,
  PRINT_SERVICES,
  SPECIALIST_RETAILERS,
  activeAffiliateMerchants,
  hasAnyAffiliateRelationship,
} from '@/lib/commerce';
import { OWNED_SERVICE, ownedServiceMaterials } from '@/lib/ownedService';

/**
 * Affiliate disclosure, derived from merchant status rather than written by hand.
 *
 * This page cannot go stale, and that is the entire point of building it this
 * way. The property previously carried the line "PrintLog3D participates in the
 * Amazon Associates program" on 1,000 pages while its tracking value was still
 * the literal string PENDING_TRACKING_ID. The claim was false the day it shipped
 * and stayed false for months because nothing tied it to reality.
 *
 * Here, the copy is generated from the same `commerce.ts` status flags the links
 * are generated from. If no relationship is active the page says so plainly; the
 * moment one is, it is named. Neither state can be reached by forgetting to edit
 * a paragraph.
 */

const BASE = 'https://www.printlog3d.com';

export const metadata: Metadata = {
  title: 'Affiliate disclosure',
  description:
    'How printlog3d.com makes money, which links are commercial, and which are not. Written to reflect the relationships that actually exist.',
  alternates: { canonical: `${BASE}/disclosure` },
};

export default function DisclosurePage() {
  const active = activeAffiliateMerchants();
  const monetised = hasAnyAffiliateRelationship();

  return (
    <>
      <SiteNav />
      <main id="main-content" className="pt-20">
        <section className="py-14 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Affiliate disclosure
            </h1>

            <p className="text-gray-700 leading-relaxed mb-6">
              This page describes how printlog3d.com makes money and which links on it are
              commercial. It is generated from the site&rsquo;s own configuration, so it
              describes the relationships that exist today rather than ones we intend to have.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">
              Paid relationships
            </h2>

            {monetised ? (
              <>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We earn a commission on qualifying purchases made through some of the links on
                  this site. Using them costs you nothing extra. We currently participate in:
                </p>
                <ul className="space-y-2 mb-4">
                  {active.map((m) => (
                    <li key={m.id} className="text-gray-700 leading-relaxed flex gap-2">
                      <span aria-hidden="true" className="text-brand">
                        &bull;
                      </span>
                      {m.disclosureName ?? m.name}
                    </li>
                  ))}
                </ul>
                {AMAZON.status === 'enrolled' && (
                  <p className="text-gray-700 leading-relaxed mb-4">
                    As an Amazon Associate we earn from qualifying purchases.
                  </p>
                )}
                <p className="text-gray-700 leading-relaxed">
                  Commercial links are marked with <code>rel=&quot;sponsored&quot;</code> and open
                  in a new tab.
                </p>
              </>
            ) : (
              <p className="text-gray-700 leading-relaxed">
                <strong>None.</strong> We currently have no affiliate relationship with any
                retailer or manufacturer, and this site earns nothing from any link on it. If
                that changes, this page will name the programme, and commercial links will be
                marked with <code>rel=&quot;sponsored&quot;</code>.
              </p>
            )}

            <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">
              A business we own
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>{OWNED_SERVICE.name}</strong> ({OWNED_SERVICE.domain}) is another Anvil
              Road property. When we link to it we have a direct commercial interest, which is
              a stronger relationship than an affiliate one, so we say so on every page that
              links to it rather than only here.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We only offer it for the materials it actually prints:{' '}
              {ownedServiceMaterials().map((x) => x.category).join(', ')}. For everything else,
              including PEEK, polycarbonate and plain nylon, it is not offered at all and we
              point to independent services instead. Owning a service does not make it the
              right answer, and on the hardest materials it is not.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">
              Links we do not earn from
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Some pages link to specialist suppliers and print services because naming them is
              the useful answer, not because we are paid to. We have no commercial relationship
              with any of the following and receive nothing if you use them:
            </p>
            <ul className="space-y-2 mb-4">
              {[...SPECIALIST_RETAILERS, ...PRINT_SERVICES]
                .filter((x) => x.status === 'editorial')
                .map((x) => (
                  <li key={x.id} className="text-gray-700 leading-relaxed flex gap-2">
                    <span aria-hidden="true" className="text-gray-400">
                      &bull;
                    </span>
                    {x.name}
                  </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">
              How this affects what we recommend
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Print temperatures, drying requirements and material advice on this site are
              typical manufacturer-published figures for each material class. They are not
              measurements we took, and no commercial relationship influences them.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              We recommend product <em>categories</em> with the specification that decides
              whether a given product will work, rather than naming one product and hoping the
              listing survives. Where a material needs equipment that consumer products cannot
              provide, we say so instead of recommending something that will not do the job.
              The{' '}
              <Link
                href="/library/peek"
                className="text-brand hover:text-brand-dark underline underline-offset-4"
              >
                PEEK page
              </Link>{' '}
              is the clearest example: it tells you a filament dryer is the wrong tool.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If a page has no commercial link, that is usually deliberate.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">Questions</h2>
            <p className="text-gray-700 leading-relaxed">
              See our{' '}
              <Link
                href="/privacy"
                className="text-brand hover:text-brand-dark underline underline-offset-4"
              >
                privacy policy
              </Link>{' '}
              and{' '}
              <Link
                href="/terms"
                className="text-brand hover:text-brand-dark underline underline-offset-4"
              >
                terms
              </Link>
              , or reach us via the{' '}
              <Link
                href="/support"
                className="text-brand hover:text-brand-dark underline underline-offset-4"
              >
                support page
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
