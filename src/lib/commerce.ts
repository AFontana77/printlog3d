import { MATERIAL_PROFILES, type MaterialProfile } from './materials';
import affiliateLinksData from '@/data/affiliateLinks.json';

/**
 * Canonical commercial configuration for printlog3d.com.
 *
 * ONE PRINCIPLE DECIDES WHETHER A LINK RENDERS
 * --------------------------------------------
 * Render a merchant link when **the information is the value**. Withhold it when
 * **the link is the only value**.
 *
 *  - Amazon: a reader can reach Amazon themselves in two seconds. An untagged
 *    Amazon link adds nothing for them and earns nothing for us, so while the
 *    tracking tag is missing we render buying *guidance* and no link at all.
 *    This is also what shipped as a defect before: 1,000 pages carried untagged
 *    `amazon.com/s?k=` links that earned exactly zero.
 *  - Print services and specialist retailers: most readers do not know these
 *    exist. Naming them IS the answer to "my printer cannot do this". Those
 *    render as plain editorial links today, with no tracking parameters and no
 *    affiliate disclosure, because there is no relationship to disclose. If a
 *    programme is joined later, the same route gains tracking without the copy
 *    changing.
 *
 * MERCHANT STATUS
 * ---------------
 *   pending    - relationship intended, not active. No link rendered.
 *   editorial  - no affiliate relationship. Plain link, no tracking, no
 *                disclosure. Recommended purely on merit.
 *   enrolled   - active affiliate relationship. Tracked link + disclosure +
 *                affiliate_click instrumentation.
 *
 * Flipping a merchant to `enrolled` and adding its tracking value is the entire
 * activation step. No component changes.
 */

export type MerchantStatus = 'pending' | 'editorial' | 'enrolled';

export type Merchant = {
  id: string;
  name: string;
  status: MerchantStatus;
  /** Shown in the disclosure only when status is 'enrolled'. */
  disclosureName?: string;
  network?: string;
};

const amazonProgram = (
  affiliateLinksData as { programs: Record<string, { status: string; tracking_value: string }> }
).programs.amazon;

/** Amazon is driven by affiliateLinks.json so activation stays a one-file change. */
export const AMAZON: Merchant = {
  id: 'amazon',
  name: 'Amazon',
  status: amazonProgram?.status === 'enrolled' && amazonProgram?.tracking_value
    ? 'enrolled'
    : 'pending',
  disclosureName: 'Amazon Associates',
  network: 'amazon',
};

export function amazonTag(): string {
  return amazonProgram?.tracking_value || '';
}

export function amazonSearchUrl(terms: string | null): string | null {
  if (!terms) return null;
  if (AMAZON.status !== 'enrolled') return null;
  const tag = amazonTag();
  if (!tag) return null;
  return `https://www.amazon.com/s?k=${encodeURIComponent(terms)}&tag=${encodeURIComponent(tag)}`;
}

// ---------------------------------------------------------------------------
// Filament sourcing
// ---------------------------------------------------------------------------

/**
 * Where a reader should actually buy each material.
 *
 * `commodity`    - Amazon stocks this well. Amazon is the primary route.
 * `specialist`   - Amazon coverage is thin or unreliable. A specialist retailer
 *                  is the better primary, Amazon a reasonable fallback.
 * `engineering`  - Amazon is not a serious source. Specialist only, and the
 *                  reader may be better served by a print service (see below).
 */
export type Sourcing = 'commodity' | 'specialist' | 'engineering';

const SOURCING: Record<string, Sourcing> = {
  PLA: 'commodity',
  'PLA Matte': 'commodity',
  'PLA Silk': 'commodity',
  'PLA Wood': 'commodity',
  'PLA Metal': 'commodity',
  PETG: 'commodity',
  PCTG: 'commodity',
  ABS: 'commodity',
  ASA: 'commodity',
  HIPS: 'commodity',
  'PETG-CF': 'specialist',
  CPE: 'specialist',
  'Nylon PA12': 'specialist',
  'Nylon PA6': 'specialist',
  'PA-CF': 'engineering',
  PC: 'engineering',
  PEEK: 'engineering',
};

export function sourcingFor(m: MaterialProfile): Sourcing {
  return SOURCING[m.category] ?? 'specialist';
}

/**
 * Amazon search terms for the material itself.
 *
 * Deliberately describes the material and diameter rather than naming a brand.
 * The catalogue this site used to publish invented brand-plus-material products
 * that do not exist; recommending "PETG filament 1.75mm" cannot repeat that
 * mistake, and it does not pretend one manufacturer is universally best.
 */
export function filamentSearchTerms(m: MaterialProfile): string | null {
  // Verified against the live Amazon catalogue on 2026-08-24. Overrides exist
  // only where the default pattern returned the wrong material.
  const OVERRIDES: Record<string, string | null> = {
    // "cpe filament 1.75mm" returns TPU and PLA. "CPE 3D printer filament"
    // returns four PLA listings. Amazon does not stock this material under any
    // name a reader would search, so it gets no Amazon link at all.
    CPE: null,
    // The default returned a carbon-fibre nylon in second place. This returns
    // genuine PEEK throughout.
    PEEK: 'PEEK 3D printer filament',
  };
  if (m.category in OVERRIDES) return OVERRIDES[m.category];
  return `${m.category.toLowerCase()} filament 1.75mm`;
}

