'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MATERIAL_PROFILES } from '@/lib/materials';

/**
 * Drying decision tool.
 *
 * Every number it can output is already published on this site. It reads
 * `needsDrying` and the `drying` string from the same material profile the
 * material page renders, so it cannot state a temperature the profile does not,
 * and a corrected profile corrects the tool.
 *
 * That constraint is the reason this one is honest and a clearance calculator
 * would not be. Drying temperatures are manufacturer-published properties of a
 * material; clearance is a property of the reader's machine, which we cannot
 * see. Same interaction, completely different evidential footing.
 *
 * The oven guard exists because domestic filament dryers top out around 70-90°C
 * and PEEK wants 120-150°C. Recommending a dryer that cannot reach the
 * temperature on the same page that states the temperature is a self
 * contradiction, and it shipped once before it was caught.
 */

/** Low end of the published range: the temperature drying must at least reach. */
function dryFloor(drying: string): number | null {
  const m = drying.match(/(\d+)(?:-(\d+))?C/);
  return m ? Number(m[1]) : null;
}

/** High end, which decides whether a domestic dryer can do the job at all. */
function dryCeiling(drying: string): number | null {
  const m = drying.match(/(\d+)(?:-(\d+))?C/);
  return m ? Number(m[2] ?? m[1]) : null;
}

const SYMPTOMS = [
  { id: 'strings', label: 'Fine strings or wisps between features' },
  { id: 'popping', label: 'Crackling or popping at the nozzle' },
  { id: 'rough', label: 'Rough, foggy or furry surface' },
  { id: 'weak', label: 'Parts snapping along layer lines' },
  { id: 'none', label: 'Nothing wrong, just stored a while' },
];

export function DryingDecision() {
  const [slug, setSlug] = useState('');
  const [symptom, setSymptom] = useState('');

  const material = MATERIAL_PROFILES.find((m) => m.slug === slug);
  const ceiling = material ? dryCeiling(material.drying) : null;
  const floor = material ? dryFloor(material.drying) : null;
  const needsOven = ceiling !== null && ceiling > 90;

  return (
    <section
      className="py-14 px-4 border-t"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
      data-placement="drying-decision"
      aria-label="Does my filament need drying"
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
        >
          Does this spool need drying?
        </h2>
        <p className="text-base mb-8 max-w-[62ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
          Pick your material. Everything this returns is the same figure printed on that
          material&apos;s own page, so it will never tell you something the profile does not.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div>
            <label
              htmlFor="dry-material"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Material
            </label>
            <select
              id="dry-material"
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

          <div>
            <label
              htmlFor="dry-symptom"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              What is it doing? <span className="font-normal" style={{ color: 'var(--muted-foreground)' }}>(optional)</span>
            </label>
            <select
              id="dry-symptom"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="w-full rounded-lg border px-3 py-3 min-h-[48px] text-base"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-0)', color: 'var(--foreground)' }}
            >
              <option value="">Not sure</option>
              {SYMPTOMS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="rounded-xl border p-5"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
          aria-live="polite"
        >
          {!material && (
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Choose a material and the answer appears here.
            </p>
          )}

          {material && (
            <>
              <p
                className="text-lg font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                {material.needsDrying
                  ? `Yes — ${material.category} is hygroscopic.`
                  : `${material.category} does not normally need drying.`}
              </p>

              <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body-text)' }}>
                {material.drying}
              </p>

              {material.needsDrying && needsOven && (
                <p
                  className="text-sm leading-relaxed mb-3 p-3 rounded-lg"
                  style={{ color: 'var(--body-text)', background: 'var(--surface-2)' }}
                >
                  <strong style={{ color: 'var(--foreground)' }}>A filament dryer will not do this.</strong>{' '}
                  Domestic dryers top out around 70-90°C and this material needs up to {ceiling}°C.
                  That is oven territory, and an oven with a verified thermostat rather than a
                  dial you trust.
                </p>
              )}

              {material.needsDrying && !needsOven && floor !== null && (
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body-text)' }}>
                  Any filament dryer that genuinely reaches {floor}°C will do this. Check the
                  spec rather than the marketing, because several are rated below what they claim.
                </p>
              )}

              {symptom === 'none' && !material.needsDrying && (
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body-text)' }}>
                  Stored sealed with desiccant, this material keeps for a long time. If it has sat
                  open in a humid room for months, drying it will not hurt.
                </p>
              )}

              {symptom && symptom !== 'none' && !material.needsDrying && (
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--body-text)' }}>
                  Because this material is not strongly hygroscopic, moisture is an unlikely
                  cause of that symptom. Worth ruling out temperature and retraction first.
                </p>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <Link
                  href={`/library/${material.slug}`}
                  className="text-sm font-semibold underline underline-offset-4"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Full {material.category} profile
                </Link>
                <Link
                  href="/workshop/filament-storage"
                  className="text-sm font-semibold underline underline-offset-4"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  Keep it dry after
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
