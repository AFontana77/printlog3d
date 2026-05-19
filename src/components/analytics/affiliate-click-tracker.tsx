"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Global click listener for affiliate outbound links.
 *
 * Listens for clicks on any `<a data-affiliate-brand="...">` element and
 * pushes an `affiliate_click` event to the GTM dataLayer with brand + network
 * + destination URL. GTM picks up the event and forwards to GA4.
 *
 * Pages opt in by spreading `affiliateLinkProps(id)` onto their anchor tags
 * (see `src/lib/affiliateLinks.ts`). Pages that still use the bare
 * `resolveAffiliateUrl()` href pattern don't fire events until they migrate.
 *
 * Paired with: orchestration/decisions/AFFILIATE_CLICK_MONITORING_2026-05-16.md
 */
export function AffiliateClickTracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest("a[data-affiliate-brand]") as HTMLAnchorElement | null;
      if (!link) return;

      const brand = link.getAttribute("data-affiliate-brand") ?? "unknown";
      const network = link.getAttribute("data-affiliate-network") ?? "unknown";
      const channelSid = link.getAttribute("data-affiliate-channel-sid") ?? "";

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "affiliate_click",
        affiliate_brand: brand,
        affiliate_network: network,
        channel_sid: channelSid,
        destination_url: link.href,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
