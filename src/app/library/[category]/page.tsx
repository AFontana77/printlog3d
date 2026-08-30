import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Faq, type FaqItem } from '@/components/Faq';
import { GearAdvice, type GearSpec } from '@/components/GearAdvice';
import { FilamentBuying } from '@/components/FilamentBuying';
import { PrintServiceRoute } from '@/components/PrintServiceRoute';
import { needsServiceRoute } from '@/lib/commerce';
import { workshopForMaterial } from '@/lib/workshop';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import { canOfferOwnedService } from '@/lib/ownedService';
import { MATERIAL_PROFILES, getMaterialBySlug, iconFor, type MaterialProfile, iconSrc } from '@/lib/materials';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Thermometer, Box, Wind, Droplets, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

/**
 * Material profile page - the canonical entity for this property.
 *
 * This route used to list every brand-plus-material row in the `items` table
 * as though each were a purchasable product. It is not: that table is a
 * cartesian product of 30 brands against 17 materials, so it asserted that
 * every brand sells every material. It also rendered a literal "NaN-NaN C"
 * because the card read field names the table does not have.
 *
 * The material itself is the thing we can describe truthfully and the thing
 * people actually search for, so the material is now what this page is about.
 */

const BASE = 'https://www.printlog3d.com';

export async function generateStaticParams() {
  return MATERIAL_PROFILES.map((m) => ({ category: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const m = getMaterialBySlug(category);
  if (!m) return {};
  return {
    title: `${m.category} print settings: ${m.printTempC}C nozzle, ${m.bedTempC}C bed`,
    description: `${m.category} (${m.fullName}) print temperature, bed temperature, enclosure and drying requirements. ${m.summary}`,
    alternates: { canonical: `${BASE}/library/${m.slug}` },
  };
}

/** Guides that genuinely relate to this material. Kills the orphan cluster. */
function relatedGuides(m: MaterialProfile): { href: string; label: string }[] {
  const out: { href: string; label: string }[] = [];
  const cat = m.category;
  if (cat === 'PLA' || cat.startsWith('PLA ')) {
    out.push({ href: '/pla-vs-petg', label: 'PLA vs PETG: which should you print?' });
    out.push({ href: '/pla-vs-abs', label: 'PLA vs ABS: strength and heat compared' });
  }
  if (cat === 'PETG' || cat === 'PETG-CF' || cat === 'PCTG' || cat === 'CPE') {
    out.push({ href: '/pla-vs-petg', label: 'PLA vs PETG: which should you print?' });
    out.push({ href: '/abs-vs-petg', label: 'ABS vs PETG: picking the tougher part' });
    out.push({ href: '/3d-print-stringing', label: 'How to stop stringing' });
  }
  if (cat === 'ABS' || cat === 'ASA' || cat === 'HIPS') {
    out.push({ href: '/pla-vs-abs', label: 'PLA vs ABS: strength and heat compared' });
    out.push({ href: '/abs-vs-petg', label: 'ABS vs PETG: picking the tougher part' });
  }
  if (m.needsDrying) {
    out.push({ href: '/how-to-dry-filament', label: 'How to dry filament properly' });
  }
  out.push({ href: '/3d-printing-filament-guide', label: 'The full filament guide' });
  // De-duplicate while preserving order.
  const seen = new Set<string>();
  return out.filter((g) => (seen.has(g.href) ? false : (seen.add(g.href), true)));
}

/** Gear this material genuinely requires. Never generic upsell. */
function gearFor(m: MaterialProfile): GearSpec[] {
  const out: GearSpec[] = [];
  if (m.needsDrying) {
    const dryTemp = m.drying.match(/(\d+)(?:-(\d+))?C/);
    // "Must reach AT LEAST x" is the LOW end of the range, not the high end.
    // Reading the upper bound demanded 80C for nylon when the site's own data
    // says 70-80C, and 80C is above what most real dryers deliver.
    const needed = dryTemp ? Number(dryTemp[1]) : 65;
    const ceiling = dryTemp ? Number(dryTemp[2] ?? dryTemp[1]) : 65;
    // Consumer filament dryers top out around 90C. Above that, pointing the
    // reader at a dryer sends them after a product that cannot do the job,
    // and contradicts this page's own drying section.
    if (ceiling <= 90) {
      out.push({
        category: 'Filament dryer',
        requirement: `Must reach at least ${needed}C`,
        why: `${m.category} will not print cleanly wet, and many budget dryers stop at 55-60C. Check the maximum temperature before buying, not the marketing copy.`,
        // At 70C and above, a temperature-token search returns thin and
        // partly unsuitable results; searching for nylon-rated units does not.
        searchTerms: needed >= 70 ? 'filament dryer nylon' : `filament dryer ${needed}C`,
      });
    } else {
      out.push({
        category: 'High-temperature oven',
        requirement: `Must hold ${ceiling}C steadily`,
        why: `${m.category} needs drying well above what any consumer filament dryer reaches. This is lab oven territory, not a spool warmer, and it is one of the reasons the material is impractical on a desktop setup.`,
        searchTerms: 'laboratory drying oven',
      });
    }
  }
  if (m.enclosure === 'Required') {
    out.push({
      category: 'Printer enclosure',
      requirement: 'Fully closed, with a door',
      why: `${m.category} warps when a draught cools the part unevenly. An enclosure holds chamber heat steady, which fixes lifting corners and split layers more reliably than any slicer setting.`,
      searchTerms: '3d printer enclosure',
    });
  }
  // Warping is the named failure of every enclosure-required material, and
  // adhesion is the half of that fix people skip. Query verified: 4/4 genuine
  // PEI plates. "flexible build plate spring steel" was rejected - it returned
  // resin-printer plates.
  if (m.enclosure === 'Required') {
    out.push({
      category: 'Bed adhesion',
      requirement: 'PEI sheet sized to your bed, or a PVP glue stick',
      why: `${m.category} lifts at the corners before it fails anywhere else. A textured PEI surface plus a thin glue layer holds the first layer down while the chamber comes up to temperature.`,
      searchTerms: 'PEI build plate 3d printer',
    });
  }

  // Functional parts get bolted to things. Verified: 4/4 genuine brass inserts.
  if (
    m.goodFor.some((g) =>
      /functional|bracket|gear|structural|load-bearing|snap-fit|jig|mount|fixture/i.test(g),
    )
  ) {
    out.push({
      category: 'Heat-set threaded inserts',
      requirement: 'Brass, M3 unless your design says otherwise',
      why: `Printed threads strip. If you are making ${m.goodFor[0].toLowerCase()} out of ${m.category}, melting brass inserts in gives you a metal thread that survives being undone more than once.`,
      searchTerms: 'threaded inserts m3 brass',
    });
  }

  // Only where clogging is the material's OWN documented failure.
  if (/clog/i.test(m.commonProblem)) {
    out.push({
      category: 'Nozzle cleaning kit',
      requirement: 'Needles sized to your nozzle, plus a spare nozzle or two',
      why: `${m.category} is the material most likely to block a nozzle mid-print. Cleaning needles clear a partial blockage without a full teardown.`,
      searchTerms: 'nozzle cleaning kit 3d printer needles',
    });
  }

  if (m.avoidFor.some((a) => a.toLowerCase().includes('brass nozzle'))) {
    out.push({
      category: 'Hardened steel nozzle',
      requirement: 'Hardened steel or ruby, matching your hot end',
      why: `${m.category} is abrasive and will widen a brass nozzle within a print or two. Fit the hardened nozzle before the first print - the symptom, worsening underextrusion, looks like a dozen other faults.`,
      searchTerms: 'hardened steel nozzle 3d printer',
    });
  }
  if (m.needsDrying) {
    out.push({
      category: 'Airtight storage with desiccant',
      requirement: 'Sealed container plus rechargeable desiccant',
      why: 'Drying a spool once achieves nothing if it sits open afterwards. Storage is what keeps the filament usable between prints.',
      searchTerms: 'filament storage container desiccant',
    });
  }
  return out;
}

/**
 * Join a list into a sentence clause without destroying casing. The previous
 * version lowercased the whole string, which turned "continuous service above
 * 150C" into "150c" and would do the same to every acronym in the data.
 */
function lowerFirst(items: string[]): string {
  return items
    .map((s) => (/^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s))
    .join(', ');
}

function faqFor(m: MaterialProfile): FaqItem[] {
  const items: FaqItem[] = [
    {
      question: `What temperature do you print ${m.category} at?`,
      answer: `${m.category} prints at a nozzle temperature of ${m.printTempC}C with the bed at ${m.bedTempC}C. Start at the lower end of the nozzle range and raise it in 5C steps until layers bond cleanly.`,
    },
    {
      question: `Does ${m.category} need an enclosure?`,
      answer:
        m.enclosure === 'Required'
          ? `Yes. ${m.category} needs an enclosure. Without one the part cools unevenly, corners lift off the bed and layers split partway up the print.`
          : m.enclosure === 'Recommended'
            ? `An enclosure is recommended but not essential for ${m.category}. It mainly helps with larger parts and draughty rooms.`
            : `No. ${m.category} prints fine on an open-frame printer at normal room temperature.`,
    },
    {
      question: `Do you need to dry ${m.category}?`,
      answer: m.drying,
    },
    {
      question: `What is ${m.category} good for?`,
      answer: `${m.category} suits ${lowerFirst(m.goodFor)}. Avoid it for ${lowerFirst(m.avoidFor)}.`,
    },
    {
      question: `How much does ${m.category} cost?`,
      answer: `A 1 kg spool of ${m.category} typically sells for ${m.priceBandUsd}. That is an indicative street price rather than a live figure, so check the retailer for today's cost.`,
    },
  ];
  return items;
}

function SpecCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
        {icon}
        {label}
      </div>
      <div className="text-base font-semibold text-gray-900">{value}</div>
    </div>
  );
}

export default async function MaterialPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const m = getMaterialBySlug(category);
  if (!m) notFound();

  const pageUrl = `${BASE}/library/${m.slug}`;
  const guides = relatedGuides(m);
  const gear = gearFor(m);
  const faq = faqFor(m);
  const compared = MATERIAL_PROFILES.find((x) => x.category === m.comparedWith);

  // Rotate the sibling list starting after this material so every profile
  // receives inbound links, rather than the first few collecting them all.
  const idx = MATERIAL_PROFILES.findIndex((x) => x.slug === m.slug);
  const siblings = [
    ...MATERIAL_PROFILES.slice(idx + 1),
    ...MATERIAL_PROFILES.slice(0, idx),
  ].slice(0, 6);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Materials', item: `${BASE}/library` },
      { '@type': 'ListItem', position: 3, name: m.category, item: pageUrl },
    ],
  };

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${m.category} print settings and material guide`,
    description: m.summary,
    url: pageUrl,
    author: { '@type': 'Organization', name: 'Anvil Road LLC' },
    publisher: {
      '@type': 'Organization',
      name: 'PrintLog3D',
      logo: { '@type': 'ImageObject', url: `${BASE}/favicon.svg` },
    },
  };

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />

      <main id="main-content" className="pt-20">
        <nav aria-label="Breadcrumb" className="px-4 py-3 bg-white border-b border-gray-100">
          <ol className="max-w-3xl mx-auto flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-brand-dark transition-colors">Home</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li><Link href="/library" className="hover:text-brand-dark transition-colors">Materials</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li className="text-gray-900 font-medium" aria-current="page">{m.category}</li>
          </ol>
        </nav>

        {/* Answer first. This is the block an assistant should be able to quote. */}
        <section className="py-12 px-4" style={{ backgroundColor: '#F5F3FF' }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-5 mb-5">
              <Image
                src={iconSrc(iconFor(m))}
                alt=""
                aria-hidden="true"
                width={72}
                height={72}
                priority
                className="h-16 w-16 sm:h-[72px] sm:w-[72px] flex-shrink-0"
              />
              <div className="min-w-0">
                <h1
                  className="text-3xl sm:text-4xl font-bold mb-1 leading-tight"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}
                >
                  {m.category} print settings
                </h1>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {m.fullName} &middot; {m.difficulty}
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>{m.category}</strong> ({m.fullName}) prints at{' '}
              <strong>{m.printTempC}&deg;C</strong> with the bed at <strong>{m.bedTempC}&deg;C</strong>.{' '}
              {m.enclosure === 'Required'
                ? 'It needs an enclosure.'
                : m.enclosure === 'Recommended'
                  ? 'An enclosure helps but is not essential.'
                  : 'No enclosure needed.'}{' '}
              {m.needsDrying ? 'Dry the filament before printing.' : 'Drying is rarely necessary.'}
            </p>
            <p className="text-gray-600 leading-relaxed">{m.summary}</p>
          </div>
        </section>

        <section className="py-10 px-4 bg-gray-50 border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Settings at a glance</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <SpecCard icon={<Thermometer size={12} aria-hidden="true" />} label="Nozzle" value={`${m.printTempC}°C`} />
              <SpecCard icon={<Thermometer size={12} aria-hidden="true" />} label="Bed" value={`${m.bedTempC}°C`} />
              <SpecCard icon={<Box size={12} aria-hidden="true" />} label="Enclosure" value={m.enclosure} />
              <SpecCard icon={<Wind size={12} aria-hidden="true" />} label="Part cooling" value={m.coolingFan} />
              <SpecCard icon={<Thermometer size={12} aria-hidden="true" />} label="Retraction" value={m.retraction} />
              <SpecCard icon={<Droplets size={12} aria-hidden="true" />} label="Typical price" value={`${m.priceBandUsd} / kg`} />
            </div>
            <p className="mt-4 text-xs text-gray-500">
              Ranges are typical manufacturer-published figures for this material class, not measurements we
              took. Always start with your filament maker&rsquo;s own numbers where they differ. The price is an
              indicative street price for a 1 kg spool, not a live quote.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600" aria-hidden="true" /> Good for
              </h2>
              <ul className="space-y-2">
                {m.goodFor.map((g) => (
                  <li key={g} className="text-gray-600 text-sm leading-relaxed flex gap-2">
                    <span aria-hidden="true" className="text-green-600">&bull;</span> {g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <XCircle size={18} className="text-red-500" aria-hidden="true" /> Avoid for
              </h2>
              <ul className="space-y-2">
                {m.avoidFor.map((g) => (
                  <li key={g} className="text-gray-600 text-sm leading-relaxed flex gap-2">
                    <span aria-hidden="true" className="text-red-500">&bull;</span> {g}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-amber-50 border-y border-amber-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" aria-hidden="true" />
              The problem people actually hit
            </h2>
            <p className="text-gray-700 leading-relaxed">{m.commonProblem}</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Droplets size={18} className="text-brand" aria-hidden="true" /> Drying
            </h2>
            <p className="text-gray-700 leading-relaxed">{m.drying}</p>
          </div>
        </section>

        {needsServiceRoute(m) && <PrintServiceRoute material={m} />}

        <FilamentBuying material={m} />

        {canOfferOwnedService(m) && <OwnedServiceCta variant="material" material={m} />}

        <GearAdvice
          heading={`What you need to print ${m.category}`}
          intro={`Gear that ${m.category} genuinely requires, with the specification that decides whether a given unit will actually work.`}
          items={gear}
        />

        <Faq items={faq} heading={`${m.category} questions`} />

        {compared && (
          <section className="py-12 px-4 bg-brand-tint border-t border-brand-soft">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {m.category} or {compared.category}?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {compared.category} ({compared.fullName}) prints at {compared.printTempC}&deg;C with a{' '}
                {compared.bedTempC}&deg;C bed and{' '}
                {compared.enclosure === 'Required' ? 'needs an enclosure' : 'needs no enclosure'}.{' '}
                {compared.summary}
              </p>
              <Link
                href={`/library/${compared.slug}`}
                className="inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-dark min-h-[44px]"
              >
                Read the {compared.category}{' '}settings guide &rarr;
              </Link>
            </div>
          </section>
        )}

        {workshopForMaterial(m.slug).length > 0 && (
          <section className="py-12 px-4 border-t" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                After the print
              </h2>
              <p className="text-sm mb-5" style={{ color: 'var(--muted-foreground)' }}>
                The workshop steps that matter most for {m.category}.
              </p>
              <ul className="space-y-2">
                {workshopForMaterial(m.slug).map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/workshop/${r.slug}`}
                      className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4"
                    >
                      {r.heading}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="py-12 px-4 bg-white border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Guides that cover {m.category}</h2>
            <ul className="space-y-3">
              {guides.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className="text-brand hover:text-brand-dark font-medium underline underline-offset-4"
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Other materials</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/library/${s.slug}`}
                  className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-brand-soft hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-gray-900">{s.category}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {s.printTempC}&deg;C nozzle &middot; {s.bedTempC}&deg;C bed
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/library"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-brand hover:text-brand-dark min-h-[44px]"
            >
              All {MATERIAL_PROFILES.length}{' '}materials &rarr;
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
