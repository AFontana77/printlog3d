'use client';

import { useEffect } from 'react';

/**
 * Emits `owned_service_click` for links to the Anvil Road print service.
 *
 * WHY THIS EXISTS SEPARATELY
 * --------------------------
 * `affiliate-click-tracker.tsx` is byte-identical across every property in the
 * portfolio, by design, so that no per-site drift can creep in. Adding an
 * owned-service branch to it would fork shared infrastructure for one property's
 * needs. This listener is property-local instead, and the shared tracker is left
 * untouched.
 *
 * WHY NOT JUST LET IT COUNT AS AN OUTBOUND CLICK
 * ----------------------------------------------
 * The shared tracker classifies by destination host, so a 3dprinterondemand.com
 * link would land in `outbound_click` alongside genuinely third-party traffic.
 * That would quietly mix owned-service demand into the "commercial intent
 * leaving unmonetised" signal, which is the exact number used to decide whether
 * to join an affiliate programme. Keeping them apart keeps both honest.
 *
 * It is also NOT an `affiliate_click`: there is no affiliate relationship and no
 * commission. It is first-party demand for a sister business.
 *
 * The shared tracker will still fire its own `outbound_click` for these links.
 * That is acceptable and deliberate: `owned_service_click` is the metric to
 * report on, and double counting is corrected by filtering on the event name
 * rather than by suppressing a shared listener this file does not own.
 */

type Payload = Record<string, string | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function OwnedServiceTracker({ measurementId }: { measurementId?: string }) {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-event="owned_service_click"]',
      );
      if (!el) return;

      const payload: Payload = {
        site_domain: window.location.hostname.replace(/^www\./, ''),
        source_path: window.location.pathname,
        destination: el.getAttribute('data-owned-service') ?? 'unknown',
        capability_state: el.getAttribute('data-capability') ?? 'UNKNOWN',
        material: el.getAttribute('data-material') ?? 'none',
        placement:
          el.closest('[data-placement]')?.getAttribute('data-placement') ?? 'UNKNOWN',
        content_family: contentFamily(window.location.pathname),
      };

      const dl = (window.dataLayer = window.dataLayer || []);
      dl.push({ event: 'owned_service_click', ...payload });

      // Same dual-path delivery the shared tracker uses: a gtag command on the
      // same dataLayer, addressed to the GA4 property GTM already loads, so this
      // needs no container change.
      const id = measurementId ?? discoverMeasurementId();
      if (id) dl.push(['event', 'owned_service_click', { ...payload, send_to: id }]);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [measurementId]);

  return null;
}

function contentFamily(path: string): string {
  if (path.startsWith('/library/') && path.split('/').length > 3) return 'catalogue-entry';
  if (path.startsWith('/library/')) return 'material';
  if (path === '/library') return 'material-index';
  if (path.includes('-vs-')) return 'comparison';
  if (path === '/free-download') return 'lead-magnet';
  if (path === '/get-it-printed') return 'service-hub';
  if (path === '/') return 'home';
  return 'guide';
}

function discoverMeasurementId(): string | undefined {
  const gtm = (window as unknown as { google_tag_manager?: Record<string, unknown> })
    .google_tag_manager;
  if (!gtm) return undefined;
  return Object.keys(gtm).find((k) => /^G-/.test(k));
}
