/**
 * Canonical material reference for printlog3d.com.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The `items` table (skin_id=3dprint) holds 1,000 rows shaped as
 * brand x material x grade. That shape is a cartesian product: all 30 brands
 * are recorded as selling all 17 materials, which is not true of any of them.
 * The per-row price, rating and source attribution are not sourced and are
 * wrong (PEEK is stored at $18-39/kg against a real street price of
 * $150-400/kg). Those rows therefore cannot back a product page.
 *
 * What IS sound in that table is the material-level engineering data - the
 * print and bed temperature ranges, enclosure and cooling requirements - which
 * matches manufacturer-published figures. This module is the honest layer:
 * one profile per material, no invented products, no invented prices.
 *
 * SOURCING RULE
 * -------------
 * Every number here is a manufacturer-published or widely-documented typical
 * range for the material class. Nothing here was measured by us and nothing
 * here should ever be written as though it were. Price fields are editorial
 * bands (Golden Property Standard section 8), never live prices.
 *
 * The table's own `data.price_usd` is deliberately never read.
 */

export type MaterialProfile = {
  /** Category value as stored in the items table. Join key. */
  category: string;
  /** URL segment. Must equal toSlug(category). */
  slug: string;
  /** Full chemical or trade name. */
  fullName: string;
  /** One-line answer to "what is this". */
  summary: string;
  printTempC: string;
  bedTempC: string;
  enclosure: 'Required' | 'Recommended' | 'Not needed';
  coolingFan: string;
  retraction: string;
  /** Indicative street price for a 1 kg spool. A band, never a live price. */
  priceBandUsd: string;
  /** Hygroscopic behaviour and the drying recipe if it needs one. */
  drying: string;
  /** Does it need drying before most prints? Drives the dryer recommendation. */
  needsDrying: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  goodFor: string[];
  avoidFor: string[];
  /** The failure people actually hit, and the fix. */
  commonProblem: string;
  /** The material a reader is most likely weighing this against. */
  comparedWith: string;
};

