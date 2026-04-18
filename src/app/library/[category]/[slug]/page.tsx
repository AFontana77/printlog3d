import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import {
  getAllFilaments,
  getCategories,
  toSlug,
  type FilamentItem,
} from '@/lib/items';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Download, ExternalLink, ShoppingCart, Thermometer, Zap, DollarSign, Star } from 'lucide-react';

// ─── Static copy per category ────────────────────────────────────────────────

type CategoryGuide = {
  printGuide: (filament: FilamentItem) => string;
  whyChoose: (filament: FilamentItem) => string;
  whatToPrint: (filament: FilamentItem) => string;
  commonIssues: string;
};

const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  PLA: {
    printGuide: (f) =>
      `PLA is the friendliest material in FDM printing and ${f.name} is no exception. Set your nozzle between ${f.data?.print_temp_c_range ?? '190–230'}°C — start at the lower end to minimize stringing, raise it if you see underextrusion or layer delamination. ${f.data?.bed_temp_c !== undefined ? `A bed temperature of ${f.data.bed_temp_c}°C with PEI or glass gives excellent first-layer adhesion.` : 'A glass or PEI bed works well; heated bed recommended but often optional.'} No enclosure needed — PLA performs well in open-air environments at room temperature. Print speed can be aggressive: most PLA handles ${f.data?.speed_mm_s ?? '50–80'} mm/s without quality loss. Use fan cooling at 100% after the first layer to keep bridges clean and overhangs sharp. Retraction between 1–6mm (direct: 0.5–2mm, Bowden: 4–7mm) controls stringing on this material.`,
    whyChoose: (f) =>
      `${f.name} has earned solid community respect for consistent diameter tolerances, reliable color accuracy across batches, and predictable print behavior. ${f.data?.brand ? `${f.data.brand} is known for tight ±0.02–0.05mm tolerance control, which means fewer jams and more consistent flow rates.` : 'Consistent diameter control means fewer mid-print failures and better surface finish.'} PLA's biodegradable plant-based chemistry also makes it a responsible choice for hobbyists who print high volumes. Reviews across 3D printing communities consistently highlight low odor, good layer bonding, and reliable first-layer adhesion as standout strengths of this type of filament.`,
    whatToPrint: (f) =>
      `${f.name} excels at decorative objects, figurines, cosplay props, tabletop terrain, desktop organizers, and educational models. PLA's detail resolution is among the best of common FDM materials — fine features at 0.4mm line widths are achievable with good cooling. Prototype parts that don't face heat or significant mechanical stress are a natural fit. Architectural models, scale miniatures, and custom keychains are all classic PLA projects. For anything that will live outdoors or near a hot car window, consider PETG or ASA instead — PLA softens around 60°C.`,
    commonIssues:
      'Stringing: drop nozzle temp by 5°C and increase retraction. Warping on large flat prints: first layer temp +5°C, slow first layer to 25 mm/s, use a brim. Poor bed adhesion: clean bed with IPA before every print — skin oils destroy adhesion. Elephant foot: lower initial layer flow to 90-95%. Brittle prints after storage: PLA absorbs moisture slowly; dry at 45°C for 4 hours before printing if stored over 6 months.',
  },
  PETG: {
    printGuide: (f) =>
      `PETG requires slightly more dialing than PLA but rewards patience with strong, semi-flexible parts. Set your nozzle to ${f.data?.print_temp_c_range ?? '230–250'}°C — PETG needs heat to bond properly. ${f.data?.bed_temp_c !== undefined ? `Bed at ${f.data.bed_temp_c}°C` : 'Bed at 70–85°C'} with a PEI or glass surface; avoid smooth glass without adhesive as PETG can fuse to it permanently. Use 50-75% fan cooling — PETG benefits from some cooling but too much weakens layer adhesion. Print speed of ${f.data?.speed_mm_s ?? '40–60'} mm/s is a good baseline. PETG is prone to stringing; increase retraction to 5–7mm (Bowden) or 3–5mm (direct). First layer: slow down to 20–25 mm/s and set your Z-offset slightly higher than PLA to avoid the nozzle sticking to the layer.`,
    whyChoose: (f) =>
      `${f.name} sits in the sweet spot between PLA printability and ABS mechanical strength. ${f.data?.brand ? `${f.data.brand}` : 'This brand'} PETG is formulated to minimize the notorious stringing tendency of glycol-modified PET while maintaining good inter-layer bonding. Heat resistance up to 80°C makes it viable for parts that live in warm environments — dashboards, outdoor fixtures, and mechanical housings. The semi-flexible nature prevents brittle fracture under impact. Community feedback on PETG from respected brands consistently calls out dimensional accuracy and consistent melt flow index as key differentiators between good and mediocre PETG.`,
    whatToPrint: (f) =>
      `${f.name} is the go-to for functional mechanical parts: hinges, clips, brackets, enclosure panels, and snap-fit assemblies that need to survive real use. Food-safe when printed through a clean, uncoated brass nozzle with 100% infill (no dyes in contact layers). Outdoor fixtures, drone frames, and camera mounts benefit from PETG's UV and moisture resistance compared to PLA. Water-tight vessels are achievable with 4+ perimeters and high infill. Replace any PLA part that lives in a car, near a heater, or outdoors with PETG — heat deflection at 80°C vs 60°C makes a meaningful difference.`,
    commonIssues:
      'Stringing: most common PETG complaint — raise retraction, lower temp 5°C, increase travel speed. Bed adhesion too good (part fuses): apply glue stick or hairspray as release agent on glass. Layer splitting: increase temp 5–10°C or slow down. Blobbing at seam: enable seam hiding, use linear advance. Z-banding: mechanical issue, not filament. Moisture absorption: dry at 65°C for 4–6 hours if prints look rough or have bubbles.',
  },
  ABS: {
    printGuide: (f) =>
      `ABS demands controlled conditions. An enclosure is mandatory — ambient drafts cause delamination and warping on any print over 3cm tall. Set nozzle to ${f.data?.print_temp_c_range ?? '230–250'}°C and ${f.data?.bed_temp_c !== undefined ? `bed to ${f.data.bed_temp_c}°C` : 'bed to 100–110°C'} with PEI or a ABS-slurry (ABS dissolved in acetone) applied to glass. Fan cooling at 0% for the entire print — airflow is the enemy of ABS adhesion. Print speed of ${f.data?.speed_mm_s ?? '40–60'} mm/s is standard. Enclosure target temperature: 40–50°C ambient. ABS fumes contain styrene — always vent to outdoors or use a HEPA+carbon filter. Warping is the primary failure mode; thick brims (8–15mm) and a hot enclosure solve 90% of issues.`,
    whyChoose: (f) =>
      `${f.name} is the traditional engineering choice for high-temperature applications. ${f.data?.brand ? `${f.data.brand}` : 'The brand behind this filament'} formulates ABS for consistent melt behavior that reduces nozzle clogging and layer delamination, the two most common ABS failure modes. Heat deflection at 100°C+ makes ABS the choice for automotive interior parts, under-hood housings, and components near heat sources. Acetone smoothing gives ABS parts a professional injection-molded finish — no other common FDM material offers this post-processing option. For enclosures, brackets, and parts that live in hot environments, ABS remains the cost-effective standard.`,
    whatToPrint: (f) =>
      `${f.name} targets functional, high-heat parts: automotive trim pieces, electrical junction boxes, RC car bodies, drone frames, and any housing that faces heat above 60°C. Acetone vapor smoothing makes ABS excellent for presentation models requiring a glossy, injection-molded appearance. Tool handles, machine guards, and structural brackets benefit from ABS's impact resistance relative to PLA. Professional shops use ABS for jigs, fixtures, and manufacturing aids because of its machinability — it drills, taps, and sands cleanly with standard metalworking tools.`,
    commonIssues:
      'Warping: the #1 ABS problem. Enclosure required, no fan, ABS slurry or PEI bed, thick brim, 110°C bed. Layer splitting / delamination: raise nozzle temp 5–10°C, slow down, check enclosure temp. Cracking sounds while printing: enclosure too cold — preheat for 10+ minutes. Fumes: always ventilate, ABS styrene fumes are harmful. Stringing: less common than PETG but increase retraction 0.5–1mm if present. Poor surface finish: sand with 220-grit then vapor smooth with acetone.',
  },
  ASA: {
    printGuide: (f) =>
      `ASA prints almost identically to ABS with one key advantage: UV stability. Settings mirror ABS closely — nozzle at ${f.data?.print_temp_c_range ?? '240–260'}°C, ${f.data?.bed_temp_c !== undefined ? `bed at ${f.data.bed_temp_c}°C` : 'bed at 100–110°C'}, and full enclosure required. ASA warps slightly less aggressively than ABS but still demands controlled ambient temperatures. Fan at 0% for the full print. Print speed of ${f.data?.speed_mm_s ?? '40–60'} mm/s maintains good layer bonding. ASA also emits fumes — ventilate properly. First layer adhesion: PEI plate at 100–110°C is reliable. For large footprint prints, increase the brim to 10–15mm as ASA corners lift without warning.`,
    whyChoose: (f) =>
      `${f.name} answers the core limitation of ABS: UV degradation. Standard ABS yellows, becomes brittle, and loses mechanical properties after months of outdoor UV exposure. ${f.data?.brand ? `${f.data.brand}` : 'This brand'} ASA is formulated with UV stabilizers that extend outdoor service life significantly — tested parts show minimal degradation after 18+ months of direct sunlight. The mechanical profile (impact resistance, heat deflection, surface hardness) mirrors ABS, so you get the same engineering performance with outdoor durability. Professionals working on garden equipment, automotive exterior parts, and outdoor signage consistently choose ASA over ABS for long-term deployments.`,
    whatToPrint: (f) =>
      `${f.name} is the definitive outdoor engineering filament. Exterior automotive parts (mirror housings, trim clips, antenna mounts), garden equipment, outdoor enclosures, and architectural models for permanent outdoor display. Marine hardware applications: buoy mounts, kayak fittings, fishing rod holders. Any part that ABS would handle indoors but fail outdoors due to UV or moisture belongs in ASA. Electrical junction boxes for outdoor installations, security camera housings, and landscape lighting fixtures are ideal applications. If the part lives outside, ASA is almost always the correct material choice.`,
    commonIssues:
      'Same core issues as ABS — warping, delamination, fumes. Enclosure is non-negotiable. ASA warps slightly less than ABS but corners still lift; use large brims. Fumes: ASA emits styrene and acrylate compounds — always ventilate. Surface finish: ASA sands and paints well; use automotive primer for best adhesion. Moisture: dry ASA at 70°C for 4 hours if stored without desiccant. Color fading in finished prints: high-quality ASA formulations are stable, but cheap ASA may still degrade — buy from reputable brands.',
  },
  Nylon: {
    printGuide: (f) =>
      `Nylon is the most demanding common FDM material. Dry storage is mandatory — nylon absorbs moisture within hours and prints wet nylon produce rough surfaces, poor layer bonding, and steam bubbles. Dry at 70°C for 8+ hours before printing. Nozzle: ${f.data?.print_temp_c_range ?? '240–280'}°C depending on grade; PA6 runs hotter than PA12. ${f.data?.bed_temp_c !== undefined ? `Bed at ${f.data.bed_temp_c}°C` : 'Bed at 70–90°C'} with PEI or garolite (the preferred Nylon bed surface). Enclosure strongly recommended to prevent warping. Fan at 20–50% — nylon benefits from moderate cooling unlike ABS. Print speed of ${f.data?.speed_mm_s ?? '30–50'} mm/s. Use a hardened steel nozzle for glass or carbon-filled nylon variants.`,
    whyChoose: (f) =>
      `${f.name} delivers mechanical properties that no other common FDM filament matches at its price point. ${f.data?.brand ? `${f.data.brand}` : 'This manufacturer'} engineers their nylon for consistent melt flow index which directly impacts layer bonding strength — the most critical variable in structural nylon prints. Self-lubricating properties make printed gears, bearings, and sliding mechanisms viable without added lubricant. Impact resistance far exceeds ABS or PETG. The trade-offs (moisture sensitivity, print difficulty, cost) are real, but for load-bearing, high-cycle mechanical parts, nylon is the clear choice among FDM materials accessible to desktop printers.`,
    whatToPrint: (f) =>
      `${f.name} targets high-stress mechanical parts that no other common filament handles as well: gears, bushings, hinges with high cycle counts, tool clips, cable management under tension, and structural brackets in industrial environments. Nylon's self-lubricating nature means printed nylon gears meshing with nylon gears run smoothly without grease. Flex hinges ("living hinges") work in nylon where they fail in stiffer materials. PA12 variants are used in medical device prototypes and robotics. Any part that needs to survive thousands of cycles without fatigue cracking belongs in nylon.`,
    commonIssues:
      'Moisture: the #1 issue. Wet nylon sounds like popping, shows rough surfaces, poor bonding. Dry 70°C for 8 hours minimum. Warping: garolite bed + enclosure + brim + slow first layer. Stringing: nylon strings heavily — increase retraction, lower temp 5°C, increase travel speed. Bed adhesion: garolite outperforms everything else for nylon; PEI with glue stick works. Print failures mid-job from moisture: use a dry box with PTFE tube feeding directly to extruder. Shrinkage: nylon shrinks more than PLA — add 0.2–0.5% scaling on critical dimensions.',
  },
  TPU: {
    printGuide: (f) =>
      `Flexible TPU requires a fundamentally different approach than rigid filaments. Direct drive extruders handle TPU far better than Bowden setups — Bowden tubes cause buckling and inconsistent extrusion on soft materials. Nozzle: ${f.data?.print_temp_c_range ?? '220–240'}°C. ${f.data?.bed_temp_c !== undefined ? `Bed at ${f.data.bed_temp_c}°C` : 'Bed at 30–60°C'} — TPU adheres well to PEI at moderate temps. Print speed is the critical variable: ${f.data?.speed_mm_s ?? '15–30'} mm/s maximum — faster speeds cause the TPU to compress and buckle in the extruder path before it reaches the nozzle. Retraction: disable or minimize (0–1mm) — TPU rebounds elastically, causing underextrusion if retraction is too aggressive. Fan cooling at 50–100% for detail retention.`,
    whyChoose: (f) =>
      `${f.name} balances printability and mechanical flexibility better than most TPU options. ${f.data?.brand ? `${f.data.brand}` : 'The manufacturer'} rates their TPU for consistent Shore hardness batch-to-batch — critical for functional parts like gaskets where compliance matters. TPU's chemical resistance to oils, greases, and many solvents makes it viable in industrial environments where rubber parts wear out. Abrasion resistance is significantly higher than rigid filaments. The predictable elastic recovery of quality TPU means printed springs and compression pads behave consistently across cycles, unlike cheaper formulations that creep under sustained load.`,
    whatToPrint: (f) =>
      `${f.name} is the material for anything that needs to flex, grip, or absorb shock. Phone cases, tablet bumpers, protective covers for electronics. Gaskets, o-ring replacements, and custom seals for low-pressure applications. Shoe insoles, orthotic inserts, and ergonomic grips. Drone motor mounts that absorb vibration. Cable strain relief boots. Flexible hinges for boxes and enclosures. Tires for RC cars and robot wheels. The higher the Shore hardness rating, the stiffer the part — 95A is firm (like a shoe sole), 85A is more rubber-like, and 70A is very soft and stretchy.`,
    commonIssues:
      'Buckling in Bowden tubes: switch to direct drive — this is the root cause of 90% of TPU failures. Stringing: lower temp 5°C, minimize retraction, reduce travel speed. Underextrusion: slow down further, check extruder grip, ensure filament is straight going into extruder. Elephant foot: raise Z-offset slightly — TPU squishes more than rigid filaments. Difficult removal from bed: let cool completely before removing; TPU contracts and releases cleanly. Inconsistent extrusion: TPU must be stored dry (absorbs moisture); dry at 50°C for 4 hours.',
  },
  Resin: {
    printGuide: (f) =>
      `Resin printing operates on completely different physics from FDM — photopolymer resin is cured layer by layer with UV light (MSLA/DLP) rather than melted and extruded. ${f.name} should be thoroughly shaken before use to suspend pigments evenly. Temperature matters: resin viscosity changes significantly with ambient temp — keep your resin and printer above 20°C (ideally 25–30°C) for optimal flow and adhesion. ${f.data?.print_temp_c_range ? `Recommended exposure settings: ${f.data.print_temp_c_range}.` : 'Exposure times vary by printer wattage and UV wavelength — start with manufacturer settings and adjust by ±5%.'} After printing: wash in IPA or dedicated resin cleaner for 3–5 minutes, cure under UV light for 2–5 minutes per side. Always wear nitrile gloves — uncured resin is a skin sensitizer.`,
    whyChoose: (f) =>
      `${f.name} delivers detail resolution that FDM filaments cannot match. Layer heights of 25–50 microns produce smooth surfaces, intricate undercuts, and fine features that require no post-processing sanding on most consumer MSLA printers. ${f.data?.brand ? `${f.data.brand}` : 'This brand'} formulates for consistent cure characteristics that reduce print failures from under or over-exposure. Standard (non-ABS-like) resins cure brittle — this is expected. Tough and ABS-like formulations add flexibility and impact resistance for functional miniature parts, custom jewelry, dental models, and engineering prototypes where FDM surface quality is insufficient.`,
    whatToPrint: (f) =>
      `${f.name} is the tool for micro-detail work: tabletop miniatures (28mm scale and smaller), jewelry masters for casting, dental models, hearing aid shells, cosplay detail pieces, and architectural scale models requiring extreme surface quality. Product prototypes where injection-mold appearance matters use resin for client presentations. Watch components, gear trains at small scale, and micro-enclosures for PCBs are all resin territory. If the part needs to be machined or functional at scale, FDM is likely better — resin shines at small-scale, detail-critical applications where surface finish is non-negotiable.`,
    commonIssues:
      'Prints not adhering to build plate: level the plate carefully, increase bottom exposure layers, clean FEP regularly. FEP film damage: replace FEP when you see cloudiness or scratches — it directly affects print quality. Suction cup failures on large flat parts: add relief holes or drain channels to flat surfaces. Resin pigment settling: shake bottle thoroughly before every pour. Brittle prints: this is normal for standard resin; switch to ABS-like or tough resin for functional parts. Safety: wear gloves, work in ventilated area, dispose of uncured resin per local hazardous waste regulations — do not pour down drains.',
  },
};

