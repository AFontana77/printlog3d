import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ComparisonBuying } from '@/components/ComparisonBuying';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import { Faq } from '@/components/Faq';
import { specRows, type SpecRow } from '@/components/ComparisonSpecs';
import Link from 'next/link';
import {
  Eyebrow,
  SpecGrid,
  comparisonJsonLd,
  bodyStyle,
  h2Style,
  h3Style,
  linkStyle,
} from '@/components/comparison/shared';
import type { Metadata } from 'next';

/**
 * ASA vs ABS.
 *
 * Built on measured demand: `asa vs abs` is 1,900/month and `abs vs asa` a
 * further 1,600, which is the same question asked in both directions and the
 * largest comparison gap this site had. It is also the comparison our own data
 * already points at -- both profiles carry the other as `comparedWith`.
 *
 * The spec rows derive from materials.ts. See ComparisonSpecs for why.
 */

const TITLE = 'ASA vs ABS: which one survives outdoors?';
const DESC =
  'ASA and ABS print almost identically and need the same enclosure. The difference that matters is UV: ABS goes chalky and brittle in sunlight, ASA does not. When that is worth the extra cost, and when it is not.';
const URL = 'https://www.printlog3d.com/asa-vs-abs';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
};

const FAQ = [
  {
    question: 'What is the difference between ASA and ABS?',
    answer:
      'They are the same polymer family with one component swapped. ABS uses butadiene, which degrades under ultraviolet light; ASA replaces it with an acrylate that does not. Everything else about printing them is close enough to be interchangeable.',
  },
  {
    question: 'Is ASA better than ABS?',
    answer:
      'Outdoors, yes, and it is not close. Indoors the advantage disappears and you are paying more for UV resistance the part will never use. ABS is the cheaper material and prints slightly cooler.',
  },
  {
    question: 'Can you print ASA without an enclosure?',
    answer:
      'Not reliably. ASA warps as readily as ABS and needs the same still, warm air. If an open-frame printer is all you have, PETG is the more honest choice for the job.',
  },
  {
    question: 'Does ABS really go bad in sunlight?',
    answer:
      'Yes. Ultraviolet light attacks the butadiene in ABS, and the part yellows, chalks and turns brittle. How fast depends on exposure, but it is a chemical certainty rather than a risk.',
  },
  {
    question: 'Do ASA and ABS need drying?',
    answer:
      'Both are hygroscopic and both benefit from it. ABS dries at 65-80°C for 2-4 hours, ASA at 70-80°C for around 4 hours. Wet spools of either print rough and string.',
  },
];

const jsonLd = comparisonJsonLd({
  title: TITLE,
  description: DESC,
  url: URL,
  breadcrumb: 'ASA vs ABS',
});



// Derived from materials.ts so this table cannot contradict the material pages.
// Only the editorial rows, which have no canonical field, are literal.
const SPECS: SpecRow[] = specRows('ASA', 'ABS', [
  ['UV resistance', 'Holds colour and strength outdoors', 'Yellows, chalks, turns brittle'],
  ['Heat resistance', 'Comparable to ABS', '~100°C deformation'],
  ['Fumes', 'Styrene, ventilate', 'Styrene, ventilate'],
  ['Acetone smoothing', 'Yes', 'Yes'],
  ['Warping risk', 'High without enclosure', 'High without enclosure'],
]);

const ASA_WINS = [
  { n: '01', title: 'Anything that lives outside', body: 'This is the entire reason ASA exists. Garden fittings, roof brackets, sensor housings, mailbox parts, exterior automotive trim. An ABS part in the same place is on a clock.' },
  { n: '02', title: 'Parts behind glass in direct sun', body: 'A dashboard mount or a windowsill bracket gets ultraviolet without ever going outdoors. Glass cuts some of it, not enough to save ABS over years.' },
  { n: '03', title: 'Anything you would rather not reprint', body: 'The cost difference on a single spool is small against making the part twice. Where access is awkward, or the part is bonded into an assembly, buy the material that will not need replacing.' },
];

