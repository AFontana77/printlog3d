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
  {
    category: 'TPU',
    slug: 'tpu',
    fullName: 'Thermoplastic Polyurethane',
    summary:
      'The flexible one. Rubbery, tough, and abrasion resistant, and the only common filament that survives being bent repeatedly. Printing it is a mechanical problem rather than a temperature one.',
    printTempC: '220-250',
    bedTempC: '30-50',
    enclosure: 'Not needed',
    coolingFan: 'Yes, low',
    retraction: '0-1mm, as little as you can get away with',
    priceBandUsd: '$25-45',
    drying:
      'Hygroscopic. Dry at 50C for 4-6 hours. Wet TPU strings into a spider web and the surface goes rough.',
    needsDrying: true,
    difficulty: 'Intermediate',
    goodFor: ['Phone and tablet cases', 'Gaskets and seals', 'Vibration dampers and feet', 'RC tyres and wheels', 'Shoe insoles and grips'],
    avoidFor: ['Long Bowden tubes', 'Fine detail', 'Fast printing', 'Anything rigid'],
    commonProblem:
      'The filament buckles between the drive gear and the hot end instead of feeding, and the print turns into a tangle. Slow to 15-25 mm/s and use direct drive. On a Bowden setup this is a hardware limit, not a settings problem.',
    comparedWith: 'TPE',
  },
  {
    category: 'TPE',
    slug: 'tpe',
    fullName: 'Thermoplastic Elastomer',
    summary:
      'Softer and stretchier than TPU, and harder to print for exactly that reason. Choose it when the part has to feel genuinely rubbery rather than merely flexible.',
    printTempC: '210-240',
    bedTempC: '30-50',
    enclosure: 'Not needed',
    coolingFan: 'Yes, low',
    retraction: '0-0.5mm',
    priceBandUsd: '$30-55',
    drying: 'Hygroscopic. Dry at 45-50C for 4-6 hours.',
    needsDrying: true,
    difficulty: 'Advanced',
    goodFor: ['Soft-touch grips', 'Wearable and prosthetic padding', 'Squeezable parts', 'Low-pressure seals'],
    avoidFor: ['Bowden printers', 'Any geared extruder with a long unsupported filament path', 'Detailed models'],
    commonProblem:
      'Everything that goes wrong with TPU goes wrong sooner. A lower Shore hardness means the filament compresses more readily in the extruder, so direct drive is effectively mandatory and 15 mm/s is a sensible ceiling.',
    comparedWith: 'TPU',
  },
  {
    category: 'PVA',
    slug: 'pva',
    fullName: 'Polyvinyl Alcohol',
    summary:
      'A support material that dissolves in plain water. It exists so you can print geometry that would otherwise be impossible to clean up, and it is useless without a second extruder.',
    printTempC: '190-220',
    bedTempC: '45-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '2-4mm',
    priceBandUsd: '$40-90',
    drying:
      'The most hygroscopic filament in common use. Dry at 45C for 6-8 hours and print straight from a dry box. Left in open air it can absorb enough moisture to be unusable within a day.',
    needsDrying: true,
    difficulty: 'Intermediate',
    goodFor: ['Dissolvable supports for PLA and PETG', 'Enclosed internal geometry', 'Fragile overhangs that would break during removal'],
    avoidFor: ['Single-extruder printers', 'Humid workshops without sealed storage', 'Structural parts of any kind'],
    commonProblem:
      'It degrades in the hot end during long prints, because it has already absorbed water on the spool. Store it sealed from the moment it arrives, not from the moment it misbehaves.',
    comparedWith: 'HIPS',
  },
  {
    category: 'PP',
    slug: 'pp',
    fullName: 'Polypropylene',
    summary:
      'Chemically inert, fatigue resistant, and the best material available for living hinges. It also refuses to stick to almost every build surface, which is the whole difficulty.',
    printTempC: '220-250',
    bedTempC: '85-100',
    enclosure: 'Recommended',
    coolingFan: 'Yes, low',
    retraction: '0.5-1.5mm',
    priceBandUsd: '$40-80',
    drying: 'Mildly hygroscopic. Dry at 60-70C for 4 hours if it has been open a while.',
    needsDrying: false,
    difficulty: 'Advanced',
    goodFor: ['Living hinges that flex thousands of times', 'Chemical containers and lab fittings', 'Automotive trim clips', 'Food-adjacent parts'],
    avoidFor: ['PEI and glass beds', 'Large flat parts', 'Anything needing dimensional precision'],
    commonProblem:
      'It will not stick. The standard answer is packing tape or a polypropylene-specific sheet, because PP bonds to itself and to very little else. Bed temperature alone will not fix it.',
    comparedWith: 'PETG',
  },
  {
    category: 'PVB',
    slug: 'pvb',
    fullName: 'Polyvinyl Butyral',
    summary:
      'Prints about as easily as PLA and smooths with isopropyl alcohol rather than acetone, which makes glass-clear parts achievable without a solvent cabinet.',
    printTempC: '215-235',
    bedTempC: '60-75',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '2-4mm',
    priceBandUsd: '$30-50',
    drying: 'Hygroscopic. Dry at 50C for 4-6 hours.',
    needsDrying: true,
    difficulty: 'Intermediate',
    goodFor: ['Transparent and translucent parts', 'Vases and display pieces', 'Prints you intend to polish', 'Light diffusers'],
    avoidFor: ['Load-bearing parts', 'Anything left in sun or damp', 'High-temperature service'],
    commonProblem:
      'It absorbs moisture from the air noticeably faster than PLA, and a spool left out for a fortnight prints cloudy rather than clear. The clarity people buy it for is the first thing moisture takes away.',
    comparedWith: 'PETG',
  },
  {
    category: 'PLA-CF',
    slug: 'pla-cf',
    fullName: 'Carbon Fibre Reinforced PLA',
    summary:
      'PLA with chopped carbon fibre for stiffness and a matte black finish that hides layer lines completely. Easier than any other composite, and abrasive enough to need a hardened nozzle.',
    printTempC: '190-230',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '0.2-0.5mm',
    priceBandUsd: '$30-50',
    drying: 'Mildly hygroscopic. Dry at 45-55C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Intermediate',
    goodFor: ['Stiff brackets and mounts', 'Matte cosmetic prints', 'Drone and RC frames', 'Jigs and fixtures'],
    avoidFor: ['Brass nozzles', 'Parts needing impact toughness', 'Fine detail below 0.4mm'],
    commonProblem:
      'People expect carbon fibre to mean stronger. It means stiffer and more brittle: PLA-CF snaps where plain PLA would bend. Stiffness is the reason to choose it, not strength.',
    comparedWith: 'PLA',
  },
  {
    category: 'PA-GF',
    slug: 'pa-gf',
    fullName: 'Glass Fibre Reinforced Nylon',
    summary:
      'Nylon with chopped glass fibre. Tougher and less brittle than the carbon-filled version, at some cost in stiffness, and it keeps nylon impact resistance rather than trading it away.',
    printTempC: '250-280',
    bedTempC: '80-100',
    enclosure: 'Required',
    coolingFan: 'Minimal',
    retraction: '0.3-0.6mm',
    priceBandUsd: '$60-110',
    drying: 'Very hygroscopic. Dry at 70-80C for 8-12 hours and print from a dry box.',
    needsDrying: true,
    difficulty: 'Advanced',
    goodFor: ['Impact-loaded brackets', 'Tooling and fixtures', 'Parts that must not shatter', 'High-cycle mechanical components'],
    avoidFor: ['Brass nozzles', 'Open-frame printers', 'Cosmetic finishes'],
    commonProblem:
      'Glass fibre is more abrasive than carbon, not less. A hardened steel nozzle is the minimum and a ruby or tungsten tip is worth it if you print this regularly.',
    comparedWith: 'PA-CF',
  },
  {
    category: 'ASA-CF',
    slug: 'asa-cf',
    fullName: 'Carbon Fibre Reinforced ASA',
    summary:
      'ASA with carbon fibre: UV stability and heat resistance, plus stiffness and a matte finish. The natural choice for an outdoor part that also has to hold its shape under load.',
    printTempC: '240-270',
    bedTempC: '90-110',
    enclosure: 'Required',
    coolingFan: 'No, or very low',
    retraction: '0.3-0.5mm',
    priceBandUsd: '$40-70',
    drying: 'Hygroscopic. Dry at 70-80C for 4 hours.',
    needsDrying: true,
    difficulty: 'Advanced',
    goodFor: ['Outdoor structural brackets', 'Roof and garden fittings', 'Automotive exterior parts', 'Antenna and sensor mounts'],
    avoidFor: ['Brass nozzles', 'Unventilated rooms', 'Open-frame printers'],
    commonProblem:
      'It warps like ASA and wears nozzles like a composite, so it inherits both problems at once. Enclose the printer and fit a hardened nozzle before the first print rather than after.',
    comparedWith: 'ASA',
  },
  {
    category: 'PEI',
    slug: 'pei',
    fullName: 'Polyetherimide, sold as ULTEM',
    summary:
      'An aerospace-grade thermoplastic with a UL 94 V-0 flame rating and a glass transition around 186C. It needs a 400C hot end and a heated chamber, so it is machine-limited rather than skill-limited.',
    printTempC: '370-410',
    bedTempC: '140-180',
    enclosure: 'Required',
    coolingFan: 'No',
    retraction: '1-2mm',
    priceBandUsd: '$200-500',
    drying:
      'Dry at 120-150C for several hours. This is a laboratory oven, not a filament dryer, and skipping it produces visible voids.',
    needsDrying: true,
    difficulty: 'Expert',
    goodFor: ['Aerospace and rail interiors where flame rating matters', 'Continuous service near 170C', 'Chemically aggressive environments'],
    avoidFor: ['Any printer without a 400C hot end and a heated chamber', 'Hobby budgets', 'Beginners'],
    commonProblem:
      'A heated bed is not a heated chamber. Large parts delaminate partway up even at the right nozzle temperature, because the chamber needs to hold 120-180C for the layers to fuse.',
    comparedWith: 'PEEK',
  },
  {
    category: 'PPS',
    slug: 'pps',
    fullName: 'Polyphenylene Sulfide',
    summary:
      'A semi-crystalline engineering polymer with excellent chemical and heat resistance. Usually sold carbon-filled, because neat PPS shrinks enough to be impractical on a desktop machine.',
    printTempC: '300-340',
    bedTempC: '120-150',
    enclosure: 'Required',
    coolingFan: 'No',
    retraction: '0.5-1.5mm',
    priceBandUsd: '$150-350',
    drying: 'Dry at 100-120C for several hours. A filament dryer will not reach this.',
    needsDrying: true,
    difficulty: 'Expert',
    goodFor: ['Chemical and fuel handling components', 'Parts in sustained heat above 150C', 'Electrical insulation in hot environments'],
    avoidFor: ['Standard desktop printers', 'Anything cosmetic', 'Unfilled grades on an open frame'],
    commonProblem:
      'Crystallisation shrinkage. The part comes off the plate dimensionally different from the model, and the fix is chamber temperature and part design rather than slicer settings.',
    comparedWith: 'PEEK',
  },
  {
    category: 'Conductive PLA',
    slug: 'conductive-pla',
    fullName: 'Carbon-Loaded Conductive PLA',
    summary:
      'PLA loaded with conductive carbon black. It conducts well enough for a capacitive touch pad or a low-current sensor trace, and nowhere near well enough to be treated as wire.',
    printTempC: '195-220',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '1-3mm',
    priceBandUsd: '$50-90',
    drying: 'Mildly hygroscopic. Dry at 45C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Intermediate',
    goodFor: ['Capacitive touch surfaces', 'Low-voltage sensor traces', 'Static-dissipative fixtures', 'Educational circuit demonstrations'],
    avoidFor: ['Mains voltage or anything above extra-low voltage', 'Power-carrying conductors', 'Long traces where resistance accumulates', 'Structural parts'],
    commonProblem:
      'Its resistance is orders of magnitude higher than metal, and it rises with trace length, so a circuit that works across 20mm fails across 200mm. Treat it as a resistive material, never as a substitute for wire, and never put it near mains voltage.',
    comparedWith: 'PLA',
  },
  {
    category: 'Glow PLA',
    slug: 'glow-pla',
    fullName: 'Glow-in-the-Dark PLA',
    summary:
      'PLA carrying strontium aluminate phosphor, which charges under light and releases it slowly in the dark. It prints like PLA and wears nozzles like a composite.',
    printTempC: '200-225',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '0.2-0.5mm',
    priceBandUsd: '$25-45',
    drying: 'Mildly hygroscopic. Dry at 45C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Intermediate',
    goodFor: ['Signage and wayfinding', 'Props and costume pieces', 'Light switch surrounds and door markers', 'Toys'],
    avoidFor: ['Brass nozzles', 'Fine detail', 'Anything expecting sustained brightness'],
    commonProblem:
      'The phosphor is a hard mineral, so it eats brass nozzles faster than most carbon-filled filaments. Fit hardened steel first. Brightness also depends on how much light it has absorbed, so a part kept indoors will glow far less than the spool photograph suggests.',
    comparedWith: 'PLA',
  },
  {
    category: 'Magnetic PLA',
    slug: 'magnetic-pla',
    fullName: 'Iron-Filled Magnetic PLA',
    summary:
      'PLA packed with iron powder. Parts are noticeably heavy, can be rusted deliberately for an aged finish, and are attracted to magnets, which is not the same as being magnetic.',
    printTempC: '195-225',
    bedTempC: '50-60',
    enclosure: 'Not needed',
    coolingFan: 'Yes',
    retraction: '0.2-0.5mm',
    priceBandUsd: '$35-60',
    drying: 'Mildly hygroscopic. Dry at 45C for 4-6 hours.',
    needsDrying: false,
    difficulty: 'Intermediate',
    goodFor: ['Props that should feel solid', 'Parts intended to be rusted for finish', 'Fridge-magnet-backed pieces', 'Display models'],
    avoidFor: ['Brass nozzles', 'Structural parts', 'Anything that must not corrode', 'Fine detail'],
    commonProblem:
      'It is ferromagnetic, not magnetised: a printed part sticks to a magnet but will not hold anything up by itself. It also genuinely rusts, which is the point for some projects and a defect for others, so seal it if you do not want that.',
    comparedWith: 'PLA Metal',
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

/**
 * Brand-package icon per material.
 *
 * The package ships 21 category icons against 30 materials, so families share a
 * mark: every PLA compound uses the spool, every fibre-filled material uses the
 * honeycomb, and the two flexibles use the wave. That is deliberate — a shared
 * family mark reads as a system, whereas inventing four more icons to force a
 * one-to-one map would break the visual language the package establishes.
 */
const MATERIAL_ICON: Record<string, string> = {
  PLA: 'pla', 'PLA Matte': 'pla', 'PLA Silk': 'pla', 'PLA Wood': 'pla', 'PLA Metal': 'pla',
  'Conductive PLA': 'pla', 'Glow PLA': 'pla', 'Magnetic PLA': 'pla',
  PETG: 'petg', PCTG: 'petg', CPE: 'petg', PVB: 'petg',
  'PETG-CF': 'composite-filaments', 'PLA-CF': 'composite-filaments',
  'PA-CF': 'composite-filaments', 'PA-GF': 'composite-filaments',
  'ASA-CF': 'composite-filaments',
  ABS: 'abs', HIPS: 'abs', ASA: 'asa',
  'Nylon PA6': 'nylon', 'Nylon PA12': 'nylon',
  PC: 'polycarbonate', PEEK: 'peek', PEI: 'peek', PPS: 'peek',
  TPU: 'flexible-filaments', TPE: 'flexible-filaments',
  PVA: 'support-removal', PP: 'material-profiles',
};

export function iconFor(m: MaterialProfile | string): string {
  const key = typeof m === 'string' ? m : m.category;
  return MATERIAL_ICON[key] ?? 'material-profiles';
}
