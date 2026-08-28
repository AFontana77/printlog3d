import { ArrowRight, Factory } from 'lucide-react';
import type { MaterialProfile } from '@/lib/materials';
import { OWNED_SERVICE, capabilityFor, type CapabilityState } from '@/lib/ownedService';

/**
 * Owned-service route to 3DPrinterOnDemand.
 *
 * Rendered only where the capability gate says the service can actually do the
 * job. A CTA for a material it does not print would send a real customer to a
 * quote form that cannot quote them.
 *
 * The Anvil Road relationship is stated in the block itself, every time. This is
 * not an independent recommendation and must never read as one.
 *
 * Clicks fire `owned_service_click`, deliberately NOT `affiliate_click`: there
 * is no affiliate relationship, and mixing owned-service traffic into affiliate
 * numbers would corrupt both. The tracker classifies by destination host, and
 * 3dprinterondemand.com is not an affiliate network, so it would otherwise land
 * in `outbound_click`; the explicit data-event attribute overrides that.
 */

type Variant = 'material' | 'troubleshooting' | 'comparison' | 'guide-thanks';

const COPY: Record<
  Variant,
  { heading: (m?: string) => string; body: (m?: string) => string; cta: string }
> = {
  material: {
    heading: (m) => `Need the finished part instead of another spool of ${m}?`,
    body: (m) =>
      `Upload the model and get a price. ${m} is one of the materials the service prints, so the quote is automatic rather than a wait.`,
    cta: 'Get an instant quote',
  },
  troubleshooting: {
    heading: () => 'Need the part now, without another test print?',
    body: () =>
      'If you have spent the evening tuning and the deadline has not moved, having it printed is a legitimate answer. Upload the model and see a price before you commit.',
    cta: 'Get a printing quote',
  },
  comparison: {
    heading: () => 'Not printing it yourself?',
    body: () =>
      'If you would rather have the part arrive than pick a filament, upload the model and get a price in both materials.',
    cta: 'Upload a file for printing',
  },
  'guide-thanks': {
    heading: () => 'Need a part printed?',
    body: () =>
      'The guide covers printing it yourself. If you would rather not, the service prints PLA and PETG with an instant quote.',
    cta: 'Get a quote',
  },
};

function conditionalNote(state: CapabilityState, material?: string): string | null {
  if (state !== 'CONDITIONAL') return null;
  return `${material} is quoted by a person rather than instantly, so expect a reply rather than a price on the spot.`;
}

export function OwnedServiceCta({
  variant,
  material,
  tone = 'panel',
}: {
  variant: Variant;
  material?: MaterialProfile;
  /** `panel` is the standalone block; `inline` is a lighter end-of-article strip. */
  tone?: 'panel' | 'inline';
}) {
  const state = material ? capabilityFor(material) : 'SUPPORTED';
  if (material && state !== 'SUPPORTED' && state !== 'CONDITIONAL') return null;

  const copy = COPY[variant];
  const name = material?.category;
  const note = conditionalNote(state, name);

  return (
    <section
      className={
        tone === 'panel'
          ? 'py-14 px-4 border-t'
          : 'py-10 px-4 border-t'
      }
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      data-placement={`owned-service-${variant}`}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className={tone === 'panel' ? 'text-2xl font-bold mb-3 flex items-center gap-2' : 'text-lg font-bold mb-2 flex items-center gap-2'}
          style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
        >
          <Factory size={tone === 'panel' ? 20 : 18} style={{ color: 'var(--brand-primary)' }} aria-hidden="true" />
          {copy.heading(name)}
        </h2>

        <p className="leading-relaxed mb-2" style={{ color: 'var(--body-text)' }}>
          {copy.body(name)}
        </p>

        {note && (
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--muted-foreground)' }}>
            {note}
          </p>
        )}

        <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted-foreground)' }}>
          FDM only, up to {OWNED_SERVICE.maxDimensionMm}mm per side, shipping within the{' '}
          {OWNED_SERVICE.shipsTo}. Accepts {OWNED_SERVICE.fileTypes.join(', ')}.
        </p>

        <a
          href={OWNED_SERVICE.quoteUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-event="owned_service_click"
          data-owned-service={OWNED_SERVICE.domain}
          data-capability={state}
          data-material={name ?? 'none'}
          className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-colors min-h-[48px]"
          style={{ background: 'var(--brand-primary)', color: 'var(--on-primary)' }}
        >
          {copy.cta}
          <ArrowRight size={16} aria-hidden="true" />
        </a>

        <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
          <strong>Ownership:</strong> {OWNED_SERVICE.name} is {OWNED_SERVICE.relationship} We are not
          recommending it as an independent party, and where it cannot print a material we say so and
          point elsewhere.
        </p>
      </div>
    </section>
  );
}