const ABS_WINS = [
  { n: '01', title: 'Indoor parts, where UV never happens', body: 'Enclosures, brackets, jigs, interior automotive. The acrylate in ASA is doing nothing for a part in a cupboard, and ABS is the cheaper spool.' },
  { n: '02', title: 'Anything you plan to acetone smooth', body: 'Both respond to acetone, but ABS is the material every smoothing guide is written against, and it is easier to buy a spool of it locally.' },
  { n: '03', title: 'A slightly easier print', body: 'ABS runs a little cooler at the nozzle and is marginally more forgiving on the first layer. Neither is easy without an enclosure, but ABS is the gentler of the two.' },
];

export default function AsaVsAbsPage() {
  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main-content" className="pt-20">
        <section aria-label="Page introduction" className="pt-20 pb-16 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              ASA vs ABS: one of them survives the sun.
            </h1>
            <p style={bodyStyle} className="text-lg max-w-[62ch]">
              These two print almost identically, need the same enclosure and smooth with the
              same acetone. The difference worth paying for is ultraviolet light. ABS yellows,
              chalks and goes brittle in sunlight because of the butadiene in it. ASA swaps
              that component out and does not. If the part goes outside, that is the whole
              decision.
            </p>
          </div>
        </section>

        <section aria-label="ASA vs ABS comparison table" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>SIDE BY SIDE</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Nearly the same spool, until you take it outdoors.</h2>
            <SpecGrid rows={SPECS} />
            <p style={bodyStyle} className="text-sm mt-4">
              Temperatures, enclosure, drying, difficulty and price come from the{' '}
              <Link href="/library/asa" style={linkStyle} className="underline underline-offset-4">ASA</Link>{' '}
              and{' '}
              <Link href="/library/abs" style={linkStyle} className="underline underline-offset-4">ABS</Link>{' '}
              profiles, so this table cannot drift away from them.
            </p>
          </div>
        </section>

        <section aria-label="When ASA is the better choice" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>ASA WINS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Three jobs where ABS will let you down.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {ASA_WINS.map((w, i) => (
                <div key={w.n} style={{ padding: '1.5rem 1.25rem', borderTop: i === 0 ? 'none' : '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface-1)' : 'var(--surface-0)' }}>
                  <h3 style={h3Style} className="text-lg font-bold mb-2">{w.title}</h3>
                  <p style={bodyStyle} className="text-sm max-w-[68ch]">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="When ABS is the better choice" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>ABS WINS</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-10">Indoors, the premium buys you nothing.</h2>
            <div style={{ border: '1px solid var(--border)', borderRadius: '0.25rem', overflow: 'hidden' }}>
              {ABS_WINS.map((w, i) => (
                <div key={w.n} style={{ padding: '1.5rem 1.25rem', borderTop: i === 0 ? 'none' : '1px solid var(--border)', background: i % 2 === 0 ? 'var(--surface-0)' : 'var(--surface-1)' }}>
                  <h3 style={h3Style} className="text-lg font-bold mb-2">{w.title}</h3>
                  <p style={bodyStyle} className="text-sm max-w-[68ch]">{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Neither material" className="py-20 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>NO ENCLOSURE &middot; NEITHER</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">On an open-frame printer, the answer is PETG.</h2>
            <p style={bodyStyle} className="text-lg max-w-[68ch] mb-6">
              Both of these need still, warm air and both will lift a corner without it. Choosing
              between them before you have an enclosure is choosing which one is going to fail.
              PETG handles most of the same functional work, needs no enclosure, and has moderate
              UV tolerance of its own.
            </p>
            <Link href="/abs-vs-petg" style={linkStyle} className="underline underline-offset-4 font-semibold">
              Compare ABS against PETG instead
            </Link>
          </div>
        </section>

        <section aria-label="Final verdict" className="py-20 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-5xl mx-auto">
            <Eyebrow>VERDICT</Eyebrow>
            <h2 style={h2Style} className="text-3xl sm:text-4xl font-bold mb-6">The one-sentence verdict.</h2>
            <p style={bodyStyle} className="text-lg max-w-[68ch]">
              If the part will see daylight, print ASA and stop thinking about it. If it will
              not, print ABS and keep the difference. And if you have no enclosure, print
              neither.
            </p>
          </div>
        </section>

        <Faq items={FAQ} heading="Common questions" />

        <ComparisonBuying slugs={['asa', 'abs']} />

        <OwnedServiceCta variant="comparison" />
      </main>

      <SiteFooter />
    </>
  );
}
