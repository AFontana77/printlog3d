'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MATERIAL_PROFILES } from '@/lib/materials';
import { OWNED_SERVICE, capabilityFor, quoteUrlFor } from '@/lib/ownedService';
import { servicesFor, outboundUrl } from '@/lib/commerce';

/**
 * Outsource decision tool.
 *
 * Routes on three things we can actually check: whether the owned service is
 * recorded as printing that material, whether the part fits its build volume,
 * and whether the reader owns a machine that can do the job.
 *
 * What it deliberately is NOT: a quote. 3DPrinterOnDemand takes a real file
 * through a real quote flow, and a number invented here would be a number
 * somebody plans around. It also never widens capability by inference -- an
 * UNKNOWN material refuses to route, exactly like `canOfferOwnedService`.
 *
 * The "print it yourself" outcome is a real outcome and is offered first when
 * it applies. A decision tool on a page owned by the service is only credible
 * if it is willing to answer "you do not need us".
 */

type Answer = 'yes' | 'no' | '';

export function OutsourceDecision() {
  const [slug, setSlug] = useState('');
  const [ownPrinter, setOwnPrinter] = useState<Answer>('');
  const [size, setSize] = useState<Answer>('');

  const material = MATERIAL_PROFILES.find((m) => m.slug === slug);
  const capability = material ? capabilityFor(material) : null;
  const alternatives = material ? servicesFor(material) : [];
  const answered = Boolean(material) && ownPrinter !== '' && size !== '';

  // Can the reader do it themselves? Only true if they have a machine and the
  // material does not demand hardware the profile says is required.
  const selfPrintable =
    material && ownPrinter === 'yes' && material.enclosure !== 'Required';

  const tooBig = size === 'no';

  return (
    <section
      className="py-14 px-4 border-t"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      data-placement="outsource-decision"
      aria-label="Should I outsource this print"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Should you send this one out?
        </h2>
        <p className="text-base mb-8 max-w-[62ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
          Three questions. This will tell you to print it yourself when that is the right
          answer, and it will tell you when we cannot print it either.
        </p>

        <div className="space-y-5 mb-8">
          <div>
            <label htmlFor="os-material" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              1. What material does the part need?
            </label>
            <select
              id="os-material"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border px-3 py-3 min-h-[48px] text-base"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-0)', color: 'var(--foreground)' }}
            >
              <option value="">Choose a material</option>
              {MATERIAL_PROFILES.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.category}
                </option>
              ))}
            </select>
          </div>

          <fieldset>
            <legend className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              2. Do you have a printer that can run it?
            </legend>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((v) => (
                <label
                  key={v}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 min-h-[48px] cursor-pointer"
                  style={{
                    borderColor: ownPrinter === v ? 'var(--brand-primary)' : 'var(--border)',
                    background: ownPrinter === v ? 'var(--surface-2)' : 'var(--surface-0)',
                    color: 'var(--foreground)',
                  }}
                >
                  <input
                    type="radio"
                    name="own-printer"
                    value={v}
                    checked={ownPrinter === v}
                    onChange={() => setOwnPrinter(v)}
                    className="sr-only"
                  />
                  {v === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              3. Does the part fit inside {OWNED_SERVICE.maxDimensionMm}mm in every direction?
            </legend>
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((v) => (
                <label
                  key={v}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 min-h-[48px] cursor-pointer"
                  style={{
                    borderColor: size === v ? 'var(--brand-primary)' : 'var(--border)',
                    background: size === v ? 'var(--surface-2)' : 'var(--surface-0)',
                    color: 'var(--foreground)',
                  }}
                >
                  <input
                    type="radio"
                    name="fits"
                    value={v}
                    checked={size === v}
                    onChange={() => setSize(v)}
                    className="sr-only"
                  />
                  {v === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
          aria-live="polite"
        >
          {!answered && (
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Answer all three and the recommendation appears here.
            </p>
          )}

          {answered && material && (
            <>
              {selfPrintable && (
                <>
                  <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                    Print it yourself.
                  </p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body-text)' }}>
                    {material.category} runs on a stock machine and you have one. Sending it out
                    costs money and days for a job your printer can do tonight. The settings are
                    on the profile.
                  </p>
                  <Link
                    href={`/library/${material.slug}`}
                    className="text-sm font-semibold underline underline-offset-4"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    {material.category} settings
                  </Link>
                </>
              )}

              {!selfPrintable && tooBig && (
                <>
                  <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                    Too big for us.
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--body-text)' }}>
                    {OWNED_SERVICE.name} builds up to {OWNED_SERVICE.maxDimensionMm}mm in each
                    direction. A larger part needs either splitting into pieces you bond together,
                    or a service with a bigger machine. Splitting is usually the cheaper answer,
                    and a keyed joint bonded with epoxy is stronger than most people expect.
                  </p>
                  <Link
                    href="/workshop/gluing-3d-printed-parts"
                    className="mt-3 inline-block text-sm font-semibold underline underline-offset-4"
                    style={{ color: 'var(--brand-primary)' }}
                  >
                    Joining printed parts
                  </Link>
                </>
              )}

              {!selfPrintable && !tooBig && (capability === 'SUPPORTED' || capability === 'CONDITIONAL') && (
                <>
                  <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                    {capability === 'SUPPORTED'
                      ? `We print ${material.category}.`
                      : `We can usually print ${material.category}, on request.`}
                  </p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body-text)' }}>
                    {capability === 'CONDITIONAL'
                      ? `${material.category} is handled case by case rather than through the instant quote, so it needs a human to confirm before anything is priced. Send the file and ask.`
                      : `Upload the file for a quote. ${OWNED_SERVICE.fileTypes.join(', ')} accepted, ships within the ${OWNED_SERVICE.shipsTo}.`}
                  </p>
                  <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>
                    {OWNED_SERVICE.relationship}
                  </p>
                  <a
                    href={quoteUrlFor({
                      sourcePage: '/get-it-printed',
                      placement: 'outsource-decision',
                      material: material.category,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-owned-service="3dprinterondemand"
                    data-placement="outsource-decision"
                    data-capability={capability}
                    data-material={material.category}
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-wider min-h-[48px] rounded"
                    style={{ background: 'var(--brand-primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)' }}
                  >
                    {capability === 'CONDITIONAL' ? 'Ask about this material' : 'Get a quote'}
                  </a>
                </>
              )}

              {!selfPrintable && !tooBig && (capability === 'NOT_SUPPORTED' || capability === 'UNKNOWN') && (
                <>
                  <p className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                    We do not print {material.category}.
                  </p>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body-text)' }}>
                    {alternatives.length > 0
                      ? `${alternatives.map((s) => s.name).join(' and ')} ${alternatives.length > 1 ? 'both list' : 'lists'} it. We have no commercial relationship with ${alternatives.length > 1 ? 'either' : 'them'} and this is an ordinary link.`
                      : 'We have not confirmed a service that lists it, so we are not going to send you to one on a guess. A specialist bureau is the right place to ask.'}
                  </p>
                  {alternatives.map((s) => (
                    <a
                      key={s.name}
                      href={outboundUrl(s)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-4 text-sm font-semibold underline underline-offset-4"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      {s.name}
                    </a>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        <p className="mt-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          This routes you to the right place. It is not a quote. Pricing comes from the real
          quote flow, with your actual file.
        </p>
      </div>
    </section>
  );
}
