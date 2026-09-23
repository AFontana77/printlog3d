'use client';

import { useMemo, useState } from 'react';

/**
 * 3D printing cost calculator.
 *
 * Every number here comes from the reader. Nothing is a claim by this site: we
 * do not know what their filament cost, what their electricity costs, or how
 * long their print ran. The calculator arithmetic is shown in full underneath
 * the result so anyone can check it rather than trust it.
 *
 * Deliberately NOT included: a "typical" filament price or wattage presented as
 * fact. The defaults below are starting points a reader is expected to
 * overwrite, and they are labelled as such on the page.
 */

type Row = { label: string; value: number; note?: string };

const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

function Field({
  id, label, value, onChange, suffix, step = '0.01', min = '0', hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  step?: string;
  min?: string;
  hint?: string;
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            width: '100%', maxWidth: '11rem', padding: '0.55rem 0.7rem',
            border: '1px solid var(--border, #d4d4d8)', borderRadius: '0.5rem',
            fontSize: '1rem', minHeight: '44px',
          }}
        />
        {suffix ? <span style={{ color: 'var(--muted, #52525b)' }}>{suffix}</span> : null}
      </div>
      {hint ? (
        <p style={{ fontSize: '0.8rem', color: 'var(--muted, #52525b)', marginTop: '0.3rem' }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function CostCalculator() {
  const [spoolPrice, setSpoolPrice] = useState(24);
  const [spoolGrams, setSpoolGrams] = useState(1000);
  const [gramsUsed, setGramsUsed] = useState(85);
  const [hours, setHours] = useState(6);
  const [watts, setWatts] = useState(120);
  const [kwhRate, setKwhRate] = useState(0.17);
  const [failRate, setFailRate] = useState(10);
  const [wearPerHour, setWearPerHour] = useState(0.05);
  const [markup, setMarkup] = useState(0);

  const r = useMemo(() => {
    const perGram = spoolGrams > 0 ? spoolPrice / spoolGrams : 0;
    const filament = perGram * gramsUsed;
    const kwh = (watts / 1000) * hours;
    const power = kwh * kwhRate;
    const wear = wearPerHour * hours;
    const subtotal = filament + power + wear;
    const failure = subtotal * (failRate / 100);
    const cost = subtotal + failure;
    const price = cost * (1 + markup / 100);
    return { perGram, filament, kwh, power, wear, subtotal, failure, cost, price };
  }, [spoolPrice, spoolGrams, gramsUsed, hours, watts, kwhRate, failRate, wearPerHour, markup]);

  const ok = Number.isFinite(r.cost) && r.cost >= 0;

  const rows: Row[] = [
    { label: 'Filament', value: r.filament, note: `${gramsUsed} g at ${money(r.perGram)}/g` },
    { label: 'Electricity', value: r.power, note: `${r.kwh.toFixed(2)} kWh at ${money(kwhRate)}/kWh` },
    { label: 'Printer wear', value: r.wear, note: `${hours} h at ${money(wearPerHour)}/h` },
    { label: `Failed prints (${failRate}%)`, value: r.failure, note: 'spread across successful prints' },
  ];

  return (
    <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'minmax(0,1fr)' }}>
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          border: '1px solid var(--border, #d4d4d8)', borderRadius: '0.75rem',
          padding: '1.25rem',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0 }}>Your numbers</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted, #52525b)', marginTop: 0 }}>
          The values below are starting points, not our recommendations. Replace
          them with what you actually paid.
        </p>

        <Field id="spool-price" label="Spool price" value={spoolPrice} onChange={setSpoolPrice} suffix="$" />
        <Field id="spool-grams" label="Spool weight" value={spoolGrams} onChange={setSpoolGrams} suffix="g" step="1" />
        <Field
          id="grams-used" label="Filament used by this print" value={gramsUsed}
          onChange={setGramsUsed} suffix="g" step="0.1"
          hint="Your slicer reports this. In PrusaSlicer and OrcaSlicer it is shown next to the estimated print time."
        />
        <Field id="hours" label="Print time" value={hours} onChange={setHours} suffix="hours" step="0.1" />
        <Field
          id="watts" label="Printer power draw" value={watts} onChange={setWatts} suffix="watts" step="1"
          hint="Check the printer's own label or a plug meter. A heated bed is most of the draw and it cycles, so a meter reading beats a nameplate figure."
        />
        <Field
          id="kwh" label="Your electricity rate" value={kwhRate} onChange={setKwhRate} suffix="$/kWh"
          hint="On your utility bill. It is not the same everywhere, which is why this field is not filled in for you."
        />
        <Field
          id="fail" label="Failure rate" value={failRate} onChange={setFailRate} suffix="%" step="1"
          hint="What share of prints you scrap. Every failed print is paid for by the ones that succeed."
        />
        <Field
          id="wear" label="Printer wear and maintenance" value={wearPerHour} onChange={setWearPerHour}
          suffix="$/hour" hint="Nozzles, belts, bed sheets and the printer itself, spread over its life. Set it to 0 to leave it out."
        />
        <Field
          id="markup" label="Markup, if you are selling" value={markup} onChange={setMarkup}
          suffix="%" step="1" hint="Leave at 0 to see your cost only."
        />
      </form>

      <div
        aria-live="polite"
        style={{
          border: '1px solid var(--border, #d4d4d8)', borderRadius: '0.75rem',
          padding: '1.25rem', background: 'var(--surface-1, #fafafa)',
        }}
      >
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: 0 }}>What this print costs</h2>
        {!ok ? (
          <p>Fill in the fields to see a cost.</p>
        ) : (
          <>
            <p style={{ fontSize: '2rem', fontWeight: 800, margin: '0.25rem 0' }}>{money(r.cost)}</p>
            <p style={{ color: 'var(--muted, #52525b)', marginTop: 0 }}>
              cost to you for one successful print
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0', fontSize: '0.95rem' }}>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} style={{ borderTop: '1px solid var(--border, #e4e4e7)' }}>
                    <th scope="row" style={{ textAlign: 'left', padding: '0.5rem 0', fontWeight: 600 }}>
                      {row.label}
                      {row.note ? (
                        <span style={{ display: 'block', fontWeight: 400, fontSize: '0.8rem', color: 'var(--muted, #52525b)' }}>
                          {row.note}
                        </span>
                      ) : null}
                    </th>
                    <td style={{ textAlign: 'right', padding: '0.5rem 0', fontVariantNumeric: 'tabular-nums' }}>
                      {money(row.value)}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: '2px solid var(--border, #d4d4d8)' }}>
                  <th scope="row" style={{ textAlign: 'left', padding: '0.5rem 0' }}>Total cost</th>
                  <td style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {money(r.cost)}
                  </td>
                </tr>
                {markup > 0 ? (
                  <tr style={{ borderTop: '1px solid var(--border, #e4e4e7)' }}>
                    <th scope="row" style={{ textAlign: 'left', padding: '0.5rem 0' }}>
                      Price at {markup}% markup
                    </th>
                    <td style={{ textAlign: 'right', padding: '0.5rem 0', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {money(r.price)}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted, #52525b)' }}>
              Filament cost is spool price divided by spool weight, times the grams
              your slicer reported. Electricity is watts divided by 1,000, times
              hours, times your rate. The failure share is added on top of the
              other three lines. Nothing is hidden and nothing is rounded until
              the end.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
