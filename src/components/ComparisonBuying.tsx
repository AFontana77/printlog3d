import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { getMaterialBySlug, type MaterialProfile } from '@/lib/materials';
import { AMAZON, amazonSearchUrl, filamentSearchTerms, sourcingFor } from '@/lib/commerce';

/**
 * The decision-to-purchase block for a two-material comparison guide.
 *
 * A reader on /pla-vs-petg has come to decide what to buy. The comparison itself
 * answers the question; this turns the answer into an action.
 *
 * Everything derives from MATERIAL_PROFILES, so a comparison page cannot quote a
 * temperature that disagrees with the material page it links to. That exact drift
 * existed before: the old library index said PLA was 190-230C while the PLA page
 * said 180-220C.
 *
 * The block is written to stay useful with every link removed. If it reads like a
 * pair of buttons with nothing around them, it has failed.
 */

function Choice({ m }: { m: MaterialProfile }) {
  const href = amazonSearchUrl(filamentSearchTerms(m));
  const sourcing = sourcingFor(m);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">Choose {m.category} if</h3>
      <p className="text-xs text-gray-500 mb-4 tabular-nums">
        {m.printTempC}&deg;C nozzle &middot; {m.bedTempC}&deg;C bed &middot;{' '}
        {m.enclosure === 'Required' ? 'enclosure required' : 'no enclosure'}
      </p>

      <ul className="space-y-2 mb-4">
        {m.goodFor.slice(0, 3).map((g) => (
          <li key={g} className="text-sm text-gray-700 leading-relaxed flex gap-2">
            <span aria-hidden="true" className="text-green-600 flex-shrink-0">
              &bull;
            </span>
            {g}
          </li>
        ))}
      </ul>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        <strong className="text-gray-900">The catch:</strong> {m.commonProblem}
      </p>

      <p className="text-sm text-gray-600 mb-4">
        Typical price <strong>{m.priceBandUsd}</strong>{' '}per 1&nbsp;kg spool.
        {m.needsDrying ? ' Needs drying before use.' : ' Drying is rarely necessary.'}
      </p>

      <div className="flex flex-wrap gap-3 items-center">
        <Link
          href={`/library/${m.slug}`}
          className="inline-flex items-center gap-2 font-semibold text-violet-800 hover:text-violet-900 underline underline-offset-4 min-h-[44px]"
        >
          Full {m.category} settings
        </Link>
        {href && (
          <a
            href={href}
            target="_blank"
            rel="nofollow noopener noreferrer sponsored"
            data-affiliate-brand="amazon"
            data-affiliate-network="amazon"
            data-affiliate-material={m.category}
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-5 py-2.5 rounded-xl transition-colors min-h-[44px] text-sm"
          >
            <ExternalLink size={14} aria-hidden="true" />
            {m.category} on Amazon
          </a>
        )}
        {!href && sourcing !== 'commodity' && (
          <span className="text-xs text-gray-500">Buy from a specialist supplier.</span>
        )}
      </div>
    </div>
  );
}

export function ComparisonBuying({
  slugs,
  heading = 'So which should you buy?',
}: {
  /** Material slugs, in the order the guide compares them. */
  slugs: string[];
  heading?: string;
}) {
  const materials = slugs.map(getMaterialBySlug).filter((m): m is MaterialProfile => Boolean(m));
  if (materials.length < 2) return null;

  const anyNeedsDrying = materials.some((m) => m.needsDrying);
  const anyNeedsEnclosure = materials.some((m) => m.enclosure === 'Required');

  return (
    <section
      className="py-20 px-6 bg-gray-50 border-t border-gray-100"
      data-placement="comparison-buying"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">{heading}</h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {materials.map((m) => (
            <Choice key={m.slug} m={m} />
          ))}
        </div>

        {(anyNeedsDrying || anyNeedsEnclosure) && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-3">Before you order either</h3>
            <ul className="space-y-2">
              {anyNeedsEnclosure && (
                <li className="text-sm text-gray-700 leading-relaxed flex gap-2">
                  <span aria-hidden="true" className="text-violet-600 flex-shrink-0">
                    &bull;
                  </span>
                  {materials.find((m) => m.enclosure === 'Required')?.category} needs an
                  enclosure. Without one it will warp, and no spool or setting fixes that.
                </li>
              )}
              {anyNeedsDrying && (
                <li className="text-sm text-gray-700 leading-relaxed flex gap-2">
                  <span aria-hidden="true" className="text-violet-600 flex-shrink-0">
                    &bull;
                  </span>
                  Buy vacuum-sealed with desiccant, and read{' '}
                  <Link
                    href="/how-to-dry-filament"
                    className="text-violet-800 hover:text-violet-900 underline underline-offset-4"
                  >
                    how to dry filament
                  </Link>{' '}
                  before the first failed print rather than after it.
                </li>
              )}
              <li className="text-sm text-gray-700 leading-relaxed flex gap-2">
                <span aria-hidden="true" className="text-violet-600 flex-shrink-0">
                  &bull;
                </span>
                Check the published diameter tolerance. &plusmn;0.02mm is good; &plusmn;0.05mm
                shows up as inconsistent extrusion whatever you paid.
              </li>
            </ul>
          </div>
        )}

        {AMAZON.status !== 'enrolled' && (
          <p className="mt-6 text-xs text-gray-500">
            We do not currently have an Amazon storefront link for this site, so there are no
            purchase links here. The guidance above is what decides the outcome; any reputable
            supplier meeting it will do.
          </p>
        )}
      </div>
    </section>
  );
}
