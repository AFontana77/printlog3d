import Link from 'next/link';
import type { SpecRow } from '@/components/ComparisonSpecs';
import { ABS_HEAT } from '@/lib/materials';

/**
 * Shared scaffolding for the material comparison pages.
 *
 * The four comparisons had 32 identical lines of design tokens, an identical
 * Eyebrow component, an identical JSON-LD graph and an identical spec grid,
 * copied four times. M1.5 already fixed the factual half of that duplication by
 * deriving the spec VALUES from materials.ts; this is the presentational half.
 *
 * Deliberately NOT a page template. Each comparison has genuinely different
 * editorial structure -- ABS vs PETG argues four cases, ASA vs ABS argues three
 * and adds a "neither, use PETG" section -- and flattening that into one
 * component would erase the differences that make each page worth reading.
 * Only the parts that were identical are shared.
 */

export const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'var(--brand-primary)',
  letterSpacing: '0.15em',
  fontSize: '0.7rem',
};
export const h2Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
  lineHeight: 1.1,
};
export const h3Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  color: 'var(--foreground)',
};
export const bodyStyle: React.CSSProperties = {
  color: 'var(--body-text)',
  fontFamily: 'var(--font-body)',
  lineHeight: 1.65,
};
export const linkStyle: React.CSSProperties = { color: 'var(--brand-primary)' };

export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div style={eyebrowStyle} className="uppercase font-semibold mb-6 flex items-center gap-3">
    <span
      style={{
        display: 'inline-block',
        width: '24px',
        height: '1px',
        background: 'var(--brand-primary)',
        flexShrink: 0,
      }}
    />
    {children}
  </div>
);

/**
 * The head-to-head grid.
 *
 * Rows come in already derived from materials.ts. This only decides how they
 * look, and it looks the same on all four pages because it always did -- it was
 * just written out four times.
 */
/**
 * Names the source of the ABS heat figure under any spec grid that shows it.
 * Reads ABS_HEAT, so the maker figures here cannot drift from materials.ts.
 */
export function AbsHeatNote() {
  const figures = ABS_HEAT.sources.map((s) => `${s.maker} ${s.hdtC}°C`).join(', ');
  return (
    <p className="mt-4 text-xs" style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
      Where the ABS heat figure comes from: it is the heat deflection temperature at 0.45 MPa on
      each maker&rsquo;s ABS data sheet ({figures}). These are the makers&rsquo; figures, not tests
      we ran. Links to each sheet are on our{' '}
      <Link href="/editorial-policy#abs-heat" style={linkStyle} className="underline underline-offset-4">
        editorial policy
      </Link>
      .
    </p>
  );
}

export function SpecGrid({ rows }: { rows: SpecRow[] }) {
  return (
    <div
      style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}
    >
      {rows.map(([prop, left, right], i) => (
        <div
          key={prop}
          style={{
            padding: '0.875rem 1.25rem',
            borderTop: i === 0 ? 'none' : '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: '200px 1fr 1fr',
            background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)',
          }}
        >
          <span
            style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-primary)' }}
            className="text-sm font-semibold"
          >
            {prop}
          </span>
          <span style={bodyStyle} className="text-sm">
            {left}
          </span>
          <span style={bodyStyle} className="text-sm">
            {right}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Article + BreadcrumbList.
 *
 * Deliberately NOT FAQPage. The shared <Faq> component already emits FAQPage
 * from the same array it renders, which is how this property guarantees the
 * visible questions and the structured ones cannot diverge. Emitting it here as
 * well would put two FAQPage blocks on one page.
 */
export function comparisonJsonLd({
  title,
  description,
  url,
  breadcrumb,
}: {
  title: string;
  description: string;
  url: string;
  breadcrumb: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        url,
        publisher: {
          '@type': 'Organization',
          name: 'PrintLog3D',
          url: 'https://www.printlog3d.com',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
          { '@type': 'ListItem', position: 2, name: breadcrumb, item: url },
        ],
      },
    ],
  };
}
