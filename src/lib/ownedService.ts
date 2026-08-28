import type { MaterialProfile } from './materials';

/**
 * 3DPrinterOnDemand capability gate.
 *
 * 3DPrinterOnDemand.com is another Anvil Road property. That relationship is
 * disclosed wherever it is linked, and it is never presented as an independent
 * recommendation.
 *
 * OWNING A SERVICE DOES NOT MAKE IT THE RIGHT ANSWER.
 * ---------------------------------------------------
 * The audit that produced this file turned up something that cuts against the
 * obvious plan: the materials a PrintLog3D reader most often cannot print at
 * home - PEEK, polycarbonate, plain nylon - are precisely the ones the owned
 * service does NOT offer. It is FDM only, capped at 220mm per side, US shipping.
 *
 * So the owned route does not displace Xometry on the advanced-material escape
 * hatch. It answers a different question. Xometry stays first where it is
 * genuinely the better answer, which is what "authority outranks margin" means
 * in practice.
 *
 * Where the owned service is genuinely strong is the everyday case: PLA and PETG
 * with an instant automated quote, where the reader's problem is not "I cannot
 * print this" but "I do not want to print this again" or "I need fifty of them".
 *
 * EVIDENCE: capability audit 2026-08-24 against the live site and the
 * `3dpod/storefront` repo. Source of truth is `src/lib/quote/materials.ts` in
 * that repo, where each material carries mode "instant" or "rfq". Anything
 * absent from that array is NOT_SUPPORTED here, and absence is treated as a
 * negative rather than an unknown, because the array is the thing the quote
 * engine actually reads.
 */

export type CapabilityState = 'SUPPORTED' | 'CONDITIONAL' | 'NOT_SUPPORTED' | 'UNKNOWN';

export const OWNED_SERVICE = {
  name: '3DPrinterOnDemand',
  domain: '3dprinterondemand.com',
  url: 'https://www.3dprinterondemand.com/',
  quoteUrl: 'https://www.3dprinterondemand.com/instant-quote',
  /** Stated plainly wherever the service is linked. */
  relationship: 'Another Anvil Road property, so we have a commercial interest in it.',
  maxDimensionMm: 220,
  process: 'FDM',
  shipsTo: 'United States',
  fileTypes: ['STL', '3MF', 'STEP', 'OBJ'],
} as const;

/**
 * Per-material capability. `instant` materials price automatically at checkout;
 * `rfq` materials are genuinely printed but only through a slower human quote.
 */
const CAPABILITY: Record<string, CapabilityState> = {
  PLA: 'SUPPORTED',
  PETG: 'SUPPORTED',
  // Real, but human-quoted rather than instantly priced.
  ABS: 'CONDITIONAL',
  'PA-CF': 'CONDITIONAL',
  // Everything below is absent from the quote engine's material array.
  ASA: 'NOT_SUPPORTED',
  PC: 'NOT_SUPPORTED',
  PEEK: 'NOT_SUPPORTED',
  HIPS: 'NOT_SUPPORTED',
  PCTG: 'NOT_SUPPORTED',
  'PETG-CF': 'NOT_SUPPORTED',
  CPE: 'NOT_SUPPORTED',
  'Nylon PA6': 'NOT_SUPPORTED',
  'Nylon PA12': 'NOT_SUPPORTED',
  // PLA variants are not separately listed by the quote engine. The engine
  // offers "PLA" with a colour choice, which is not the same thing as offering
  // a wood-filled or metal-filled compound, so these are not claimed.
  'PLA Matte': 'NOT_SUPPORTED',
  'PLA Silk': 'NOT_SUPPORTED',
  'PLA Wood': 'NOT_SUPPORTED',
  'PLA Metal': 'NOT_SUPPORTED',

  // Added 2026-08-28. TPU was found CONDITIONAL by the capability audit and had
  // no page to attach to until now; it does.
  TPU: 'CONDITIONAL',
  TPE: 'NOT_SUPPORTED',
  PVA: 'NOT_SUPPORTED',
  PP: 'NOT_SUPPORTED',
  PVB: 'NOT_SUPPORTED',
  'PLA-CF': 'NOT_SUPPORTED',
  'PA-GF': 'NOT_SUPPORTED',
  'ASA-CF': 'NOT_SUPPORTED',
  PEI: 'NOT_SUPPORTED',
  PPS: 'NOT_SUPPORTED',
  'Conductive PLA': 'NOT_SUPPORTED',
  'Glow PLA': 'NOT_SUPPORTED',
  'Magnetic PLA': 'NOT_SUPPORTED',
};

export function capabilityFor(m: MaterialProfile): CapabilityState {
  return CAPABILITY[m.category] ?? 'UNKNOWN';
}

/** Only SUPPORTED and CONDITIONAL materials may show an owned-service CTA. */
export function canOfferOwnedService(m: MaterialProfile): boolean {
  const c = capabilityFor(m);
  return c === 'SUPPORTED' || c === 'CONDITIONAL';
}

/** Materials the owned service prints, for the /get-it-printed hub. */
export function ownedServiceMaterials(): { category: string; state: CapabilityState }[] {
  return Object.entries(CAPABILITY)
    .filter(([, v]) => v === 'SUPPORTED' || v === 'CONDITIONAL')
    .map(([category, state]) => ({ category, state }));
}
