import type { MetadataRoute } from 'next';
import { getAllFilaments, getCategories, toSlug } from '@/lib/items';

const BASE = 'https://www.printlog3d.com';
const now = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, filaments] = await Promise.all([
    getCategories(),
    getAllFilaments(),
  ]);

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE}/library/${toSlug(cat.category)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const filamentUrls: MetadataRoute.Sitemap = filaments.map((f) => ({
    url: `${BASE}/library/${toSlug(f.category)}/${toSlug(f.name)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/library`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...categoryUrls,
    ...filamentUrls,
    { url: `${BASE}/pla-vs-petg`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/3d-printing-filament-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/abs-vs-petg`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/pla-vs-abs`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/how-to-dry-filament`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/3d-print-stringing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/free-download`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/support`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
