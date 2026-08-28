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
import { Download, Thermometer, Zap, ArrowRight } from 'lucide-react';
import { getMaterialByCategory } from '@/lib/materials';

// ─── Static copy per category ────────────────────────────────────────────────


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
  const profile = getMaterialByCategory(filament.category);
  return {
    // Catalogue entries are deliberately not indexed. See the note on the page
    // component: these rows are a brand-by-material grid, not verified
    // products, so they must not be offered to search or to assistants as
    // product pages. They stay reachable because inbound links to them exist.
    robots: { index: false, follow: true },
    title: `${filament.name} catalogue entry`,
    description: `Catalogue entry for ${filament.name}. ${profile ? `${filament.category} prints at ${profile.printTempC}°C with a ${profile.bedTempC}°C bed.` : ''} See the ${filament.category} material guide for verified settings.`,
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
    headline: `${filament.name} catalogue entry`,
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


  const pageUrl = `https://www.printlog3d.com/library/${category}/${slug}`;

  const profile = getMaterialByCategory(filament.category);


  // data.price_usd exists on every row and is deliberately NOT read. The
  // stored figures are unsourced and wrong by more than an order of magnitude
  // on the engineering materials (PEEK is recorded at $18-39/kg against a real
  // street price of $150-400/kg), so no price is shown here at all.
  const specs = [
    { label: 'Brand', value: filament.data?.brand },
    { label: 'Material', value: filament.data?.material_full ?? filament.data?.material ?? filament.category },
    { label: 'Nozzle temp', value: profile ? `${profile.printTempC}°C` : undefined },
    { label: 'Bed temp', value: profile ? `${profile.bedTempC}°C` : undefined },
    { label: 'Enclosure', value: profile?.enclosure },
    { label: 'Diameter', value: filament.data?.diameter },
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
            <li><Link href="/" className="hover:text-brand-dark transition-colors">Home</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li><Link href="/library" className="hover:text-brand-dark transition-colors">Library</Link></li>
            <li aria-hidden="true" className="text-gray-300">/</li>
            <li>
              <Link href={`/library/${category}`} className="hover:text-brand-dark transition-colors">
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
                    alt={`Spool of ${filament.category} filament. Generic material photograph, not this specific product.`}
                    className="w-full max-h-64 object-cover rounded-2xl"
                    loading="eager"
                  />
                  <figcaption className="mt-2 text-xs text-gray-400 text-center">
                    Illustrative photograph of {filament.category} filament. Shared across entries in this
                    material, and not a picture of this product.
                  </figcaption>
                </figure>
              ) : (
                <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
                  <SpoolIcon />
                </div>
              )}
            </div>

            {/* Category badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand bg-brand-tint px-3 py-1 rounded-full mb-4">
              <Thermometer size={12} /> {filament.category}
              {filament.subcategory && ` · ${filament.subcategory}`}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {filament.name}
            </h1>


            {filament.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{filament.description}</p>
            )}
          </div>
        </section>

        {/* Quick specs card */}
        <section className="py-10 px-4 bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Zap size={18} className="text-brand" /> Quick Specs
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

          </div>
        </section>

        {/* Print settings guide */}
        {/* One honest paragraph, sourced from the material profile. The four
            generated sections that stood here interpolated fields the table
            does not have, so they always rendered fallback text - including a
            claim about community reception of products that do not exist. */}
        {profile && (
          <section className="py-12 px-4 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Printing {filament.category}
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">{profile.summary}</p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Watch for this:</strong> {profile.commonProblem}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Drying:</strong> {profile.drying}
              </p>
            </div>
          </section>
        )}

        {/* Notes from data */}

        {/* Route the reader to the page that can actually answer them. This
            entry is one row of a brand-by-material grid; the material guide is
            the verified content. No Amazon link is shown because this site has
            no Associates tracking tag, and an untagged link would hand the
            visit away for nothing. */}
        {profile && (
          <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verified {filament.category} settings
              </h2>
              <p className="text-gray-600 mb-5 leading-relaxed">
                This is a catalogue entry. We have not confirmed that {filament.data?.brand ?? 'this brand'}{' '}
                sells {filament.category}, or checked its price or specification. The {filament.category}{' '}
                material guide carries the settings we can stand behind: {profile.printTempC}&deg;C nozzle,{' '}
                {profile.bedTempC}&deg;C bed,{' '}
                {profile.enclosure === 'Required' ? 'enclosure required' : 'no enclosure needed'}.
              </p>
              <Link
                href={`/library/${category}`}
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px]"
              >
                Read the {filament.category} guide <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        )}

        {/* The PrintLog3D app is not published on either store, so this block
            offers the reference sheet that does exist instead. */}
        <section className="py-14 px-4 bg-brand-tint">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Keep the {filament.category} numbers on your desk
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our one-page settings sheet covers every material we document, including{' '}
              {filament.category}. Free, no signup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/free-download"
                className="inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold px-8 py-3 rounded-xl hover:bg-brand-dark transition-colors min-h-[48px]"
              >
                <Download size={18} aria-hidden="true" /> Get the settings sheet
              </Link>
              <Link
                href={`/library/${category}`}
                className="inline-flex items-center justify-center gap-2 border border-brand-soft text-brand font-medium px-8 py-3 rounded-xl hover:bg-brand-tint transition-colors min-h-[48px]"
              >
                {filament.category} guide
              </Link>
            </div>
          </div>
        </section>


      </main>
      <SiteFooter />
    </>
  );
}
