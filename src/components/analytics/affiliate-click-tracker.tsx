"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    google_tag_manager?: Record<string, unknown>;
  }
}

/**
 * Anvil Road portfolio analytics contract (MEASURE M0.1, 2026-08-19).
 *
 * ONE delegated document-level listener instruments every monetizable outbound
 * click on the site. It replaces the previous tracker, which only fired on
 * `a[data-affiliate-brand]` (an attribute almost no anchor carried) and only
 * pushed to `dataLayer` -- where nothing consumed it, because no GTM container
 * in the portfolio has a GA4 event tag. Those events never reached GA4.
 *
 * Events emitted (GA4 recommended names where one applies):
 *   affiliate_click   outbound click to a known affiliate network
 *   app_store_click   outbound click to the App Store or Google Play
 *   kdp_click         outbound click to an Amazon book listing
 *   sign_up           email capture form submitted (method = email_capture)
 *   generate_lead     lead / quote form submitted
 *
 * Delivery is deliberately dual-path:
 *
 *   1. `dataLayer.push({event: ...})` -- the durable GTM contract. A GA4 event
 *      tag on a Custom Event trigger picks this up. Nothing here depends on
 *      that tag existing.
 *   2. A gtag command pushed onto the SAME dataLayer, addressed with `send_to`
 *      to the GA4 measurement ID that the site's GTM container already loads.
 *      gtag.js is already on the page (GTM's Google tag loads it), so this
 *      delivers to GA4 immediately without a container change and WITHOUT
 *      installing a second Google tag.
 *
 * The measurement ID is discovered at runtime from `window.google_tag_manager`,
 * so this file is byte-identical across every repo -- no per-site config to
 * drift. Pass `measurementId` only to override.
 *
 * Reserved-parameter warning (verified live against G-PBMRT31014 on
 * 2026-08-19, do not "tidy" these names):
 *   - `tracking_id` is consumed by gtag as the destination property and
 *     REWRITES `tid`. Sending it silently ships the hit to a property that does
 *     not exist. The Amazon store tag travels as `affiliate_tag`.
 *   - `page_path` is a legacy Universal Analytics field and is silently
 *     dropped. The page travels as `source_path`.
 */

type Ev = Record<string, string | number | boolean | undefined>;

const AFFILIATE_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)amazon\.[a-z.]+$|(^|\.)amzn\.to$/i, "amazon"],
  [/(^|\.)linksynergy\.com$|(^|\.)rakuten\.com$|(^|\.)rakutenmarketing\.com$/i, "rakuten"],
  [/(^|\.)(anrdoezrs|dpbolvw|jdoqocy|kqzyfj|tkqlhce|emjcd|ftjcfx|lduhtrp|awltovhc)\.net$/i, "cj"],
  [/(^|\.)cj\.com$|(^|\.)commission-junction\.com$/i, "cj"],
  [/(^|\.)awin1\.com$|(^|\.)awin\.com$|(^|\.)zenaps\.com$/i, "awin"],
  [/\.pxf\.io$|\.sjv\.io$|\.ojrq\.net$|(^|\.)impact\.com$/i, "impact"],
  [/(^|\.)shareasale\.com$|(^|\.)shrsl\.com$/i, "shareasale"],
  [/(^|\.)partnerstack\.com$|(^|\.)pscreator\.io$/i, "partnerstack"],
  [/(^|\.)clickbank\.net$|(^|\.)hop\.clickbank\.net$/i, "clickbank"],
  [/(^|\.)ebay\.com$|(^|\.)rover\.ebay\.com$/i, "ebay"],
  [/(^|\.)flexoffers\.com$|(^|\.)track\.flexlinks\.com$/i, "flexoffers"],
  [/(^|\.)skimresources\.com$|(^|\.)go\.skimresources\.com$/i, "skimlinks"],
];

const APP_STORE_HOSTS: Array<[RegExp, string]> = [
  [/(^|\.)apps\.apple\.com$|(^|\.)itunes\.apple\.com$/i, "ios"],
  [/(^|\.)play\.google\.com$/i, "android"],
];

const ASIN_RE = /\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i;
const ISBN10_RE = /^\d{9}[\dX]$/i;

function truncate(s: string, n: number): string {
  s = (s || "").replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n) : s;
}

function networkFor(host: string): string | null {
  for (const [re, name] of AFFILIATE_HOSTS) if (re.test(host)) return name;
  return null;
}

/** Merchant identity, only where the destination genuinely identifies it. */
function merchantFor(network: string, url: URL): string {
  if (network === "amazon") return "amazon";
  if (network === "ebay") return "ebay";
  const q = url.searchParams;
  if (network === "rakuten") return q.get("murl") ? hostOf(q.get("murl")!) : (q.get("mid") || "UNKNOWN");
  if (network === "cj") return q.get("url") ? hostOf(q.get("url")!) : "UNKNOWN";
  if (network === "awin") return q.get("ued") ? hostOf(q.get("ued")!) : (q.get("merchant") || "UNKNOWN");
  if (network === "impact" || network === "shareasale" || network === "partnerstack") {
    return q.get("u") || q.get("urllink") ? hostOf(q.get("u") || q.get("urllink")!) : "UNKNOWN";
  }
  return "UNKNOWN";
}

