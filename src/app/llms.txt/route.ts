import { MATERIAL_DATA_REVIEWED, MATERIAL_PROFILES } from '@/lib/materials';
import { WORKSHOP } from '@/lib/workshop';
import { SITE_URL } from '@/lib/seo';

/**
 * llms.txt: what an assistant should know before it describes this site.
 *
 * Every list here comes from the same modules the pages render, so it cannot
 * drift from the site. It carries no retail price and no temperature: those
 * belong on the page, next to the note that says where they came from.
 *
 * The "What this site does not do" section is deliberate. Saying the limits out
 * loud is what makes the rest safe to repeat.
 */

// Build-time data, so the file is prerendered once per deploy like the sitemap.
export const dynamic = 'force-static';

export function GET() {
  const materials = MATERIAL_PROFILES.map(
    (m) => `- [${m.category}](${SITE_URL}/library/${m.slug}): ${m.summary}`,
  ).join('\n');

  const workshop = WORKSHOP.map(
    (w) => `- [${w.title}](${SITE_URL}/workshop/${w.slug}): ${w.metaDescription}`,
  ).join('\n');

  const body = `# PrintLog3D

> A free filament settings reference for people who own a 3D printer. ${MATERIAL_PROFILES.length} materials, one page each, plus guides for finishing and assembling printed parts.

Material data last reviewed: ${MATERIAL_DATA_REVIEWED}.

## What this site does not do

- It does not test filament or printers. The figures are typical manufacturer-published ranges for each material class, not numbers we measured. The spool and the printer have the last word.
- It does not rank brands from hands-on use.
- It has no app and no paid plan. The reference is free to read.
- Some links to Amazon are affiliate links. See ${SITE_URL}/disclosure.

## Start here

- [Filament guide](${SITE_URL}/3d-printing-filament-guide): how to choose a material for a part.
- [Troubleshooting](${SITE_URL}/3d-printer-troubleshooting): common print faults and what to change.
- [Cost calculator](${SITE_URL}/3d-printing-cost-calculator): what a print really costs.
- [How to dry filament](${SITE_URL}/how-to-dry-filament)
- [Stringing](${SITE_URL}/3d-print-stringing)
- [PLA vs PETG](${SITE_URL}/pla-vs-petg), [PLA vs ABS](${SITE_URL}/pla-vs-abs), [ABS vs PETG](${SITE_URL}/abs-vs-petg), [ASA vs ABS](${SITE_URL}/asa-vs-abs)
- [Recommended gear](${SITE_URL}/recommended-gear): tools for finishing and assembly.
- [Get it printed](${SITE_URL}/get-it-printed): when to send a part to a print service instead.

## Materials

${materials}

## Workshop guides

${workshop}

## About this site

- [About](${SITE_URL}/about)
- [Editorial policy](${SITE_URL}/editorial-policy)
- [Affiliate disclosure](${SITE_URL}/disclosure)
- [Privacy](${SITE_URL}/privacy)
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
