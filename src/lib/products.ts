/**
 * Verified Amazon products.
 *
 * Every ASIN here was confirmed LIVE through the Creators API before being
 * written down, with a primary image present and the detail-page URL carrying
 * `tag=printlog3d-20`. This is a deliberately small, maintainable set: the
 * portfolio's previous curated catalogue reached 224 products of which 86% had
 * rotted to 404s, and the lesson taken from that is fewer products, verified,
 * with category guidance carrying the weight.
 *
 * REJECTED DURING VERIFICATION, recorded so it is not re-added:
 *   B0FLK6ZWLF  vacuum bags, verified LIVE but titled "Designed for Bambulab
 *               Reusable Spool". A printer-brand fit claim we cannot stand
 *               behind for a general audience. Replaced with a generic
 *               1kg-spool equivalent.
 *
 * Each entry pairs with a GearSpec category in workshop.ts or the material
 * pages. Where no verified product exists for a category, there is simply no
 * entry and the category guidance renders alone — missing product beats wrong
 * product.
 */

export type Product = {
  asin: string;
  /** Program key in affiliateLinks.json. Amazon today; a direct merchant later. */
  merchant?: string;
  /** Cluster on /recommended-gear. Absent means it only appears contextually. */
  cluster?: GearCluster;
  /** When the listing was last confirmed live with imagery, via the Creators API. */
  verified?: string;
  /** Our own short name. Never the Amazon title, which changes without notice. */
  name: string;
  brand: string;
  /** The GearSpec.category this product satisfies. */
  forCategory: string;
  /** The single specification that makes it the right choice. */
  spec: string;
};

export type GearCluster =
  | 'drying-storage'
  | 'nozzles-hotends'
  | 'build-surfaces'
  | 'finishing'
  | 'assembly'
  | 'measuring';

export const CLUSTERS: { id: GearCluster; title: string; why: string }[] = [
  { id: 'measuring', title: 'Measuring', why: 'Everything else on this page is guesswork without a number.' },
  { id: 'drying-storage', title: 'Drying and storage', why: 'Moisture is the single most common cause of a print that looks tuned and still fails.' },
  { id: 'nozzles-hotends', title: 'Nozzles and cleaning', why: 'A worn or partly blocked nozzle produces symptoms people spend evenings blaming on settings.' },
  { id: 'build-surfaces', title: 'Build surface and adhesion', why: 'The first layer decides whether the print exists. Most adhesion failures are a dirty plate.' },
  { id: 'finishing', title: 'Finishing', why: 'Removing supports and layer lines without damaging the part is a tooling problem, not a slicer one.' },
  { id: 'assembly', title: 'Assembly and joining', why: 'Printed threads strip and printed joints peel. Both have specific answers.' },
];

