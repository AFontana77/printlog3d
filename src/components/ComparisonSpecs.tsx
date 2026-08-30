import { MATERIAL_PROFILES, type MaterialProfile } from '@/lib/materials';

/**
 * Head-to-head spec rows, derived from the canonical material data.
 *
 * Every comparison page used to hardcode this table. An M1.5 audit compared the
 * three of them against materials.ts and found 15 drifted cells, including
 * numbers a reader can see contradict each other: ABS nozzle temperature given
 * as 230-250°C on the comparison and 220-250°C on its own page, and ABS rated
 * Advanced on the comparison while the homepage files it under Intermediate.
 *
 * None of that was wrong when it was written. It is what happens when the same
 * claim lives in two places: the material data gets corrected, the comparison
 * keeps the old number, and no gate notices because each page is internally
 * consistent.
 *
 * So the rows that have a canonical field are read from it. Pages may still add
 * editorial rows -- fumes, chemical resistance, smoothing -- because those have
 * no canonical field to disagree with.
 *
 * This returns data rather than markup on purpose: each comparison page already
 * has its own grid treatment, and giving one of them a table would trade a data
 * inconsistency for a visual one.
 */

export type SpecRow = [label: string, left: string, right: string];

function profile(category: string): MaterialProfile {
  const m = MATERIAL_PROFILES.find((p) => p.category === category);
  if (!m) throw new Error(`ComparisonSpecs: no material profile for "${category}"`);
  return m;
}

export function specRows(left: string, right: string, extra: SpecRow[] = []): SpecRow[] {
  const a = profile(left);
  const b = profile(right);
  return [
    ['Nozzle temp', `${a.printTempC}°C`, `${b.printTempC}°C`],
    ['Bed temp', `${a.bedTempC}°C`, `${b.bedTempC}°C`],
    ['Enclosure', a.enclosure, b.enclosure],
    ['Needs drying', a.needsDrying ? 'Yes' : 'No', b.needsDrying ? 'Yes' : 'No'],
    ['Difficulty', a.difficulty, b.difficulty],
    ['Typical price, 1 kg', a.priceBandUsd, b.priceBandUsd],
    ...extra,
  ];
}