// ─── generateStaticParams ────────────────────────────────────────────────────

export async function generateStaticParams() {
  const filaments = await getAllFilaments();
  const categories = await getCategories();
  const params: { category: string; slug: string }[] = [];
  for (const cat of categories) {
    const catSlug = toSlug(cat.category);
    const items = filaments.filter((f) => toSlug(f.category) === catSlug);
    for (const item of items) {
      params.push({ category: catSlug, slug: toSlug(item.name) });
    }
  }
  return params;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const filaments = await getAllFilaments();
  const filament = filaments.find(
    (f) => toSlug(f.category) === category && toSlug(f.name) === slug,
  );
  if (!filament) return {};
  return {
    title: `${filament.name} — ${filament.category} Filament Review & Print Settings`,
    description: `${filament.name} print settings, temperatures, brand guide, and use cases. ${filament.data?.print_temp_c_range ? `Print temp: ${filament.data.print_temp_c_range}°C.` : ''} Compare with other ${filament.category} filaments in the PrintLog3D library.`,
    alternates: {
      canonical: `https://www.printlog3d.com/library/${category}/${slug}`,
    },
  };
}

// ─── Schema helpers ───────────────────────────────────────────────────────────

function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function ArticleSchema({ filament, url }: { filament: FilamentItem; url: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${filament.name} — ${filament.category} Filament Review & Print Settings`,
    description: filament.description ?? `Print settings and guide for ${filament.name} ${filament.category} filament.`,
    url,
    author: { '@type': 'Organization', name: 'Anvil Road LLC' },
    publisher: {
      '@type': 'Organization',
      name: 'PrintLog3D',
      logo: { '@type': 'ImageObject', url: 'https://www.printlog3d.com/favicon.svg' },
    },
    dateModified: new Date().toISOString().split('T')[0],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Spool icon SVG ───────────────────────────────────────────────────────────

function SpoolIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 opacity-40"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="20" stroke="white" strokeWidth="3" />
      <circle cx="32" cy="32" r="10" stroke="white" strokeWidth="3" />
      <path d="M12 32 H52" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 12 V52" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function FilamentDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const filaments = await getAllFilaments();

  const filament = filaments.find(
    (f) => toSlug(f.category) === category && toSlug(f.name) === slug,
  );

  if (!filament) notFound();

  const guide = CATEGORY_GUIDES[filament.category];

  const pageUrl = `https://www.printlog3d.com/library/${category}/${slug}`;
  const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(filament.name)}`;

  // Related filaments: up to 4 others in the same category
  const related = filaments
    .filter((f) => f.category === filament.category && f.name !== filament.name)
    .slice(0, 4);

  const specs = [
    { label: 'Brand', value: filament.data?.brand },
    { label: 'Material', value: filament.data?.material ?? filament.category },
    { label: 'Print temp', value: filament.data?.print_temp_c_range ? `${filament.data.print_temp_c_range}°C` : undefined },
    { label: 'Bed temp', value: filament.data?.bed_temp_c !== undefined ? `${filament.data.bed_temp_c}°C` : undefined },
    { label: 'Speed', value: filament.data?.speed_mm_s !== undefined ? `${filament.data.speed_mm_s} mm/s` : undefined },
    { label: 'Cost/kg', value: filament.data?.cost_per_kg_usd !== undefined ? `$${filament.data.cost_per_kg_usd}` : undefined },
  ].filter((s): s is { label: string; value: string } => Boolean(s.value));

  return (
    <>
      <SiteNav />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.printlog3d.com' },
          { name: 'Library', url: 'https://www.printlog3d.com/library' },
          { name: filament.category, url: `https://www.printlog3d.com/library/${category}` },
          { name: filament.name, url: pageUrl },
        ]}
      />
      <ArticleSchema filament={filament} url={pageUrl} />

      <main id="main-content" className="pt-20">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="px-4 py-3 bg-white border-b border-gray-100">
          <ol className="max-w-3xl mx-auto flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-violet-700 transition-colors">Home</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li><Link href="/library" className="hover:text-violet-700 transition-colors">Library</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li>
              <Link href={`/library/${category}`} className="hover:text-violet-700 transition-colors">
                {filament.category}
              </Link>
            </li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">{filament.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="py-12 px-4" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="max-w-3xl mx-auto">
            {/* Image or placeholder */}
            <div className="mb-8">
              {filament.image_url ? (
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={filament.image_url}
                    alt={`${filament.name} filament spool`}
                    className="w-full max-h-64 object-cover rounded-2xl"
                    loading="eager"
                  />
                  {filament.source_name && (
                    <figcaption className="mt-2 text-xs text-gray-400 text-center">
                      Image via {filament.source_name}
                      {filament.source_url && (
                        <>
                          {' '}·{' '}
                          <a
                            href={filament.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-violet-600"
                          >
                            Source
                          </a>
                        </>
                      )}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center">
                  <SpoolIcon />
                </div>
              )}
            </div>

            {/* Category badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-violet-700 bg-violet-100 px-3 py-1 rounded-full mb-4">
              <Thermometer size={12} /> {filament.category}
              {filament.subcategory && ` · ${filament.subcategory}`}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {filament.name} — {filament.category} Filament Review &amp; Print Settings
            </h1>

            {filament.rating !== null && (
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(filament.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-1 text-sm text-gray-500">{filament.rating}/5</span>
              </div>
            )}

            {filament.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{filament.description}</p>
            )}
          </div>
        </section>

        {/* Quick specs card */}
        <section className="py-10 px-4 bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Zap size={18} className="text-violet-600" /> Quick Specs
            </h2>
            {specs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {specs.map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</div>
                    <div className="text-base font-semibold text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Detailed specs not available for this filament.</p>
            )}

            {/* Colors available */}
            {filament.data?.colors_available && filament.data.colors_available.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Colors Available</h3>
                <div className="flex flex-wrap gap-2">
                  {filament.data.colors_available.map((color) => (
                    <span
                      key={color}
                      className="text-xs font-medium bg-violet-50 text-violet-800 px-3 py-1 rounded-full border border-violet-100"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Print settings guide */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Print Settings Guide for {filament.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
              {guide ? guide.printGuide(filament) : `Set your nozzle temperature to ${filament.data?.print_temp_c_range ?? 'the manufacturer-recommended range'}°C and your bed to ${filament.data?.bed_temp_c !== undefined ? `${filament.data.bed_temp_c}°C` : 'the appropriate temperature for this material'}. Start at the lower end of the print temperature range and increase by 5°C increments until you achieve clean layer bonding. A direct-drive extruder provides better control on most materials. First layer: slow to 25 mm/s and check bed adhesion before walking away. Dial in retraction for your specific printer — start at 5mm for Bowden, 2mm for direct drive.`}
            </p>
          </div>
        </section>

        {/* Why choose */}
        <section className="py-12 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose {filament.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
              {guide ? guide.whyChoose(filament) : `${filament.name} is a ${filament.category} filament${filament.data?.brand ? ` from ${filament.data.brand}` : ''} that delivers reliable results across a range of print conditions. Community reception has been positive for its consistent diameter and batch-to-batch color accuracy. ${filament.subcategory ? `As a ${filament.subcategory}, it sits in a specific performance tier within the ${filament.category} family.` : ''} When comparing ${filament.category} options, consider print temperature range, brand support, and availability of your preferred color.`}
            </p>
          </div>
        </section>

        {/* What to print */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What to Print with {filament.name}
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
              {guide ? guide.whatToPrint(filament) : `${filament.name} is well-suited for projects that align with the mechanical and thermal properties of ${filament.category}. Functional parts, display models, and tooling inserts are common applications. Match the material to the end-use environment: consider heat exposure, UV, humidity, and mechanical stress before committing to a full print run. Start with small test pieces to validate settings before printing large, time-intensive projects.`}
            </p>
          </div>
        </section>

        {/* Common issues */}
        <section className="py-12 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Common Issues &amp; Fixes
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
              {guide ? guide.commonIssues : `${filament.category} filaments share common troubleshooting patterns. Stringing: reduce temperature and increase retraction. Bed adhesion failures: clean with IPA, adjust Z-offset, ensure correct bed temperature. Layer delamination: increase nozzle temperature and slow print speed. Moisture: store all filaments with desiccant and dry before use if stored over 3 months.`}
            </p>
          </div>
        </section>

        {/* Notes from data */}
        {filament.data?.notes && (
          <section className="py-10 px-4 bg-violet-50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Notes</h2>
              <p className="text-gray-700 leading-relaxed text-sm bg-white rounded-xl p-5 border border-violet-100">
                {filament.data.notes}
              </p>
            </div>
          </section>
        )}

        {/* Where to buy */}
        <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-violet-600" /> Where to Buy {filament.name}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Find {filament.name} from Amazon and authorized resellers. Price comparison helps — filament costs vary by vendor, fulfillment location, and quantity. Check manufacturer storefronts for direct pricing and bundle deals.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px]"
              >
                <ExternalLink size={16} /> Search Amazon
              </a>
              {filament.source_url && (
                <a
                  href={filament.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors min-h-[48px]"
                >
                  <ExternalLink size={16} /> {filament.source_name ?? 'Manufacturer site'}
                </a>
              )}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              PrintLog3D participates in the Amazon Associates program. Purchases through our links may earn a small commission at no extra cost to you.
            </p>
          </div>
        </section>

        {/* App CTA */}
        <section className="py-14 px-4 bg-violet-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Log your {filament.category} prints in PrintLog3D
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Track your actual settings for {filament.name} — nozzle temp, bed adhesion, slicer profile, and results.
              Build a settings history that tells you exactly what works.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/free-download"
                className="inline-flex items-center justify-center gap-2 bg-violet-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-violet-800 transition-colors min-h-[48px]"
              >
                <Download size={18} /> Free Download
              </Link>
              <Link
                href={`/library/${category}`}
                className="inline-flex items-center justify-center gap-2 border border-violet-200 text-violet-800 font-medium px-8 py-3 rounded-xl hover:bg-violet-100 transition-colors min-h-[48px]"
              >
                More {filament.category} Filaments
              </Link>
            </div>
          </div>
        </section>

        {/* Related filaments */}
        {related.length > 0 && (
          <section className="py-14 px-4 bg-white border-t border-gray-100">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Related {filament.category} Filaments
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((rel) => (
                  <Link
                    key={rel.name}
                    href={`/library/${toSlug(rel.category)}/${toSlug(rel.name)}`}
                    className="group flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-violet-50 hover:border-violet-200 border border-transparent transition-all"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors text-sm">
                        {rel.name}
                      </div>
                      {rel.data?.brand && (
                        <div className="text-xs text-gray-500 mt-0.5">{rel.data.brand}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-violet-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View <DollarSign size={11} className="sr-only" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <SiteFooter />
    </>
  );
}