export const PRODUCTS: Product[] = [
  {
    asin: "B001AQEZ2W",
    name: 'Electronic digital caliper, 0-6 inch',
    brand: 'iGaging',
    forCategory: 'Digital calipers',
    merchant: 'amazon',
    cluster: 'measuring',
    verified: '2026-08-30',
    spec: 'Reads inch, millimetre and fraction, IP54 rated against workshop dust',
  },
  {
    asin: "B000GTMZHG",
    name: 'Diagonal flush cutters',
    brand: 'Klein Tools',
    forCategory: 'Flush cutters',
    merchant: 'amazon',
    cluster: 'finishing',
    verified: '2026-08-30',
    spec: 'Genuinely flush jaws, so a support is severed rather than torn away',
  },
  {
    asin: "B01L2XR4P2",
    name: 'Deburring tool with spare blades',
    brand: 'AFA Tooling',
    forCategory: 'Deburring tool',
    merchant: 'amazon',
    cluster: 'finishing',
    verified: '2026-08-30',
    spec: 'Pivoting blade head that follows an edge instead of gouging across it',
  },
  {
    asin: "B089GRX246",
    name: 'Needle file set',
    brand: 'Hi-Spec',
    forCategory: 'Needle file set',
    merchant: 'amazon',
    cluster: 'finishing',
    verified: '2026-08-30',
    spec: 'Assorted profiles for internal corners and printed holes sandpaper cannot reach',
  },
  {
    asin: "B01HBJ8Y00",
    name: 'Wet/dry sandpaper assortment',
    brand: 'Assorted',
    forCategory: 'Wet/dry sanding assortment',
    merchant: 'amazon',
    cluster: 'finishing',
    verified: '2026-08-30',
    spec: '120 through 3000 grit, wet/dry backing so PLA can be sanded without heat',
  },
  {
    asin: "B08BCRZZS3",
    name: 'M3 brass heat-set inserts, 100 pieces',
    brand: 'ruthex',
    forCategory: 'Brass heat-set inserts',
    merchant: 'amazon',
    cluster: 'assembly',
    verified: '2026-08-30',
    spec: 'Publishes a recommended hole diameter, which is the number the whole job depends on',
  },
  {
    asin: "B0D8HMR1HT",
    name: 'Digital soldering iron with insert tips',
    brand: 'Mintion',
    forCategory: 'Soldering iron with insert tips',
    merchant: 'amazon',
    cluster: 'assembly',
    verified: '2026-08-30',
    spec: 'Temperature controlled with M2 to M8 insert tips, so the insert goes in square',
  },
  {
    asin: "B0G6ZWQSVY",
    name: 'Filament storage box with humidity monitor',
    brand: 'YOOPAI',
    forCategory: 'Airtight storage with rechargeable desiccant',
    merchant: 'amazon',
    cluster: 'drying-storage',
    verified: '2026-08-30',
    spec: 'Sealed box with a built-in humidity readout, so the storage can be verified',
  },
  {
    asin: "B01I5Y2DG6",
    name: 'Indicating silica gel, rechargeable',
    brand: 'Dry & Dry',
    forCategory: 'Rechargeable desiccant',
    merchant: 'amazon',
    cluster: 'drying-storage',
    verified: '2026-08-30',
    spec: 'Changes colour when spent and recharges in an oven, so it is bought once',
  },
  {
    asin: "B0GVHZ3MZQ",
    name: 'Filament vacuum storage bags with pump',
    brand: 'Odilona',
    forCategory: 'Vacuum storage bags',
    merchant: 'amazon',
    cluster: 'drying-storage',
    verified: '2026-08-30',
    spec: 'Sized for 1 kg spools generally, with no printer-brand fit claim',
  },
  {
    asin: "B07WCR5Y4B",
    name: 'Digital hygrometer',
    brand: 'TempPro',
    forCategory: 'Hygrometer',
    merchant: 'amazon',
    cluster: 'drying-storage',
    verified: '2026-08-30',
    spec: 'Small enough to sit inside a storage box, which is the only place the reading matters',
  },
  {
    asin: "B0797XV8ZK",
    name: 'Nozzle cleaning kit with needles',
    brand: 'Assorted',
    forCategory: 'Nozzle cleaning kit',
    merchant: 'amazon',
    cluster: 'nozzles-hotends',
    verified: '2026-08-30',
    spec: '0.4mm needles plus tweezers, thinner than the bore so the nozzle is not scored',
  },
  {
    asin: "B0969LK4ZT",
    name: 'MK8 brass nozzle assortment',
    brand: 'XIFOWE',
    forCategory: 'Spare brass nozzles',
    merchant: 'amazon',
    cluster: 'nozzles-hotends',
    verified: '2026-08-30',
    spec: 'MK8 pattern in assorted sizes. Check MK8 matches your hot end before ordering',
  },
  {
    asin: "B09SG855M9",
    name: 'Hardened steel nozzles, MK8',
    brand: 'Creality',
    forCategory: 'Hardened steel nozzle',
    merchant: 'amazon',
    cluster: 'nozzles-hotends',
    verified: '2026-08-30',
    spec: 'Hardened steel for abrasive filament. MK8 is a thread pattern, not a universal fit',
  },
  // ------------------------------------------------------------ M1.5 additions
  {
    asin: "B08CGCHWMP",
    name: 'Isopropyl alcohol, 99.9%, 32 oz',
    brand: 'MaxTite',
    forCategory: 'Isopropyl alcohol',
    merchant: 'amazon',
    cluster: 'build-surfaces',
    verified: '2026-08-30',
    spec: 'High purity, so it flashes off the plate instead of leaving a film of its own',
  },
  {
    asin: "B0BVG2K1BQ",
    name: 'Build plate glue sticks, 6 pack',
    brand: 'TEQStone',
    forCategory: 'Glue stick',
    merchant: 'amazon',
    cluster: 'build-surfaces',
    verified: '2026-08-30',
    spec: 'Washes off with water, which is the property that matters when it has to come back off the plate',
  },
  {
    asin: "B0FKGNZ36S",
    name: 'Sandable filler primer, grey',
    brand: 'Bartoline',
    forCategory: 'Filler primer',
    merchant: 'amazon',
    cluster: 'finishing',
    verified: '2026-08-30',
    spec: 'One of the few filler primers whose own label names plastic alongside metal and wood',
  },
  {
    asin: "B0166FFCHS",
    name: 'CA glue and accelerator combo',
    brand: 'Bob Smith Industries',
    forCategory: 'Cyanoacrylate adhesive',
    merchant: 'amazon',
    cluster: 'assembly',
    verified: '2026-08-30',
    spec: 'Glue and accelerator together, which is what PETG and large bonded faces actually need',
  },
  {
    asin: "B009EU5ZM0",
    name: 'Clear 5-minute epoxy syringe, 25 ml',
    brand: 'J-B Weld',
    forCategory: 'Two-part epoxy',
    merchant: 'amazon',
    cluster: 'assembly',
    verified: '2026-08-30',
    spec: 'Twin syringe meters both parts evenly, and five minutes is enough to align a joint',
  },
];

/**
 * Verified filament, keyed by material slug.
 *
 * Filament commerce is otherwise a search link on purpose, because a specific
 * spool is the single most perishable thing we could link to and the guidance
 * has to survive one dying. TPU is the exception worth making: `tpu filament`
 * measures 18,100 searches a month, the largest material term this site covers,
 * and a reader arriving on that term is buying rather than reading.
 *
 * Same standard as everything else here — verified LIVE with imagery, and no
 * printer-brand fit claim in the title.
 */
export const FILAMENT_PRODUCTS: Record<string, Product> = {
  tpu: {
    asin: "B07VDP2S3P",
    name: 'TPU 95A flexible filament, 1.75mm, 1 kg',
    brand: 'Overture',
    forCategory: 'TPU filament',
    spec: 'Shore 95A, the hardness most desktop printers can actually feed without a direct drive fight',
  },
};

export function filamentProductFor(materialSlug: string): Product | undefined {
  return FILAMENT_PRODUCTS[materialSlug];
}

const BY_CATEGORY = new Map(PRODUCTS.map((p) => [p.forCategory, p]));

export function productFor(category: string): Product | undefined {
  return BY_CATEGORY.get(category);
}

/** Amazon detail-page URL carrying this property's own tag. */
export function productUrl(p: Product, tag: string): string {
  return `https://www.amazon.com/dp/${p.asin}?tag=${encodeURIComponent(tag)}`;
}
