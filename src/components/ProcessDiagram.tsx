/**
 * Step-sequence diagrams.
 *
 * M1.4 identified these as a real gap and deferred them rather than produce
 * decoration. The cases that earned one are the procedures where the order of
 * operations is the actual content and prose makes the reader hold five things
 * in their head at once.
 *
 * All artwork here is original geometry drawn from primitives. Nothing is traced
 * from or derived from a manufacturer diagram.
 *
 * Two constraints carried over from the pages these sit on:
 *
 *  - The insert sequence shows a hole, and never a hole dimension. Insert knurl
 *    and taper vary between manufacturers, so a diagram with a number on it
 *    would be wrong for somebody, and a diagram is exactly the format people
 *    screenshot without the caveat around it.
 *
 *  - Every diagram is theme-aware through CSS variables and carries a real text
 *    alternative, because a process diagram that only exists as pixels is
 *    unreadable to a screen reader and to an assistant quoting the page.
 */

export type Glyph =
  | 'hole'
  | 'insert-aligned'
  | 'iron-hot'
  | 'press'
  | 'flush'
  | 'cool'
  | 'model'
  | 'coupon'
  | 'test-fit'
  | 'adjust'
  | 'reprint'
  | 'spool'
  | 'sealed'
  | 'desiccant'
  | 'hygrometer'
  | 'dryer'
  | 'heat-soak'
  | 'pull'
  | 'inspect-tip';

export type Step = {
  label: string;
  caption: string;
  glyph: Glyph;
};

const STROKE = 'var(--foreground)';
const ACCENT = 'var(--brand-primary)';
const MUTED = 'var(--muted-foreground)';