export const MATERIAL_PROFILES: MaterialProfile[] = [
  {
    category: 'PLA',
    slug: 'pla',
    fullName: 'Polylactic Acid',
    summary:
      'The default beginner filament. Prints cool, sticks well, warps very little, and needs no enclosure. It gives up heat resistance in exchange for all of that.',
    printTempC: '180-220',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes, 100% after the first layer',
    retraction: '0.1-0.3mm',
    priceBandUsd: '$15-30',
    drying:
      'Mildly hygroscopic. Dry at 45C for 4-6 hours if the spool has been open in humid air and you see popping or a rough surface.',
    needsDrying: false,
    difficulty: 'Beginner',
    goodFor: ['Display models', 'Prototypes', 'Toys and figures', 'Jigs used at room temperature'],
    avoidFor: ['Anything left in a hot car', 'Parts under sustained load', 'Outdoor use in sun'],
    commonProblem:
      'Parts soften around 60C, so a print left on a dashboard will sag. If the part needs to survive heat, move to PETG or ABS rather than trying to tune PLA.',
    comparedWith: 'PETG',
  },
  {
    category: 'PETG',
    slug: 'petg',
    fullName: 'Polyethylene Terephthalate Glycol',
    summary:
      'The usual step up from PLA. Tougher, more heat resistant, still printable without an enclosure. The trade is stringing and fussier bed adhesion.',
    printTempC: '220-250',
    bedTempC: '70-85',
    enclosure: 'Not needed',
    coolingFan: 'Yes, 30-50%',
    retraction: '0.2-0.4mm',
    priceBandUsd: '$18-30',
    drying:
      'Hygroscopic. Dry at 65C for 4-6 hours. Wet PETG strings badly and prints with a cloudy, bubbled surface.',
    needsDrying: true,
    difficulty: 'Beginner',
    goodFor: ['Functional parts', 'Outdoor fixtures', 'Food-adjacent containers', 'Parts that must flex without snapping'],
    avoidFor: ['Fine detail miniatures', 'Parts needing a crisp matte finish'],
    commonProblem:
      'Stringing between towers. Drop the nozzle 5C at a time and raise travel speed before you touch retraction distance.',
    comparedWith: 'PLA',
  },
  {
    category: 'ABS',
    slug: 'abs',
    fullName: 'Acrylonitrile Butadiene Styrene',
    summary:
      'The classic engineering thermoplastic. Handles heat to around 80C and can be vapour smoothed with acetone. It warps hard without an enclosure.',
    printTempC: '220-250',
    bedTempC: '100-110',
    enclosure: 'Required',
    coolingFan: 'No, or very low',
    retraction: '0.3-0.5mm',
    priceBandUsd: '$18-30',
    drying: 'Hygroscopic. Dry at 65-80C for 2-4 hours.',
    needsDrying: true,
    difficulty: 'Intermediate',
    goodFor: ['Automotive interior parts', 'Enclosures', 'Parts that will be sanded or smoothed', 'Snap-fit assemblies'],
    avoidFor: ['Open-frame printers in a cold room', 'Large flat parts without a heated chamber', 'Unventilated spaces'],
    commonProblem:
      'Corners lift off the bed and layers split partway up. The cause is nearly always a draught, not the bed temperature. Enclose the printer and turn the part cooling fan off.',
    comparedWith: 'ASA',
  },
  {
    category: 'ASA',
    slug: 'asa',
    fullName: 'Acrylonitrile Styrene Acrylate',
    summary:
      'ABS reformulated to survive sunlight. Same strength and heat resistance, far better UV stability. This is the outdoor engineering material.',
    printTempC: '235-255',
    bedTempC: '90-110',
    enclosure: 'Required',
    coolingFan: 'No, or very low',
    retraction: '0.3-0.5mm',
    priceBandUsd: '$25-45',
    drying: 'Hygroscopic. Dry at 70-80C for 4 hours.',
    needsDrying: true,
    difficulty: 'Intermediate',
    goodFor: ['Outdoor brackets and mounts', 'Garden and roof fittings', 'Automotive exterior trim', 'Anything left in sun'],
    avoidFor: ['Unventilated rooms', 'Open-frame printers'],
    commonProblem:
      'Same warping profile as ABS, plus a stronger smell. Ventilate the room and keep the chamber warm and still.',
    comparedWith: 'ABS',
  },
  {
    category: 'PC',
    slug: 'pc',
    fullName: 'Polycarbonate',
    summary:
      'The strongest and most heat resistant material most desktop printers can run. Genuinely tough, genuinely difficult, and it demands a hot end that can hold 300C.',
    printTempC: '260-310',
    bedTempC: '100-120',
    enclosure: 'Required',
    coolingFan: 'No',
    retraction: '0.3-0.6mm',
    priceBandUsd: '$35-70',
    drying:
      'Very hygroscopic. Dry at 80C for 6-8 hours and print straight from a dry box. Wet polycarbonate is the single most common cause of failed PC prints.',
    needsDrying: true,
    difficulty: 'Advanced',
    goodFor: ['Load-bearing brackets', 'Parts near heat sources', 'Impact-resistant housings', 'Optically clear parts when tuned'],
    avoidFor: ['PTFE-lined hot ends', 'Printers without a heated chamber', 'Beginners'],
    commonProblem:
      'Layers delaminate under load even though the print looked clean. That is moisture. Dry the spool properly and keep it dry during the print.',
    comparedWith: 'PA-CF',
  },
  {
    category: 'PEEK',
    slug: 'peek',
    fullName: 'Polyether Ether Ketone',
    summary:
      'An aerospace and medical grade polymer. It needs a 400C hot end and a heated chamber, so it is out of reach of nearly every consumer printer.',
    printTempC: '370-420',
    bedTempC: '120-160',
    enclosure: 'Required',
    coolingFan: 'No',
    retraction: '0.3-0.5mm',
    priceBandUsd: '$150-400',
    drying: 'Dry at 120-150C for at least 3 hours. This needs a high-temperature oven, not a filament dryer.',
    needsDrying: true,
    difficulty: 'Expert',
    goodFor: ['Aerospace and medical parts', 'Chemical-resistant components', 'Continuous service above 150C'],
    avoidFor: ['Any standard desktop printer', 'Hobby projects', 'Anyone without a high-temperature machine'],
    commonProblem:
      'The realistic problem is machine capability, not settings. If your hot end tops out at 300C and the bed at 110C, PEEK is not an option regardless of tuning.',
    comparedWith: 'PC',
  },
  {
    category: 'Nylon PA6',
    slug: 'nylon-pa6',
    fullName: 'Polyamide 6',
    summary:
      'Tough, abrasion resistant and self-lubricating. Stronger than PA12 but noticeably thirstier, which makes it the harder of the two nylons to run well.',
    printTempC: '230-260',
    bedTempC: '70-90',
    enclosure: 'Required',
    coolingFan: 'Minimal',
    retraction: '0.3-0.6mm',
    priceBandUsd: '$35-80',
    drying:
      'Extremely hygroscopic, enough to absorb print-ruining moisture within hours of opening. Dry at 70-80C for 8-12 hours and print from a dry box.',
    needsDrying: true,
    difficulty: 'Advanced',
    goodFor: ['Gears and bearings', 'Living hinges', 'High-cycle mechanical parts', 'Tool holders'],
    avoidFor: ['Dimensionally critical parts', 'Humid workshops without a dry box'],
    commonProblem:
      'Steam pops and a furry surface mean the filament is wet. Nylon absorbs moisture faster than you can print it, so drying once is not enough - it has to stay dry during the print.',
    comparedWith: 'Nylon PA12',
  },
  {
    category: 'Nylon PA12',
    slug: 'nylon-pa12',
    fullName: 'Polyamide 12',
    summary:
      'The easier nylon. Absorbs less water than PA6 and moves less after printing, at some cost in stiffness.',
    printTempC: '240-270',
    bedTempC: '70-90',
    enclosure: 'Required',
    coolingFan: 'Minimal',
    retraction: '0.3-0.6mm',
    priceBandUsd: '$40-90',
    drying: 'Hygroscopic. Dry at 70-80C for 8-12 hours and keep it in a dry box.',
    needsDrying: true,
    difficulty: 'Advanced',
    goodFor: ['Functional prototypes', 'Parts needing dimensional stability', 'Snap fits', 'Wear surfaces'],
    avoidFor: ['Budget builds', 'Printers without an enclosure'],
    commonProblem:
      'Poor bed adhesion. Nylon does not like PEI. A garolite or PA-specific sheet, or a glue stick layer, fixes what temperature tuning will not.',
    comparedWith: 'Nylon PA6',
  },
  {
    category: 'PA-CF',
    slug: 'pa-cf',
    fullName: 'Carbon Fibre Reinforced Nylon',
    summary:
      'Nylon with chopped carbon fibre. Much stiffer and more dimensionally stable than plain nylon, and abrasive enough to destroy a brass nozzle in a single print.',
    printTempC: '260-280',
    bedTempC: '80-100',
    enclosure: 'Required',
    coolingFan: 'Minimal',
    retraction: '0.3-0.6mm',
    priceBandUsd: '$60-120',
    drying: 'Hygroscopic. Dry at 70-80C for 8-12 hours.',
    needsDrying: true,
    difficulty: 'Advanced',
    goodFor: ['Structural brackets', 'Drone frames', 'Jigs and fixtures', 'Parts that must not flex'],
    avoidFor: ['Brass nozzles', 'Parts needing a smooth cosmetic finish', 'Transparent parts'],
    commonProblem:
      'Underextrusion that gets worse as the print goes on. The carbon fibre has widened the nozzle bore. Fit a hardened steel or ruby nozzle before the first print, not after.',
    comparedWith: 'PC',
  },
  {
    category: 'PETG-CF',
    slug: 'petg-cf',
    fullName: 'Carbon Fibre Reinforced PETG',
    summary:
      'PETG with carbon fibre added for stiffness and a matte black finish. Easier than PA-CF and it hides layer lines well. Still abrasive.',
    printTempC: '240-260',
    bedTempC: '80-90',
    enclosure: 'Not needed',
    coolingFan: 'Yes, 30-50%',
    retraction: '0.3-0.5mm',
    priceBandUsd: '$35-60',
    drying: 'Hygroscopic. Dry at 65C for 4-6 hours.',
    needsDrying: true,
    difficulty: 'Intermediate',
    goodFor: ['Stiff functional parts', 'Matte cosmetic prints', 'Camera and tool mounts'],
    avoidFor: ['Brass nozzles', 'Parts needing impact toughness - the fibre makes it more brittle than plain PETG'],
    commonProblem:
      'People expect carbon fibre to mean stronger in every sense. It means stiffer. Impact resistance goes down, not up.',
    comparedWith: 'PETG',
  },
  {
    category: 'PCTG',
    slug: 'pctg',
    fullName: 'Polycyclohexylenedimethylene Terephthalate Glycol',
    summary:
      'A close cousin of PETG with better impact strength and clarity. Prints at similar settings and strings less.',
    printTempC: '230-250',
    bedTempC: '70-85',
    enclosure: 'Not needed',
    coolingFan: 'Yes, 30-50%',
    retraction: '0.2-0.4mm',
    priceBandUsd: '$25-45',
    drying: 'Hygroscopic. Dry at 65C for 4-6 hours.',
    needsDrying: true,
    difficulty: 'Beginner',
    goodFor: ['Clear parts', 'Impact-resistant housings', 'Anything you would print in PETG but want tougher'],
    avoidFor: ['High-temperature service', 'Budget-first projects'],
    commonProblem:
      'Availability, more than printing. Fewer brands carry it, so colour choice is narrow compared with PETG.',
    comparedWith: 'PETG',
  },
  {
    category: 'CPE',
    slug: 'cpe',
    fullName: 'Co-Polyester',
    summary:
      'An engineering co-polyester built for chemical resistance. Tougher and more chemically stable than PETG, with slightly better heat resistance.',
    printTempC: '240-260',
    bedTempC: '75-90',
    enclosure: 'Recommended',
    coolingFan: 'Yes, low',
    retraction: '0.3-0.5mm',
    priceBandUsd: '$30-60',
    drying: 'Hygroscopic. Dry at 65-70C for 4-6 hours.',
    needsDrying: true,
    difficulty: 'Intermediate',
    goodFor: ['Parts exposed to solvents or cleaning agents', 'Lab and workshop fixtures', 'Functional prototypes'],
    avoidFor: ['Cosmetic prints', 'Budget projects'],
    commonProblem:
      'CPE is often confused with chlorinated polyethylene, an unrelated industrial rubber. In 3D printing CPE always means co-polyester.',
    comparedWith: 'PETG',
  },
  {
    category: 'HIPS',
    slug: 'hips',
    fullName: 'High-Impact Polystyrene',
    summary:
      'Mostly used as a dissolvable support material alongside ABS. It dissolves in limonene, which lets you print overhangs that would otherwise be impossible.',
    printTempC: '220-250',
    bedTempC: '100-115',
    enclosure: 'Required',
    coolingFan: 'No, or very low',
    retraction: '0.3-0.5mm',
    priceBandUsd: '$20-35',
    drying: 'Mildly hygroscopic. Dry at 65C for 4 hours if it has been open a while.',
    needsDrying: false,
    difficulty: 'Intermediate',
    goodFor: ['Dissolvable supports for ABS', 'Lightweight models', 'Prototype shells'],
    avoidFor: ['Load-bearing parts', 'Single-extruder printers if you wanted it for supports'],
    commonProblem:
      'Buying it as a support material without checking you have a second extruder. On a single-nozzle printer HIPS is just a weak ABS-like filament.',
    comparedWith: 'ABS',
  },
  {
    category: 'PLA Silk',
    slug: 'pla-silk',
    fullName: 'Silk PLA',
    summary:
      'PLA with additives that give a glossy, near-metallic sheen. It looks excellent and prints slightly weaker than standard PLA.',
    printTempC: '195-225',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes, reduced to 50-70% to keep the shine',
    retraction: '0.1-0.3mm',
    priceBandUsd: '$20-40',
    drying: 'Mildly hygroscopic. Dry at 45C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Beginner',
    goodFor: ['Display pieces', 'Vases and decorative prints', 'Gifts'],
    avoidFor: ['Functional parts', 'Prints needing sharp fine detail'],
    commonProblem:
      'The sheen disappears with too much cooling. Turn the fan down, print a little hotter and slower than plain PLA.',
    comparedWith: 'PLA',
  },
  {
    category: 'PLA Matte',
    slug: 'pla-matte',
    fullName: 'Matte PLA',
    summary:
      'PLA with a matting agent that hides layer lines. The most forgiving way to make a print look finished without sanding.',
    printTempC: '195-220',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes, 100% after the first layer',
    retraction: '0.1-0.3mm',
    priceBandUsd: '$20-35',
    drying: 'Mildly hygroscopic. Dry at 45C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Beginner',
    goodFor: ['Display models where layer lines would show', 'Props and cosplay', 'Photography subjects'],
    avoidFor: ['Parts needing maximum strength', 'Very fine mechanical detail'],
    commonProblem:
      'The matting filler is mildly abrasive. A brass nozzle survives it, but expect faster wear than plain PLA.',
    comparedWith: 'PLA',
  },
  {
    category: 'PLA Wood',
    slug: 'pla-wood',
    fullName: 'Wood-Filled PLA',
    summary:
      'PLA mixed with wood fibre. It sands and stains like timber and can be colour-shifted by changing nozzle temperature.',
    printTempC: '190-220',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '0.2-0.4mm',
    priceBandUsd: '$25-40',
    drying: 'Mildly hygroscopic. Dry at 45C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Intermediate',
    goodFor: ['Decorative pieces', 'Prints you plan to sand or stain', 'Signage and plaques'],
    avoidFor: ['Nozzles under 0.4mm', 'Fine detail', 'Structural parts'],
    commonProblem:
      'Clogging. Wood particles bridge a small nozzle easily. Use 0.4mm or larger and avoid long retractions.',
    comparedWith: 'PLA',
  },
  {
    category: 'PLA Metal',
    slug: 'pla-metal',
    fullName: 'Metal-Filled PLA',
    summary:
      'PLA loaded with metal powder. Heavier in the hand, polishable to a real metallic finish, and abrasive enough to need a hardened nozzle.',
    printTempC: '190-225',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '0.2-0.4mm',
    priceBandUsd: '$30-50',
    drying: 'Mildly hygroscopic. Dry at 45C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Intermediate',
    goodFor: ['Replica props', 'Medals and coins', 'Prints that should feel heavy'],
    avoidFor: ['Brass nozzles', 'Structural parts - the metal filler makes it more brittle'],
    commonProblem:
      'People expect metal strength. The filler adds weight and finish, and reduces strength compared with plain PLA.',
    comparedWith: 'PLA',
  },
];

const BY_SLUG = new Map(MATERIAL_PROFILES.map((m) => [m.slug, m]));
const BY_CATEGORY = new Map(MATERIAL_PROFILES.map((m) => [m.category, m]));

export function getMaterialBySlug(slug: string): MaterialProfile | undefined {
  return BY_SLUG.get(slug);
}

export function getMaterialByCategory(category: string): MaterialProfile | undefined {
  return BY_CATEGORY.get(category);
}

/** Materials that need a dryer. Drives the honest accessory recommendation. */
export function materialsNeedingDrying(): MaterialProfile[] {
  return MATERIAL_PROFILES.filter((m) => m.needsDrying);
}
