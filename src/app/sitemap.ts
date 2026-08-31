import type { MetadataRoute } from 'next';
import { MATERIAL_PROFILES } from '@/lib/materials';
import { WORKSHOP } from '@/lib/workshop';

/**
 * Sitemap.
 *
 * Two rules, both learned the hard way on sibling properties:
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
 */

const BASE = 'https://www.printlog3d.com';

/** Every indexable hand-authored route. One entry per file under src/app. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '', priority: 1, changeFrequency: 'weekly' },
  { path: '/library', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/3d-printing-filament-guide', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/pla-vs-petg', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/abs-vs-petg', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/pla-vs-abs', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/how-to-dry-filament', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/3d-print-stringing', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/3d-printer-troubleshooting', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/asa-vs-abs', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/free-download', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/get-it-printed', priority: 0.75, changeFrequency: 'monthly' },
  { path: '/workshop', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/recommended-gear', priority: 0.85, changeFrequency: 'monthly' },
  { path: '/disclosure', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/support', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...MATERIAL_PROFILES.map((m) => ({
      url: `${BASE}/library/${m.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    // Derived, so a new workshop resource is listed without a manual edit.
    ...WORKSHOP.map((r) => ({
      url: `${BASE}/workshop/${r.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
