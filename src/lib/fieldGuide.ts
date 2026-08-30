/**
 * What the downloadable field guide actually contains.
 *
 * The PDF at public/PrintLog3D-Filament-Settings-Field-Guide.pdf is owner-made
 * artwork, not generated. `scripts/build_cheatsheet.py` is retired and carries a
 * do-not-run warning for exactly that reason.
 *
 * That makes the download a static artifact behind a page whose copy was derived
 * from MATERIAL_PROFILES.length. So every material added to the site silently
 * inflated the promise: by M1.5 the page offered "all 31 materials" and the file
 * held 19. TPU was among the twelve missing, which is the single most searched
 * material this site documents.
 *
 * The fix is not to regenerate the artwork -- replacing owner artwork with a
 * generated substitute is explicitly the wrong move. It is to describe the file
 * we actually ship, and to make that description checkable: acceptance extracts
 * the PDF text and fails if any material listed here is absent from it.
 *
 * WHEN THE ARTWORK IS UPDATED: add the new categories to COVERS. The check will
 * confirm they are really in the file before the claim goes live.
 */

export const FIELD_GUIDE = {
  path: '/PrintLog3D-Filament-Settings-Field-Guide.pdf',
  pages: 4,
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
    'PLA Silk',
    'PLA Matte',
    'PLA Wood',
    'PLA Metal',
    'PETG',
    'PETG-CF',
    'PCTG',
    'CPE',
    'ABS',
    'ASA',
    'HIPS',
    'PC',
    'PEEK',
    'Nylon PA6',
    'Nylon PA12',
    'PA-CF',
  ],
} as const;

export const FIELD_GUIDE_COUNT = FIELD_GUIDE.covers.length;
