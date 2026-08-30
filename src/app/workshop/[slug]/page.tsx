import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Faq } from '@/components/Faq';
import { GearAdvice } from '@/components/GearAdvice';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import { WORKSHOP, STAGES, resourceBySlug } from '@/lib/workshop';
import { getMaterialBySlug, iconFor } from '@/lib/materials';
import type { Metadata } from 'next';

/**
 * Workshop resource template.
 *
 * One template, six resources, all content from workshop.ts — so a new resource
 * cannot arrive with a different structure or drift from the journey it belongs
 * to. FAQ schema is emitted by the shared Faq component from the same constant
 * that renders the visible copy, so a claim cannot exist twice.
 */

const BASE = 'https://www.printlog3d.com';

export function generateStaticParams() {
  return WORKSHOP.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = resourceBySlug(slug);
  if (!r) return {};
  return {
    title: r.metaTitle,
    description: r.metaDescription,
    alternates: { canonical: `${BASE}/workshop/${r.slug}` },
  };
}

export default async function WorkshopResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = resourceBySlug(slug);
  if (!r) notFound();

  const stage = STAGES.find((s) => s.id === r.stage);
  const idx = WORKSHOP.findIndex((x) => x.slug === r.slug);
  const next = WORKSHOP[(idx + 1) % WORKSHOP.length];
  const materials = r.relatedMaterials.map(getMaterialBySlug).filter(Boolean);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: r.heading,
    description: r.metaDescription,
    url: `${BASE}/workshop/${r.slug}`,
    author: { '@type': 'Organization', name: 'Anvil Road LLC' },
    publisher: {
      '@type': 'Organization',
      name: 'PrintLog3D',
      logo: { '@type': 'ImageObject', url: `${BASE}/brand/emblem.webp` },
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Workshop', item: `${BASE}/workshop` },
      { '@type': 'ListItem', position: 3, name: r.title, item: `${BASE}/workshop/${r.slug}` },
    ],
  };

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" className="pt-20">
        <nav aria-label="Breadcrumb" className="px-6 py-3 border-b" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
          <ol className="max-w-3xl mx-auto flex flex-wrap items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <li><Link href="/" className="hover:text-brand">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/workshop" className="hover:text-brand">Workshop</Link></li>
            <li aria-hidden="true">/</li>
            <li style={{ color: 'var(--foreground)' }} aria-current="page">{r.title}</li>
          </ol>
        </nav>

        <section className="py-12 px-6 relative overflow-hidden" style={{ background: 'var(--surface-1)' }}>
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] brand-hatch pointer-events-none" />
          <div className="max-w-3xl mx-auto relative">
            <div className="flex items-start gap-5 mb-5">
              {stage && (
                <Image
                  src={`/brand/icons/${stage.icon}.png`}
                  alt=""
                  aria-hidden="true"
                  width={72}
                  height={72}
                  priority
                  className="h-16 w-16 sm:h-[72px] sm:w-[72px] flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <h1
                  className="text-3xl sm:text-4xl font-bold mb-1 leading-tight text-balance"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.02em' }}
                >
                  {r.heading}
                </h1>
                {stage && (
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Workshop &middot; {stage.label}
                  </p>
                )}
              </div>
            </div>

            <p className="text-lg leading-relaxed max-w-[62ch]" style={{ color: 'var(--body-text)' }}>
              {r.lede}
            </p>
          </div>
        </section>

        <article className="py-12 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-3xl mx-auto">
            {r.sections.map((sec) => (
              <section key={sec.heading} className="mb-10 last:mb-0">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
                >
                  {sec.heading}
                </h2>
                {sec.body.map((para, i) => (
                  <p key={i} className="leading-relaxed mb-4 last:mb-0 max-w-[68ch]" style={{ color: 'var(--body-text)' }}>
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>

        <GearAdvice
          heading="What this needs"
          intro="Each item is listed with the specification that decides whether a given product will actually do the job, because that is the part product titles tend to leave out."
          items={r.gear}
        />

        <Faq items={r.faq} heading="Common questions" />

        {materials.length > 0 && (
          <section className="py-12 px-6 border-t" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
            <div className="max-w-3xl mx-auto">
              <h2
                className="text-xl font-bold mb-5"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                Materials this matters most for
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {materials.map((m) => m && (
                  <li key={m.slug}>
                    <Link
                      href={`/library/${m.slug}`}
                      className="flex items-center gap-3 py-2.5 -mx-3 px-3 rounded-lg transition-colors hover:bg-brand-tint"
                    >
                      <Image
                        src={`/brand/icons/${iconFor(m)}.png`}
                        alt=""
                        aria-hidden="true"
                        width={40}
                        height={40}
                        loading="lazy"
                        className="h-10 w-10 flex-shrink-0"
                      />
                      <span className="min-w-0">
                        <span className="block font-semibold truncate" style={{ color: 'var(--foreground)' }}>{m.category}</span>
                        <span className="block text-xs tabular-nums" style={{ color: 'var(--muted-foreground)' }}>
                          {m.printTempC}&deg;C &middot; bed {m.bedTempC}&deg;C
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Only where outsourcing genuinely answers this reader's problem. */}
        {(r.stage === 'finish' || r.stage === 'assemble') && (
          <OwnedServiceCta variant="troubleshooting" tone="inline" />
        )}

        <section className="py-12 px-6 border-t" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <Link href="/workshop" className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4 min-h-[44px] flex items-center">
              &larr; All workshop guides
            </Link>
            <Link href={`/workshop/${next.slug}`} className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4 min-h-[44px] flex items-center">
              Next: {next.title} &rarr;
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
