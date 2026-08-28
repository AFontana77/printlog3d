import Link from 'next/link';
import { ExternalLink, ShoppingCart } from 'lucide-react';
import type { MaterialProfile } from '@/lib/materials';
import {
  AMAZON,
  SPECIALIST_RETAILERS,
  amazonSearchUrl,
  filamentSearchTerms,
  sourcingFor,
} from '@/lib/commerce';

/**
 * Where to buy the material itself.
 *
 * This was the property's largest commercial omission: an audience arriving to
 * look up filament settings had no path to the filament. Gear was covered,
 * the thing they came for was not.
 *
 * The section is written so it remains useful with every link removed. What to
 * check before buying a spool is the substance; the merchant is the convenience.
 */

/** Checks that decide whether a given spool is worth buying, per sourcing tier. */
function buyingChecks(m: MaterialProfile): string[] {
  const checks = [
    'Diameter 1.75mm unless your printer takes 2.85mm. Check before ordering, not after.',
    'Published diameter tolerance. ±0.02mm is good, ±0.05mm is loose and shows up as inconsistent extrusion.',
  ];
  if (m.needsDrying) {
    checks.push(
      'Vacuum-sealed with desiccant. Hygroscopic filament that shipped open has already absorbed moisture and will need drying before its first print.',
    );
  }
  if (m.category.includes('CF') || m.avoidFor.some((a) => a.toLowerCase().includes('brass'))) {
    checks.push(
      'Fit a hardened nozzle first. This material is abrasive and will widen a brass nozzle within a print or two.',
    );
  }
  if (m.enclosure === 'Required') {
    checks.push(
      'Confirm you have an enclosure before buying. Without one this material will warp regardless of spool quality.',
    );
  }
  return checks;
}

export function FilamentBuying({ material }: { material: MaterialProfile }) {
  const sourcing = sourcingFor(material);
  const amazonUrl = amazonSearchUrl(filamentSearchTerms(material));
  const checks = buyingChecks(material);

  return (
    <section
      className="py-14 px-4 bg-white border-t border-gray-100"
      data-placement="filament-buying"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ShoppingCart size={20} className="text-brand" aria-hidden="true" />
          Buying {material.category}
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          {sourcing === 'commodity' && (
            <>
              {material.category} is widely stocked and largely interchangeable between
              reputable brands. Typical street price is{' '}
              <strong>{material.priceBandUsd} per 1&nbsp;kg spool</strong>. Spend the money on
              tolerance and packaging rather than on a name.
            </>
          )}
          {sourcing === 'specialist' && (
            <>
              {material.category} is stocked unevenly by general retailers. A specialist
              supplier is usually the better source, both for availability and because they
              publish the spec sheet. Typical street price is{' '}
              <strong>{material.priceBandUsd} per 1&nbsp;kg spool</strong>.
            </>
          )}
          {sourcing === 'engineering' && (
            <>
              {material.category} is an engineering material and general retailers are not a
              serious source for it. Buy from a specialist who publishes the datasheet.
              Typical street price is{' '}
              <strong>{material.priceBandUsd} per 1&nbsp;kg spool</strong>, which is high
              enough that buying the wrong spool is an expensive mistake.
            </>
          )}
        </p>

        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
          Check before you order
        </h3>
        <ul className="space-y-2 mb-8">
          {checks.map((c) => (
            <li key={c} className="text-sm text-gray-600 leading-relaxed flex gap-2">
              <span aria-hidden="true" className="text-brand flex-shrink-0">
                &bull;
              </span>
              {c}
            </li>
          ))}
        </ul>

        {sourcing !== 'commodity' && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Specialist suppliers
            </h3>
            <div className="space-y-3">
              {SPECIALIST_RETAILERS.map((r) => (
                <div key={r.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4 inline-flex items-center gap-1.5 min-h-[44px]"
                  >
                    {r.name}
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{r.why}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Named because they stock this class of material and publish specifications. We have
              no commercial relationship with either, and these are ordinary links.
            </p>
          </div>
        )}

        {amazonUrl ? (
          <div>
            <a
              href={amazonUrl}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              data-affiliate-brand="amazon"
              data-affiliate-network="amazon"
              data-affiliate-material={material.category}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px]"
            >
              <ExternalLink size={16} aria-hidden="true" />
              {sourcing === 'commodity'
                ? `See ${material.category} filament on Amazon`
                : `Check Amazon for ${material.category}`}
            </a>
            {sourcing === 'engineering' && (
              <p className="mt-2 text-xs text-gray-500">
                Amazon listings for {material.category} are often mislabelled or relabelled
                stock. Verify the datasheet before ordering.
              </p>
            )}
          </div>
        ) : (
          AMAZON.status === 'pending' &&
          sourcing === 'commodity' && (
            <p className="text-sm text-gray-500 leading-relaxed">
              We have not set up an Amazon storefront link for this site yet, so there is no
              purchase link here. The checks above are what matter; any reputable supplier
              meeting them will do.
            </p>
          )
        )}

        <p className="mt-6 text-sm text-gray-600 leading-relaxed">
          Not sure this is the right material?{' '}
          <Link
            href="/library"
            className="text-brand hover:text-brand-dark underline underline-offset-4"
          >
            Compare all materials
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
