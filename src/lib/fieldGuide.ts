/**
 * What the downloadable field guide contains.
 *
 * All 31 materials, as of M1.7. The PDF is now BUILT from materials.ts by
 * `scripts/build_field_guide.py`, so this list, the guide and the material
 * library are three views of one source rather than three things that have to
 * be kept in step by hand.
 *
 * History, because it explains why the acceptance check is as strict as it is:
 * the guide shipped with 17 materials while the page advertised the whole
 * library. M1.5 corrected the page to 19 -- still wrong, because a substring
 * test counted `PP` inside another token and `PEI` inside prose describing a
 * build-plate surface. M1.6 established the true 17. M1.7 made the number
 * irrelevant by generating the PDF from the same source the site renders.
 *
 * Acceptance now reads material rows out of the PDF STRUCTURALLY, by column
 * position, and asserts the page claim, the PDF rows and the live profiles are
 * the same set AND the same count.
 */

export const FIELD_GUIDE = {
  path: '/PrintLog3D-Filament-Settings-Field-Guide.pdf',
  pages: 6,
  /**
   * Verified present in the shipped PDF as a settings row, 2026-08-30.
   *
   * Corrected in M1.6 from 19 to 17. The first pass used a substring test and
   * counted two materials the guide does not cover:
   *   PP  -- matched inside another token, never appears on its own.
   *   PEI -- appears in real prose, but as a BUILD PLATE surface ('Nylon does
   *          not like PEI'), not as a material profile. Right token, wrong
   *          meaning, which a word-boundary test alone still accepts.
   *
   * 17 is also what the PDF's own metadata subject line says, which is the
   * corroboration the first pass should have checked against its own count.
   */
  covers: [
    'PLA',
    'PETG',
    'ABS',
    'ASA',
    'PC',
    'PEEK',
    'Nylon PA6',
    'Nylon PA12',
    'PA-CF',
    'PETG-CF',
    'PCTG',
    'CPE',
    'HIPS',
    'PLA Silk',
    'PLA Matte',
    'PLA Wood',
    'PLA Metal',
    'TPU',
    'TPE',
    'PVA',
    'PP',
    'PVB',
    'PLA-CF',
    'PA-GF',
    'ASA-CF',
    'PC-CF',
    'PEI',
    'PPS',
    'Conductive PLA',
    'Glow PLA',
    'Magnetic PLA',
  ],
} as const;

export const FIELD_GUIDE_COUNT = FIELD_GUIDE.covers.length;