/** Original glyphs, drawn in a 48x48 box. */
function GlyphArt({ kind }: { kind: Glyph }) {
  const s = { fill: 'none', stroke: STROKE, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const a = { ...s, stroke: ACCENT };

  switch (kind) {
    case 'hole':
      return (
        <>
          <rect x="8" y="16" width="32" height="24" rx="2" {...s} />
          <path d="M18 16v10a6 6 0 0 0 12 0V16" {...a} />
          <path d="M18 16h12" {...a} />
        </>
      );
    case 'insert-aligned':
      return (
        <>
          <rect x="8" y="20" width="32" height="20" rx="2" {...s} />
          <path d="M18 20v8a6 6 0 0 0 12 0v-8" {...s} />
          <rect x="19" y="6" width="10" height="12" rx="1" {...a} />
          <path d="M19 9h10M19 12h10M19 15h10" {...a} />
          <path d="M24 18v3" {...a} strokeDasharray="2 2" />
        </>
      );
    case 'iron-hot':
      return (
        <>
          <rect x="19" y="18" width="10" height="9" rx="1" {...s} />
          <path d="M24 18V8" {...s} />
          <path d="M20 27l4 6 4-6" {...a} />
          <path d="M33 12c0 3-3 3-3 6M39 12c0 3-3 3-3 6" {...a} />
        </>
      );
    case 'press':
      return (
        <>
          <rect x="8" y="28" width="32" height="12" rx="2" {...s} />
          <rect x="19" y="20" width="10" height="10" rx="1" {...a} />
          <path d="M24 6v10" {...a} />
          <path d="M20 12l4 5 4-5" {...a} />
        </>
      );
    case 'flush':
      return (
        <>
          <rect x="8" y="22" width="32" height="18" rx="2" {...s} />
          <rect x="19" y="22" width="10" height="10" rx="1" {...a} />
          <path d="M6 22h36" {...a} strokeDasharray="3 2" />
          <path d="M12 14l3 3 6-6" {...a} />
        </>
      );
    case 'cool':
      return (
        <>
          <rect x="8" y="22" width="32" height="18" rx="2" {...s} />
          <rect x="19" y="22" width="10" height="10" rx="1" {...s} />
          <path d="M24 6v12M18 9l6 4 6-4" {...a} />
          <path d="M14 12h4M30 12h4" {...a} />
        </>
      );
    case 'model':
      return (
        <>
          <path d="M24 8l14 8v16l-14 8-14-8V16z" {...s} />
          <path d="M24 8v16l14-8M24 24v16M24 24L10 16" {...a} />
        </>
      );
    case 'coupon':
      return (
        <>
          <rect x="6" y="18" width="36" height="14" rx="2" {...s} />
          <circle cx="14" cy="25" r="2.5" {...a} />
          <circle cx="24" cy="25" r="3.2" {...a} />
          <circle cx="34" cy="25" r="4" {...a} />
        </>
      );
    case 'test-fit':
      return (
        <>
          <rect x="6" y="20" width="18" height="14" rx="2" {...s} />
          <rect x="26" y="20" width="16" height="14" rx="2" {...s} />
          <path d="M24 27h4" {...a} />
          <path d="M20 14v-4h8v4" {...a} />
        </>
      );
    case 'adjust':
      return (
        <>
          <path d="M10 18h28M10 30h28" {...s} />
          <circle cx="18" cy="18" r="4" {...a} />
          <circle cx="31" cy="30" r="4" {...a} />
        </>
      );
    case 'reprint':
      return (
        <>
          <path d="M38 24a14 14 0 1 1-4.5-10.3" {...a} />
          <path d="M38 8v7h-7" {...a} />
          <rect x="18" y="20" width="12" height="9" rx="1.5" {...s} />
        </>
      );
    case 'spool':
      return (
        <>
          <circle cx="24" cy="24" r="15" {...s} />
          <circle cx="24" cy="24" r="5" {...a} />
          <path d="M24 9v4M24 35v4M9 24h4M35 24h4" {...s} />
        </>
      );
    case 'sealed':
      return (
        <>
          <path d="M10 16h28v22a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" {...s} />
          <path d="M8 10h32v6H8z" {...a} />
          <circle cx="24" cy="28" r="5" {...s} />
        </>
      );
    case 'desiccant':
      return (
        <>
          <path d="M14 12h20l-2 26a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2z" {...s} />
          <circle cx="20" cy="24" r="1.6" {...a} />
          <circle cx="27" cy="21" r="1.6" {...a} />
          <circle cx="25" cy="30" r="1.6" {...a} />
          <circle cx="19" cy="33" r="1.6" {...a} />
        </>
      );
    case 'hygrometer':
      return (
        <>
          <rect x="9" y="12" width="30" height="24" rx="3" {...s} />
          <path d="M17 28l4-8 3 5 3-9 4 12" {...a} />
        </>
      );
    case 'dryer':
      return (
        <>
          <rect x="8" y="14" width="32" height="24" rx="3" {...s} />
          <circle cx="24" cy="26" r="6" {...s} />
          <path d="M15 9c0 3-2 3-2 6M24 6c0 3-2 3-2 6M33 9c0 3-2 3-2 6" {...a} />
        </>
      );
    case 'heat-soak':
      return (
        <>
          <path d="M20 8h8v18l4 6a8 8 0 0 1-16 0l4-6z" {...s} />
          <path d="M24 30v6" {...a} />
          <path d="M36 12c0 3-3 3-3 6M42 12c0 3-3 3-3 6" {...a} />
        </>
      );
    case 'pull':
      return (
        <>
          <path d="M24 6v20" {...s} />
          <path d="M18 26h12l-3 8h-6z" {...s} />
          <path d="M24 34v8" {...a} />
          <path d="M19 37l5 5 5-5" {...a} />
        </>
      );
    case 'inspect-tip':
      return (
        <>
          <path d="M18 10h12l-3 12h-6z" {...s} />
          <circle cx="28" cy="32" r="8" {...a} />
          <path d="M34 38l6 6" {...a} />
        </>
      );
  }
}

export function ProcessDiagram({
  steps,
  title,
  description,
}: {
  steps: Step[];
  /** Names the procedure. Becomes the accessible name of the figure. */
  title: string;
  /** One line for anybody who cannot see it. */
  description: string;
}) {
  return (
    <figure className="my-8">
      <ol
        className="grid gap-3 sm:gap-2"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(8.5rem, 1fr))` }}
      >
        {steps.map((s, i) => (
          <li
            key={s.label}
            className="relative rounded-xl border p-4 flex flex-col items-start"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}
          >
            <span
              className="text-[0.65rem] font-bold tabular-nums mb-2 px-2 py-0.5 rounded-full"
              style={{ background: 'var(--surface-2)', color: MUTED, fontFamily: 'var(--font-display)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <svg
              viewBox="0 0 48 48"
              width="44"
              height="44"
              aria-hidden="true"
              focusable="false"
              className="mb-2"
            >
              <GlyphArt kind={s.glyph} />
            </svg>
            <span
              className="font-bold text-sm leading-snug"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              {s.label}
            </span>
            <span className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--body-text)' }}>
              {s.caption}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-xs" style={{ color: MUTED }}>
        <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
          {title}.
        </span>{' '}
        {description}
      </figcaption>
    </figure>
  );
}

/**
 * The sequences themselves.
 *
 * Data rather than markup, so a page renders one by naming it and the wording
 * stays in one place.
 */
export const SEQUENCES: Record<string, { title: string; description: string; steps: Step[] }> = {
  heatSetInsert: {
    title: 'Installing a heat-set insert',
    description:
      'Six steps, in order. The hole diameter is not shown because it is set by your insert, not by this drawing.',
    steps: [
      { glyph: 'hole', label: 'Print the hole', caption: 'To the diameter your insert manufacturer publishes for its size.' },
      { glyph: 'insert-aligned', label: 'Sit it square', caption: 'The insert should rest in the mouth of the hole without being pushed.' },
      { glyph: 'iron-hot', label: 'Heat the iron', caption: 'Hot enough to soften the plastic, not to burn it. Start low.' },
      { glyph: 'press', label: 'Press straight down', caption: 'Let the heat do the work. Force is what tips it out of square.' },
      { glyph: 'flush', label: 'Stop at the surface', caption: 'Flush, or a hair proud. Below the surface and the threads sit in a crater.' },
      { glyph: 'cool', label: 'Let it cool', caption: 'Before touching it. The plastic re-forms around the knurl as it sets.' },
    ],
  },
  fitTest: {
    title: 'Finding your own clearance',
    description:
      'The method that replaces a clearance number somebody else guessed for your printer.',
    steps: [
      { glyph: 'model', label: 'Model the feature', caption: 'The real feature, at nominal size, in the real orientation.' },
      { glyph: 'coupon', label: 'Print a stepped coupon', caption: 'Several clearances on one part, same material, same machine.' },
      { glyph: 'test-fit', label: 'Test the fit', caption: 'Find the step that behaves the way you need: sliding, or pressed.' },
      { glyph: 'adjust', label: 'Take that number', caption: 'It is true for your setup, which is the only place it has to be true.' },
      { glyph: 'reprint', label: 'Apply and print', caption: 'Use it in the real model. Re-run the coupon when the material changes.' },
    ],
  },
  filamentStorage: {
    title: 'Keeping filament printable',
    description: 'Storage and drying are different jobs. This is the storage one.',
    steps: [
      { glyph: 'spool', label: 'Start dry', caption: 'A sealed spool is dry. One that shipped open may already need drying.' },
      { glyph: 'sealed', label: 'Seal it', caption: 'An airtight container. A cardboard box and a shelf are not storage.' },
      { glyph: 'desiccant', label: 'Add desiccant', caption: 'Indicating silica, so you can see when it is spent and recharge it.' },
      { glyph: 'hygrometer', label: 'Measure it', caption: 'A cheap hygrometer inside turns a hope into a reading.' },
      { glyph: 'dryer', label: 'Dry only when needed', caption: 'Drying is the repair. Storage is what stops you needing it.' },
    ],
  },
  coldPull: {
    title: 'Clearing a partial clog with a cold pull',
    description:
      'Temperatures vary by material and hot end, so the sequence is shown and the numbers stay on the material profile.',
    steps: [
      { glyph: 'heat-soak', label: 'Heat and load', caption: 'Up to printing temperature, then push filament through by hand.' },
      { glyph: 'cool', label: 'Cool it down', caption: 'Let the hot end drop until the plastic is firm but still gripped.' },
      { glyph: 'pull', label: 'Pull steadily', caption: 'One firm continuous pull. Yanking snaps it and leaves the debris in.' },
      { glyph: 'inspect-tip', label: 'Read the tip', caption: 'The tip should come out shaped like the nozzle, carrying the debris.' },
      { glyph: 'reprint', label: 'Repeat until clean', caption: 'A tip that comes out clean and cone-shaped means the bore is clear.' },
    ],
  },
};
