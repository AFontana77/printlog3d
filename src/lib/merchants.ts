import affiliateLinksData from '@/data/affiliateLinks.json';

/**
 * Merchant-neutral affiliate layer.
 *
 * Amazon is this property's breadth default. It is not its only destination,
 * and the architecture must not assume it is — several of the materials
 * documented here are bought from specialists, and the honest recommendation is
 * sometimes a merchant that pays us nothing.
 *
 * THE RULE THIS ENFORCES
 * `affiliateUrl()` attaches tracking ONLY where the program is `enrolled` and a
 * tracking value exists. Everything else returns the plain destination
 * unchanged. So a pending program renders exactly the editorial link it renders
 * today, and there is no way to ship a half-configured affiliate link or a
 * fabricated partner ID: an empty `tracking_value` produces a clean URL rather
 * than `?ref=`.
 *
 * Activating a program is therefore a one-line change in
 * `src/data/affiliateLinks.json` — no page edit, no component edit, no risk of
 * one route being missed.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO
 * It does not rank merchants by commission. A direct program should win when it
 * is the better answer for the reader, not because it pays more, and an
 * independent supplier named on merit stays named on merit.
 */

export type ProgramStatus = 'pending' | 'queued_signup' | 'enrolled' | 'declined';
export type TrackingStyle = 'query' | 'path' | 'none';

export type Program = {
  key: string;
  brand: string;
  baseUrl: string;
  status: ProgramStatus;
  network: string;
  trackingParam: string;
  trackingStyle: TrackingStyle;
  trackingValue: string;
  commission: string;
  cookie: string;
  notes: string;
};

type RawProgram = {
  brand?: string;
  base_url?: string;
  status?: string;
  network?: string;
  tracking_param?: string;
  tracking_style?: string;
  tracking_value?: string;
  commission?: string;
  cookie?: string;
  notes?: string;
};

const RAW = (affiliateLinksData as { programs: Record<string, RawProgram> }).programs;

export const PROGRAMS: Record<string, Program> = Object.fromEntries(
  Object.entries(RAW).map(([key, p]) => [
    key,
    {
      key,
      brand: p.brand ?? key,
      baseUrl: p.base_url ?? '',
      status: (p.status as ProgramStatus) ?? 'pending',
      network: p.network ?? 'unconfirmed',
      trackingParam: p.tracking_param ?? '',
      trackingStyle: (p.tracking_style as TrackingStyle) ?? 'query',
      trackingValue: p.tracking_value ?? '',
      commission: p.commission ?? 'unknown',
      cookie: p.cookie ?? 'unknown',
      notes: p.notes ?? '',
    },
  ]),
);

export function programFor(key: string): Program | undefined {
  return PROGRAMS[key];
}

/** True only when tracking would actually be attached. */
export function isMonetised(key: string): boolean {
  const p = PROGRAMS[key];
  return Boolean(p && p.status === 'enrolled' && p.trackingParam && p.trackingValue);
}

/**
 * Destination URL with affiliate tracking where, and only where, it is real.
 *
 * Returns the destination untouched for a pending, declined or unconfigured
 * program. That is the safe direction: a plain link to a merchant we recommend
 * is honest, and a link carrying an invented partner ID is not.
 */
export function affiliateUrl(programKey: string, destination: string): string {
  const p = PROGRAMS[programKey];
  if (!p || !isMonetised(programKey)) return destination;

  if (p.trackingStyle === 'path') {
    return `${destination}${destination.includes('?') ? '&' : '?'}${p.trackingParam}=${encodeURIComponent(p.trackingValue)}`;
  }
  if (p.trackingStyle === 'none') return destination;

  try {
    const url = new URL(destination);
    url.searchParams.set(p.trackingParam, p.trackingValue);
    return url.toString();
  } catch {
    // A relative or malformed destination is not something to guess at.
    return destination;
  }
}

/**
 * What to disclose beside a link, derived from the program rather than typed
 * per page. `none` means the link earns us nothing and must not be dressed as
 * though it does.
 */
export type DisclosureType = 'affiliate' | 'owned-service' | 'none';

export function disclosureFor(programKey: string): DisclosureType {
  if (programKey === 'owned-service') return 'owned-service';
  return isMonetised(programKey) ? 'affiliate' : 'none';
}

export const DISCLOSURE_TEXT: Record<DisclosureType, string> = {
  affiliate: 'We may earn a commission if you buy through this link, at no extra cost to you.',
  'owned-service': 'Another Anvil Road property, so we have a commercial interest in it.',
  none: 'We have no commercial relationship here. This is an ordinary link.',
};

/** Programs a human still has to sign up for, for the milestone report. */
export function pendingPrograms(): Program[] {
  return Object.values(PROGRAMS).filter((p) => p.status !== 'enrolled');
}
