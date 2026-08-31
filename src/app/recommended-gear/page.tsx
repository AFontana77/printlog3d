import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Faq } from '@/components/Faq';
import { AmazonProductImage } from '@/components/AmazonProductImage';
import { MATERIAL_PROFILES } from '@/lib/materials';
import { PRODUCTS, CLUSTERS, productUrl } from '@/lib/products';
import { AMAZON, amazonTag } from '@/lib/commerce';
import { DISCLOSURE_TEXT } from '@/lib/merchants';
import type { Metadata } from 'next';

/**
 * The gear hub.
 *
 * Organised by the job the tool does, not by product type, and every entry
 * states the requirement before it states the product. That order is the whole
 * point: the requirement is the durable part and survives any listing dying,
 * which is what happened to the portfolio's last curated catalogue when 86% of
 * 224 products rotted to 404s.
 *
 * WHAT IS DELIBERATELY ABSENT: printers.
 *
 * We have not tested a printer and do not have verified listings for any, so
 * naming one would be an invented recommendation on the highest-value page of
 * the site. Instead the printer section gives the capability thresholds the
 * material data already establishes, which is the genuinely useful half and the
 * half we can actually stand behind. If that costs a click, it costs a click.
 */

const TITLE = 'Recommended 3D printing gear, and the reason for each';
const DESC =
  'The tools that solve a specific 3D printing problem: drying and storage, nozzles, build surface, finishing and assembly. Every item states the requirement it meets before it names a product.';
const URL = 'https://www.printlog3d.com/recommended-gear';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
};

const FAQ = [
  {
    question: 'Do you test the products you recommend?',
    answer:
      'No, and we do not claim to. Every item here is chosen against a stated technical requirement, and every listing is confirmed live with real imagery before it is published. Where a figure is given it comes from the manufacturer, not from us. If that changes, first-party testing will be labelled as such.',
  },
  {
    question: 'Why are there no printer recommendations?',
    answer:
      'Because we have not tested one. What we can give you is the capability threshold each material actually needs: hot end temperature, bed temperature, whether a chamber is required and whether the nozzle has to be hardened. Match a machine against those and the shortlist writes itself.',
  },
  {
    question: 'How do you choose which products to list?',
    answer:
      'The requirement comes first. A tool appears only where a documented material or workshop step creates a genuine need for it, and only where a listing meets the stated specification. Commission plays no part in whether something is listed.',
  },
  {
    question: 'What if a product is discontinued?',
    answer:
      'The requirement above it still tells you what to buy, and a category search link stays available for every cluster. That is the reason the requirement is written first rather than as a footnote.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESC,
      url: URL,
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
        { '@type': 'ListItem', position: 2, name: 'Recommended gear', item: URL },
      ],
    },
  ],
};

/** Capability thresholds, derived from the material data rather than asserted. */
function printerThresholds() {
  const nozzle = (m: (typeof MATERIAL_PROFILES)[number]) =>
    Number((m.printTempC.match(/(\d+)\s*$/) || [])[1] || 0);
  const bed = (m: (typeof MATERIAL_PROFILES)[number]) =>
    Number((m.bedTempC.match(/(\d+)\s*$/) || [])[1] || 0);

  const openFrame = MATERIAL_PROFILES.filter((m) => m.enclosure === 'Not needed');
  const enclosed = MATERIAL_PROFILES.filter((m) => m.enclosure === 'Required');
  const abrasive = MATERIAL_PROFILES.filter(
    (m) => /-(CF|GF)$/.test(m.category) || /Glow|Metal|Wood/.test(m.category),
  );

  return [
    {
      tier: 'A stock, open-frame printer',
      unlocks: `${openFrame.length} of the ${MATERIAL_PROFILES.length} materials here`,
      needs: `Hot end to about ${Math.max(...openFrame.map(nozzle))}°C and a bed to ${Math.max(...openFrame.map(bed))}°C. No chamber.`,
      examples: openFrame.slice(0, 6).map((m) => m.category).join(', '),
    },
    {
      tier: 'Add a hardened nozzle',
      unlocks: `${abrasive.length} filled and loaded compounds`,
      needs: 'Brass wears within a spool on anything with carbon, glass, metal, wood or phosphor in it. The nozzle is the cheapest upgrade on this list.',
      examples: abrasive.slice(0, 6).map((m) => m.category).join(', '),
    },
    {
      tier: 'Add an enclosure',
      unlocks: `${enclosed.length} materials that warp without still, warm air`,
      needs: `Hot end to ${Math.max(...enclosed.map(nozzle))}°C and a bed to ${Math.max(...enclosed.map(bed))}°C for the full set. Most of them are reachable well below that.`,
      examples: enclosed.slice(0, 6).map((m) => m.category).join(', '),
    },
  ];
}