// ---------------------------------------------------------------------------
// Specialist retailers
// ---------------------------------------------------------------------------

export type Retailer = {
  id: string;
  name: string;
  url: string;
  status: MerchantStatus;
  /** Why this retailer, specifically, for this class of material. */
  why: string;
};

/**
 * Named on merit, linked editorially. No affiliate relationship exists with any
 * of these today, so no tracking is added and none is disclosed.
 */
export const SPECIALIST_RETAILERS: Retailer[] = [
  {
    id: 'matterhackers',
    name: 'MatterHackers',
    url: 'https://www.matterhackers.com/',
    status: 'editorial',
    why: 'Deep engineering-material catalogue and published spec sheets, including grades general retailers do not stock.',
  },
  {
    id: 'printedsolid',
    name: 'Printed Solid',
    url: 'https://www.printedsolid.com/',
    status: 'editorial',
    why: 'Specialist stockist with strong coverage of nylon and carbon-fibre filled materials.',
  },
];

// ---------------------------------------------------------------------------
// Print services — the escape hatch
// ---------------------------------------------------------------------------

export type PrintService = {
  id: string;
  name: string;
  url: string;
  status: MerchantStatus;
  note: string;
  /**
   * Materials this service is CONFIRMED to offer, verified against its own
   * capability pages on 2026-08-24. A service is never shown on a material
   * absent from this list, because "they probably do it" is exactly the
   * invented-compatibility failure the governance forbids.
   */
  confirmedMaterials: string[];
};

/**
 * For readers whose own machine cannot run the material. Editorial links: there
 * is no affiliate relationship with any of these, and none is claimed.
 *
 * Ordering is by verified material coverage, not by commercial value. Xometry
 * leads because it is confirmed on all three engineering materials, despite
 * having discontinued its referral programme in August 2024 and therefore being
 * worth nothing to us commercially. Recommending it first anyway is the point.
 */
export const PRINT_SERVICES: PrintService[] = [
  {
    id: 'xometry',
    name: 'Xometry',
    url: 'https://www.xometry.com/',
    status: 'editorial',
    note: 'Industrial supplier with the widest confirmed engineering-material range, including certified work.',
    // Nylon PA6 is deliberately absent: the capability page confirms Nylon 12CF,
    // which is PA12, not PA6. Close is not confirmed.
    confirmedMaterials: ['PEEK', 'PA-CF', 'PC', 'Nylon PA12'],
  },
  {
    id: 'jlc3dp',
    name: 'JLC3DP',
    url: 'https://jlc3dp.com/',
    status: 'editorial',
    note: 'Low-cost industrial capacity. Usually the cheapest route for a one-off part.',
    confirmedMaterials: ['PEEK', 'PA-CF', 'Nylon PA12'],
  },
  {
    id: 'treatstock',
    name: 'Treatstock',
    url: 'https://www.treatstock.com/',
    status: 'editorial',
    note: 'Marketplace of independent print shops, so pricing varies more and availability depends on the individual shop.',
    confirmedMaterials: ['PC'],
  },
];

/** Services confirmed to offer this specific material. May be empty. */
export function servicesFor(m: MaterialProfile): PrintService[] {
  return PRINT_SERVICES.filter((s) => s.confirmedMaterials.includes(m.category));
}

/**
 * Does this material warrant offering a print service?
 *
 * Only where the honest answer to "can I print this at home" is often no, AND
 * we have at least one service confirmed to offer it. Not offered on beginner or
 * intermediate materials, where the reader's own printer is the right tool and
 * sending them elsewhere would be a disservice.
 */
export function needsServiceRoute(m: MaterialProfile): boolean {
  const hard = m.difficulty === 'Expert' || m.difficulty === 'Advanced';
  return hard && servicesFor(m).length > 0;
}

/** Expert materials get a stronger framing than Advanced ones. */
export function serviceFraming(m: MaterialProfile): 'cannot' | 'probably-not' {
  return m.difficulty === 'Expert' ? 'cannot' : 'probably-not';
}

// ---------------------------------------------------------------------------
// Disclosure
// ---------------------------------------------------------------------------

/**
 * The disclosure must describe relationships that actually exist. Naming a
 * programme we have merely applied to would be the same class of falsehood as
 * the "PrintLog3D participates in the Amazon Associates program" line that used
 * to sit on 1,000 pages while the tracking value was still a placeholder.
 */
export function activeAffiliateMerchants(): Merchant[] {
  return [AMAZON].filter((m) => m.status === 'enrolled');
}

export function hasAnyAffiliateRelationship(): boolean {
  return activeAffiliateMerchants().length > 0;
}

/** Materials needing a dryer, for the drying guide's commercial section. */
export function dryingMaterials(): MaterialProfile[] {
  return MATERIAL_PROFILES.filter((m) => m.needsDrying);
}

/** The hottest drying temperature any documented material needs. */
export function maxDryingTempC(): number {
  let max = 0;
  for (const m of MATERIAL_PROFILES) {
    const match = m.drying.match(/(\d+)(?:-(\d+))?C/);
    if (!match) continue;
    const t = Number(match[2] ?? match[1]);
    if (t > max) max = t;
  }
  return max;
}
