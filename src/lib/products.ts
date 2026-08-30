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
  /** Our own short name. Never the Amazon title, which changes without notice. */
  name: string;
  brand: string;
  /** The GearSpec.category this product satisfies. */
  forCategory: string;
  /** The single specification that makes it the right choice. */
  spec: string;
};

export const PRODUCTS: Product[] = [
  {
    asin: "B001AQEZ2W",
    name: 'Electronic digital caliper, 0-6 inch',
    brand: 'iGaging',
    forCategory: 'Digital calipers',
    spec: 'Reads inch, millimetre and fraction, IP54 rated against workshop dust',
  },
  {
    asin: "B000GTMZHG",
    name: 'Diagonal flush cutters',
    brand: 'Klein Tools',
    forCategory: 'Flush cutters',
    spec: 'Genuinely flush jaws, so a support is severed rather than torn away',
  },
  {
    asin: "B01L2XR4P2",
    name: 'Deburring tool with spare blades',
    brand: 'AFA Tooling',
    forCategory: 'Deburring tool',
    spec: 'Pivoting blade head that follows an edge instead of gouging across it',
  },
  {
    asin: "B089GRX246",
    name: 'Needle file set',
    brand: 'Hi-Spec',
    forCategory: 'Needle file set',
    spec: 'Assorted profiles for internal corners and printed holes sandpaper cannot reach',
  },
  {
    asin: "B01HBJ8Y00",
    name: 'Wet/dry sandpaper assortment',
    brand: 'Assorted',
    forCategory: 'Wet/dry sanding assortment',
    spec: '120 through 3000 grit, wet/dry backing so PLA can be sanded without heat',
  },
  {
    asin: "B08BCRZZS3",
    name: 'M3 brass heat-set inserts, 100 pieces',
    brand: 'ruthex',
    forCategory: 'Brass heat-set inserts',
    spec: 'Publishes a recommended hole diameter, which is the number the whole job depends on',
  },
  {
    asin: "B0D8HMR1HT",
    name: 'Digital soldering iron with insert tips',
    brand: 'Mintion',
    forCategory: 'Soldering iron with insert tips',
    spec: 'Temperature controlled with M2 to M8 insert tips, so the insert goes in square',
  },
  {
    asin: "B0G6ZWQSVY",
    name: 'Filament storage box with humidity monitor',
    brand: 'YOOPAI',
    forCategory: 'Airtight storage with rechargeable desiccant',
    spec: 'Sealed box with a built-in humidity readout, so the storage can be verified',
  },
  {
    asin: "B01I5Y2DG6",
    name: 'Indicating silica gel, rechargeable',
    brand: 'Dry & Dry',
    forCategory: 'Rechargeable desiccant',
    spec: 'Changes colour when spent and recharges in an oven, so it is bought once',
  },
  {
    asin: "B0GVHZ3MZQ",
    name: 'Filament vacuum storage bags with pump',
    brand: 'Odilona',
    forCategory: 'Vacuum storage bags',
    spec: 'Sized for 1 kg spools generally, with no printer-brand fit claim',
  },
  {
    asin: "B07WCR5Y4B",
    name: 'Digital hygrometer',
    brand: 'TempPro',
    forCategory: 'Hygrometer',
    spec: 'Small enough to sit inside a storage box, which is the only place the reading matters',
  },
  {
    asin: "B0797XV8ZK",
    name: 'Nozzle cleaning kit with needles',
    brand: 'Assorted',
    forCategory: 'Nozzle cleaning kit',
    spec: '0.4mm needles plus tweezers, thinner than the bore so the nozzle is not scored',
  },
  {
    asin: "B0969LK4ZT",
    name: 'MK8 brass nozzle assortment',
    brand: 'XIFOWE',
    forCategory: 'Spare brass nozzles',
    spec: 'MK8 pattern in assorted sizes. Check MK8 matches your hot end before ordering',
  },
  {
    asin: "B09SG855M9",
    name: 'Hardened steel nozzles, MK8',
    brand: 'Creality',
    forCategory: 'Hardened steel nozzle',
    spec: 'Hardened steel for abrasive filament. MK8 is a thread pattern, not a universal fit',
  },
];

const BY_CATEGORY = new Map(PRODUCTS.map((p) => [p.forCategory, p]));

export function productFor(category: string): Product | undefined {
  return BY_CATEGORY.get(category);
}

/** Amazon detail-page URL carrying this property's own tag. */
export function productUrl(p: Product, tag: string): string {
  return `https://www.amazon.com/dp/${p.asin}?tag=${encodeURIComponent(tag)}`;
}
