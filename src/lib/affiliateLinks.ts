import affiliateLinksData from "@/data/affiliateLinks.json";

export type AffiliateStatus = "pending" | "queued_signup" | "enrolled" | "declined";

export type AffiliateProgram = {
  brand: string;
  base_url: string;
  tracking_param: string;
  tracking_value: string;
  status: AffiliateStatus;
  network: string;
  commission: string;
  cookie: string;
  notes: string;
};

export type AffiliateLinksData = {
  _meta: {
    purpose: string;
    format_note: string;
    last_updated: string;
    session: string;
  };
  programs: Record<string, AffiliateProgram>;
};

const data = affiliateLinksData as AffiliateLinksData;

export function getAffiliateProgram(id: string): AffiliateProgram | undefined {
  return data.programs[id];
}

export function resolveAffiliateUrl(id: string, deepLinkPath?: string): string {
  const program = data.programs[id];
  if (!program) return "#";
  const base = deepLinkPath
    ? `${program.base_url}${deepLinkPath.startsWith("/") ? "" : "/"}${deepLinkPath}`
    : program.base_url;
  try {
    const url = new URL(base);
    url.searchParams.set(program.tracking_param, program.tracking_value);
    return url.toString();
  } catch {
    return base;
  }
}

export function isEnrolled(id: string): boolean {
  const program = data.programs[id];
  return program?.status === "enrolled";
}

/**
 * Returns props ready to spread onto an `<a>` element. Includes resolved
 * href plus `data-affiliate-*` attributes used by `<AffiliateClickTracker />`
 * to fire `affiliate_click` events into the GTM dataLayer.
 *
 * Usage: `<a {...affiliateLinkProps("marcus", "/us/en/savings")} target="_blank" rel="nofollow noopener noreferrer sponsored">Open Marcus</a>`
 */
export function affiliateLinkProps(
  id: string,
  deepLinkPath?: string,
): {
  href: string;
  "data-affiliate-brand": string;
  "data-affiliate-network": string;
} {
  const program = data.programs[id];
  return {
    href: resolveAffiliateUrl(id, deepLinkPath),
    "data-affiliate-brand": id,
    "data-affiliate-network": program?.network ?? "unknown",
  };
}