export default function RecommendedGearPage() {
  const tag = amazonTag();
  const enrolled = AMAZON.status === 'enrolled' && Boolean(tag);
  const tiers = printerThresholds();

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main-content" className="pt-20">
        <section className="pt-16 pb-10 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }}
            >
              Gear that solves a specific problem.
            </h1>
            <p className="text-lg max-w-[62ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
              Every item here exists because something documented on this site creates a real need
              for it. The requirement is written first and the product second, so the advice still
              works when a listing disappears.
            </p>
            {enrolled && (
              <p className="text-sm mt-5 max-w-[62ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                {DISCLOSURE_TEXT.affiliate} It does not affect what appears here.
              </p>
            )}
          </div>
        </section>

        {CLUSTERS.map((cluster, ci) => {
          const items = PRODUCTS.filter((p) => p.cluster === cluster.id);
          if (!items.length) return null;
          return (
            <section
              key={cluster.id}
              className="py-12 px-6"
              style={{ background: ci % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)' }}
              aria-label={cluster.title}
              data-placement={`gear-${cluster.id}`}
            >
              <div className="max-w-4xl mx-auto">
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
                >
                  {cluster.title}
                </h2>
                <p className="text-base mb-8 max-w-[64ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
                  {cluster.why}
                </p>

                <ul className="space-y-4">
                  {items.map((p) => (
                    <li
                      key={p.asin}
                      className="rounded-xl border p-4 flex gap-4 items-start"
                      style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
                    >
                      <AmazonProductImage
                        asin={p.asin}
                        productName={p.name}
                        className="h-16 w-16 sm:h-20 sm:w-20 object-contain flex-shrink-0 rounded"
                      />
                      <div className="min-w-0">
                        <p
                          className="text-xs uppercase tracking-wide mb-1"
                          style={{ color: 'var(--brand-primary)', fontFamily: 'var(--font-display)' }}
                        >
                          {p.forCategory}
                        </p>
                        <p className="font-bold leading-snug" style={{ color: 'var(--foreground)' }}>
                          {p.name}
                        </p>
                        <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--body-text)' }}>
                          {p.spec}.
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                          {enrolled && (
                            <a
                              href={productUrl(p, tag)}
                              target="_blank"
                              rel="nofollow noopener noreferrer sponsored"
                              data-affiliate-brand="amazon"
                              data-affiliate-network="amazon"
                              data-affiliate-product={p.asin}
                              data-affiliate-category={p.forCategory}
                              className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4 min-h-[44px]"
                              style={{ color: 'var(--brand-primary)' }}
                            >
                              {p.brand} on Amazon
                              <ExternalLink size={13} aria-hidden="true" />
                            </a>
                          )}
                          {p.verified && (
                            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                              Listing verified {p.verified}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}

        {/* Filament routes to the material pages, which is where the settings are. */}
        <section className="py-12 px-6" style={{ background: 'var(--surface-0)' }} aria-label="Filament">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              Filament
            </h2>
            <p className="text-base mb-6 max-w-[64ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
              Buying guidance for filament belongs with the settings, not on a list. Each material
              page carries what to check before ordering that specific material, the price band to
              expect, and where it is actually stocked.
            </p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1">
              {MATERIAL_PROFILES.slice(0, 12).map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/library/${m.slug}`}
                    className="block py-2 text-sm font-semibold underline underline-offset-4"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    Buying {m.category}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm">
              <Link href="/library" className="font-semibold underline underline-offset-4" style={{ color: 'var(--brand-primary)' }}>
                All {MATERIAL_PROFILES.length} materials
              </Link>
            </p>
          </div>
        </section>

        {/* Printers: capability, not a shortlist we have not earned. */}
        <section className="py-12 px-6" style={{ background: 'var(--surface-1)' }} aria-label="Printers">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              Printers
            </h2>
            <p className="text-base mb-8 max-w-[64ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
              We do not name a printer, because we have not tested one and will not pretend
              otherwise. What we can give you is the threshold each tier of material actually
              demands. Match a machine against these and the shortlist writes itself.
            </p>
            <ol className="space-y-5">
              {tiers.map((t, i) => (
                <li
                  key={t.tier}
                  className="rounded-xl border p-5"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
                >
                  <p
                    className="text-[0.65rem] font-bold tabular-nums mb-1"
                    style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-display)', letterSpacing: '0.12em' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                    {t.tier}
                  </p>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--brand-primary)' }}>
                    Unlocks {t.unlocks}
                  </p>
                  <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--body-text)' }}>
                    {t.needs}
                  </p>
                  <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
                    For example: {t.examples}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Faq items={FAQ} heading="Common questions" />
      </main>

      <SiteFooter />
    </>
  );
}
