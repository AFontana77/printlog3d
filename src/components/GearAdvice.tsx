import { isEnrolled, affiliateLinkProps } from '@/lib/affiliateLinks';
import { ExternalLink } from 'lucide-react';

/**
 * Buying guidance for the gear a material actually requires.
 *
 * TAG GATING - read before adding links.
 * -------------------------------------
 * printlog3d.com has no Amazon Associates tracking ID. Every other monetised
 * property in the portfolio has its own (homesteadgr-20, digpicframe-20, and
 * so on) and a site must never borrow another site's tag.
 *
 * Until this site's own tag exists, `isEnrolled('amazon')` is false and this
 * component renders specification guidance with no outbound link. That is
 * deliberate:
 *
 *  - an untagged Amazon link earns nothing and hands the traffic away free;
 *  - the previous library template shipped exactly that, on 1,000 pages;
 *  - it also claimed in print that the site "participates in the Amazon
 *    Associates program", which was not true.
 *
 * The guidance below is useful with or without a link, which is the point. When
 * the tag lands, set programs.amazon.status to "enrolled" and put the real
 * tracking ID in tracking_value in src/data/affiliateLinks.json. Nothing else
 * has to change: the links appear, already carrying the tag and already wired
 * to the affiliate_click tracker.
 */

export type GearSpec = {
  /** What to buy, as a category. Never a specific unnamed-but-implied product. */
  category: string;
  /** The number that decides whether a given unit will work. */
  requirement: string;
  /** Why that requirement matters, in one line. */
  why: string;
  /** Amazon search terms. Only ever used once a tracking tag exists. */
  searchTerms: string;
};

export function GearAdvice({
  items,
  heading,
  intro,
}: {
  items: GearSpec[];
  heading: string;
  intro: string;
}) {
  if (items.length === 0) return null;
  const enrolled = isEnrolled('amazon');

  return (
    <section className="py-14 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{heading}</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">{intro}</p>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.category} className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-1">{item.category}</h3>
              <p className="text-sm text-violet-800 font-medium mb-2">{item.requirement}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.why}</p>
              {enrolled && (
                <a
                  {...affiliateLinkProps('amazon', `/s?k=${encodeURIComponent(item.searchTerms)}`)}
                  target="_blank"
                  rel="nofollow noopener noreferrer sponsored"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-violet-800 hover:text-violet-900 min-h-[44px]"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  See {item.category.toLowerCase()} on Amazon
                </a>
              )}
            </div>
          ))}
        </div>

        {enrolled && (
          <p className="mt-4 text-xs text-gray-500">
            As an Amazon Associate we earn from qualifying purchases. Links above are affiliate links,
            and using them costs you nothing extra.
          </p>
        )}
      </div>
    </section>
  );
}