function hostOf(raw: string): string {
  try {
    return new URL(decodeURIComponent(raw)).hostname.replace(/^www\./, "");
  } catch {
    return "UNKNOWN";
  }
}

function measurementId(explicit?: string): string | undefined {
  if (explicit) return explicit;
  const g = typeof window !== "undefined" ? window.google_tag_manager : undefined;
  if (!g) return undefined;
  return Object.keys(g).find((k) => /^G-[A-Z0-9]{6,}$/.test(k));
}

export function AffiliateClickTracker({ measurementId: mid }: { measurementId?: string } = {}) {
  useEffect(() => {
    // gtag.js consumes dataLayer entries that are real `arguments` objects,
    // not arrays. The IIFE below is what produces one.
    const gtagCmd = (...args: unknown[]) => {
      window.dataLayer = window.dataLayer || [];
      (function () {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      })(...(args as []));
    };

    const send = (name: string, params: Ev) => {
      const base: Ev = {
        site_domain: window.location.hostname.replace(/^www\./, ""),
        source_path: window.location.pathname,
        ...params,
      };
      window.dataLayer = window.dataLayer || [];
      // 1. GTM contract: a Custom Event trigger can pick this up.
      window.dataLayer.push({ event: name, ...base });
      // 2. Direct to the GA4 property GTM already loads. No second Google tag.
      const id = measurementId(mid);
      if (id) gtagCmd("event", name, { send_to: id, ...base });
    };

    const onClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      const a = t?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;

      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (!/^https?:$/.test(url.protocol)) return;

      const host = url.hostname.replace(/^www\./, "");
      if (host === window.location.hostname.replace(/^www\./, "")) return; // internal

      const linkText = truncate(a.innerText || a.getAttribute("aria-label") || "", 100);
      const placement =
        a.getAttribute("data-placement") ||
        a.closest("[data-placement]")?.getAttribute("data-placement") ||
        a.closest("section,article,footer,header,nav")?.tagName?.toLowerCase() ||
        "UNKNOWN";

      // --- App Store / Google Play -------------------------------------
      for (const [re, platform] of APP_STORE_HOSTS) {
        if (re.test(host)) {
          const appId =
            url.searchParams.get("id") ||
            (url.pathname.match(/\/id(\d+)/) || [])[1] ||
            (url.pathname.match(/\/app\/([^/?#]+)/) || [])[1] ||
            "UNKNOWN";
          send("app_store_click", {
            app_platform: platform, store_app_id: appId,
            destination_host: host, link_text: linkText, placement,
          });
          return;
        }
      }

      const network = networkFor(host);

      // Not a known affiliate network. Still worth measuring: many portfolio
      // CTAs are bare merchant links carrying no affiliate parameter at all
      // (verified on homesteadinggear.com/best-freeze-dryer, 2026-08-19, where
      // every "Buy at ..." button points straight at the merchant). Those
      // clicks are real commercial intent leaving the site unmonetized, and
      // they are invisible unless something records them. They are NOT called
      // affiliate_click, because no affiliate relationship exists.
      if (!network) {
        send("outbound_click", {
          destination_host: host,
          link_text: linkText,
          link_rel: a.getAttribute("rel") || "",
          placement,
        });
        return;
      }

      const asin = (url.href.match(ASIN_RE) || [])[1]?.toUpperCase();
      const declaredKdp =
        a.getAttribute("data-link-type") === "kdp" ||
        a.getAttribute("data-affiliate-type") === "kdp";

      // --- KDP book ------------------------------------------------------
      if (network === "amazon" && (declaredKdp || (asin && ISBN10_RE.test(asin)))) {
        send("kdp_click", {
          book_asin: asin || "UNKNOWN",
          affiliate_tag: url.searchParams.get("tag") || "UNKNOWN",
          destination_host: host, link_text: linkText, placement,
        });
        return;
      }

      // --- Affiliate ------------------------------------------------------
      send("affiliate_click", {
        network,
        merchant:
          a.getAttribute("data-affiliate-brand") ||
          a.getAttribute("data-affiliate-merchant") ||
          merchantFor(network, url),
        affiliate_tag:
          url.searchParams.get("tag") ||
          url.searchParams.get("id") ||
          a.getAttribute("data-affiliate-channel-sid") ||
          "UNKNOWN",
        product_id: asin || "UNKNOWN",
        destination_host: host,
        link_text: linkText,
        placement,
      });
    };

    const onSubmit = (e: Event) => {
      const f = e.target as HTMLFormElement | null;
      if (!f || f.tagName !== "FORM") return;
      const declared = f.getAttribute("data-analytics-event");
      if (declared) {
        send(declared, { form_id: f.id || f.getAttribute("name") || "UNKNOWN" });
        return;
      }
      const hasEmail = !!f.querySelector('input[type="email"]');
      const hasPassword = !!f.querySelector('input[type="password"]');
      if (!hasEmail || hasPassword) return; // not a capture form / is a login
      const fieldCount = f.querySelectorAll("input:not([type=hidden]),select,textarea").length;
      send(fieldCount > 2 ? "generate_lead" : "sign_up", {
        method: "email_capture",
        form_id: f.id || f.getAttribute("name") || "UNKNOWN",
      });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [mid]);

  return null;
}

export const PortfolioAnalytics = AffiliateClickTracker;
export default AffiliateClickTracker;
