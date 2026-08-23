const SUPABASE_URL = 'https://yypztrtmikyksjrsipzy.supabase.co';
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cHp0cnRtaWt5a3NqcnNpcHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTY0MDYsImV4cCI6MjA5MTkzMjQwNn0.bg4qwTqwra8iAl3X88ZN8jGcfZeFASUFpz1zo75N5aw';

const SKIN_ID = '3dprint';

/**
 * Shape of the `data` blob as it actually exists in the `items` table for
 * skin_id=3dprint. The previous declaration named five fields that the table
 * has never had (print_temp_c_range, speed_mm_s, cost_per_kg_usd,
 * colors_available, notes), so every consumer silently read `undefined` and
 * fell back to hardcoded defaults. Print temperature - the single most useful
 * number here - was in the row and never rendered.
 *
 * price_usd is deliberately NOT surfaced as a product price. See
 * MATERIAL_PROFILES for why: the stored figures are not sourced and are wrong
 * by more than an order of magnitude on the engineering materials.
 */
export type FilamentData = {
  brand?: string;
  grade?: string;
  diameter?: string;
  material?: string;
  price_usd?: string;
  bed_temp_c?: string | number;
  retraction?: string;
  cooling_fan?: string;
  print_temp_c?: string;
  material_full?: string;
  spool_weight_kg?: string | number;
  country_of_origin?: string;
  enclosure_required?: string;
};

export type FilamentItem = {
  name: string;
  category: string;
  subcategory: string;
  description: string | null;
  image_url: string | null;
  source_url: string | null;
  source_name: string | null;
  rating: number | null;
  data: FilamentData | null;
};

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

export async function getAllFilaments(): Promise<FilamentItem[]> {
  const url = `${SUPABASE_URL}/rest/v1/items?skin_id=eq.${SKIN_ID}&select=name,category,subcategory,description,image_url,source_url,source_name,rating,data&order=category.asc,name.asc&limit=1000`;
  const res = await fetch(url, { headers, cache: 'force-cache' });
  if (!res.ok) throw new Error(`Supabase fetch error: ${res.status}`);
  return res.json() as Promise<FilamentItem[]>;
}

export async function getFilamentsByCategory(category: string): Promise<FilamentItem[]> {
  const all = await getAllFilaments();
  return all.filter((f) => toSlug(f.category) === toSlug(category));
}

export async function getFilamentBySlug(slug: string): Promise<FilamentItem | null> {
  const all = await getAllFilaments();
  return all.find((f) => toSlug(f.name) === slug) ?? null;
}

export async function getCategories(): Promise<{ category: string; count: number }[]> {
  const all = await getAllFilaments();
  const map = new Map<string, number>();
  for (const f of all) {
    map.set(f.category, (map.get(f.category) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}
