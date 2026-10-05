import type { MetadataRoute } from 'next';
import { MATERIAL_DATA_REVIEWED, MATERIAL_PROFILES } from '@/lib/materials';
import { WORKSHOP } from '@/lib/workshop';

/**
 * Sitemap.
 *
 * Three rules, all learned the hard way on this and sibling properties:
 *
 * 1. DERIVE, NEVER DUPLICATE. Material URLs come from MATERIAL_PROFILES, the
 *    same module the pages render from, so a new material appears here without
 *    anyone remembering to add it. Only the hand-authored static routes are
 *    listed literally, because each one is a file someone created on purpose.
 *
 * 2. A SITEMAP LISTS WHAT WE WANT INDEXED. The 1,000 /library/{cat}/{slug}
 *    catalogue entries are served with robots: noindex, so they are absent
 *    here on purpose. Submitting a noindexed URL asks Google to crawl a page
 *    only to be told to drop it. Their absence is not an oversight, and a
 *    completeness audit comparing the prerender manifest against this file
 *    should expect exactly that gap and no other.
 *
 * 3. LASTMOD IS A DATE SOMEONE TYPED, NOT THE BUILD TIME. This file used to
 *    stamp every URL with `new Date()`. The image-manifest job redeploys twice
 *    a day, so all 62 URLs claimed to change twice a day, and a date that is
 *    always "now" tells a crawler nothing. Each date below is the day that
 *    page's own content last changed. When you change what a page says, change
 *    its date here in the same commit. A metadata-only or styling change is not
 *    a content change and does not move the date.
 */

const BASE = 'https://www.printlog3d.com';

/** Every indexable hand-authored route. One entry per file under src/app. */
const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  /** YYYY-MM-DD. The day this page's content last changed. See rule 3. */
  lastModified: string;
}[] = [
  { path: '', priority: 1, changeFrequency: 'weekly', lastModified: '2026-10-04' },
  { path: '/library', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-08-30' },
  { path: '/3d-printing-cost-calculator', priority: 0.9, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/3d-printing-filament-guide', priority: 0.85, changeFrequency: 'monthly', lastModified: '2026-10-05' },
  { path: '/pla-vs-petg', priority: 0.85, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/abs-vs-petg', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/pla-vs-abs', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/how-to-dry-filament', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/3d-print-stringing', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/3d-printer-troubleshooting', priority: 0.85, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/asa-vs-abs', priority: 0.8, changeFrequency: 'monthly', lastModified: '2026-08-30' },
  { path: '/free-download', priority: 0.7, changeFrequency: 'monthly', lastModified: '2026-08-30' },
  { path: '/get-it-printed', priority: 0.75, changeFrequency: 'monthly', lastModified: '2026-10-04' },
  { path: '/workshop', priority: 0.85, changeFrequency: 'monthly', lastModified: '2026-08-30' },
  { path: '/recommended-gear', priority: 0.85, changeFrequency: 'monthly', lastModified: '2026-08-31' },
  { path: '/editorial-policy', priority: 0.55, changeFrequency: 'yearly', lastModified: '2026-08-31' },
  { path: '/disclosure', priority: 0.4, changeFrequency: 'yearly', lastModified: '2026-08-30' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly', lastModified: '2026-10-04' },
  { path: '/support', priority: 0.4, changeFrequency: 'yearly', lastModified: '2026-10-04' },
  // These two match the "Last updated" date each page prints.
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly', lastModified: '2026-10-05' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly', lastModified: '2026-10-05' },
];

/**
 * The day the shared material template last changed what every material page
 * says. All 31 pages render from it, so one date covers them.
 */
const MATERIAL_TEMPLATE_CHANGED = '2026-10-04';

/**
 * A material page changes when its figures are re-reviewed or when the template
 * changes, whichever came last. ISO dates compare correctly as strings.
 */
const MATERIAL_LAST_MODIFIED =
  MATERIAL_DATA_REVIEWED > MATERIAL_TEMPLATE_CHANGED
    ? MATERIAL_DATA_REVIEWED
    : MATERIAL_TEMPLATE_CHANGED;

/** The day the workshop resources in src/lib/workshop.ts last changed. */
const WORKSHOP_LAST_MODIFIED = '2026-08-30';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency, lastModified }) => ({
      url: `${BASE}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })),
    ...MATERIAL_PROFILES.map((m) => ({
      url: `${BASE}/library/${m.slug}`,
      lastModified: MATERIAL_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    // Derived, so a new workshop resource is listed without a manual edit.
    ...WORKSHOP.map((r) => ({
      url: `${BASE}/workshop/${r.slug}`,
      lastModified: WORKSHOP_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
