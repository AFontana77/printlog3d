import Link from 'next/link';
import Image from 'next/image';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Faq } from '@/components/Faq';
import { OwnedServiceCta } from '@/components/OwnedServiceCta';
import { MATERIAL_PROFILES, iconSrc } from '@/lib/materials';
import type { Metadata } from 'next';

/**
 * The troubleshooting router.
 *
 * `3d printer troubleshooting` measures 1,300/month at difficulty 13, and this
 * site already owns several of the individual answers -- stringing, warping,
 * adhesion, clogging -- scattered across guides, workshop resources and thirty
 * material pages. What it lacked was the page that takes a symptom and points
 * at the right one.
 *
 * So this deliberately does NOT restate those answers. Duplicating the
 * stringing guide here would compete with it for the same query and give the
 * reader two places to keep correct. Each symptom gets the first thing to check
 * -- enough to act on, or to recognise this is not their problem -- and a link.
 *
 * The material-specific column is derived from `commonProblem`, which is the
 * field each material profile already uses to record the failure people
 * actually hit with it.
 */

const TITLE = '3D printer troubleshooting: find the failure, fix the cause';
const DESC =
  'Work from the symptom. What the print is doing, the first thing worth checking, and where the full answer lives. Covers adhesion, warping, stringing, clogs, layer shifts, under-extrusion and dimensional problems.';
const URL = 'https://www.printlog3d.com/3d-printer-troubleshooting';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: URL },
};

type Symptom = {
  symptom: string;
  looksLike: string;
  firstCheck: string;
  href: string;
  linkLabel: string;
  icon: string;
};

/** Ordered by how often it is the thing that has actually gone wrong. */
const WHEN_PRINTING: Symptom[] = [
  {
    symptom: 'It will not stick to the bed',
    looksLike: 'The first layer lifts, drags around, or never bonds at all.',
    firstCheck:
      'Wash the plate with warm water and dish soap. Skin oil from handling is the most common cause and it is invisible.',
    href: '/workshop/bed-adhesion-and-first-layer',
    linkLabel: 'Bed adhesion and the first layer',
    icon: 'bed-temperature',
  },
  {
    symptom: 'The corners curl up',
    looksLike: 'It sticks, prints for a while, then a corner peels off the plate.',
    firstCheck:
      'This is shrinkage, not adhesion. Check whether your material wants an enclosure before changing anything else.',
    href: '/workshop/bed-adhesion-and-first-layer',
    linkLabel: 'Why parts warp',
    icon: 'warping',
  },
  {
    symptom: 'Fine strings between parts',
    looksLike: 'Wispy threads across gaps, or fuzz on tall thin features.',
    firstCheck:
      'Dry the filament before touching retraction. Moisture is the cause people skip and settings will not fix it.',
    href: '/3d-print-stringing',
    linkLabel: 'How to stop stringing',
    icon: 'stringing',
  },
  {
    symptom: 'Nothing is coming out',
    looksLike: 'The extruder clicks, or the nozzle moves and lays down nothing.',
    firstCheck:
      'Partial clog or full clog. A cold pull clears most of them, and it is worth doing before replacing anything.',
    href: '/workshop/nozzle-maintenance',
    linkLabel: 'Nozzle cleaning and clogs',
    icon: 'nozzle-temperature',
  },
  {
    symptom: 'Gaps and thin walls',
    looksLike: 'Under-extrusion: lines that do not touch, walls you can see through.',
    firstCheck:
      'Check extrusion before flow. If the extruder is not moving the filament it thinks it is, every other number is built on a wrong one.',
    href: '/workshop/printer-calibration',
    linkLabel: 'Calibration, in order',
    icon: 'calibration',
  },
  {
    symptom: 'The layers shifted sideways',
    looksLike: 'Everything above a certain height is offset in one direction.',
    firstCheck:
      'Mechanical, not slicer. Something obstructed the head or a belt slipped. Check the part did not curl up into the nozzle path first, because that is the cause that hides as an electrical one.',
    href: '/workshop/bed-adhesion-and-first-layer',
    linkLabel: 'Curling into the nozzle path',
    icon: 'troubleshooting',
  },
];

const AFTER_PRINTING: Symptom[] = [
  {
    symptom: 'It came out the wrong size',
    looksLike: 'The part is close but will not fit its mating half.',
    firstCheck:
      'Measure the same feature three times before concluding anything. FDM holds about ±0.5% and holes always print undersized.',
    href: '/workshop/3d-print-tolerance',
    linkLabel: 'Tolerance and clearance',
    icon: 'search',
  },
  {
    symptom: 'The base is flared',
    looksLike: 'The bottom one or two layers splay outwards, so the part rocks.',
    firstCheck:
      'Elephant foot, and it is a setting rather than a fault. Your slicer has a first-layer compensation for it.',
    href: '/workshop/printer-calibration',
    linkLabel: 'Fixing elephant foot',
    icon: 'calibration',
  },
  {
    symptom: 'It snapped along a layer',
    looksLike: 'The part broke cleanly between layers rather than through them.',
    firstCheck:
      'Layer adhesion. Usually too cool at the nozzle, too much part cooling, or a material printed outside its range. Check the profile for your material.',
    href: '/library',
    linkLabel: 'Find your material',
    icon: 'layer-adhesion',
  },
  {
    symptom: 'The surface is rough or blobby',
    looksLike: 'Zits, seams and a finish you would not show anybody.',
    firstCheck:
      'Some of this is fixable in the slicer and some is faster to sand out. Decide which before spending an evening on settings.',
    href: '/workshop/sanding-and-finishing-3d-prints',
    linkLabel: 'Sanding and finishing',
    icon: 'layer-adhesion',
  },
];

const FAQ = [
  {
    question: 'Why is my 3D print not sticking to the bed?',
    answer:
      'Most often the plate has skin oil on it from handling. Wash it with warm water and dish soap and dry it fully before changing any settings. If that does not fix it, check the nozzle is low enough that the first layer is squashed into a continuous sheet.',
  },
  {
    question: 'Why does my 3D print have strings?',
    answer:
      'Usually wet filament rather than retraction settings. Hygroscopic materials absorb moisture from the air, and the water boils at the nozzle and leaves fine threads. Dry the spool first, then tune retraction if it persists.',
  },
  {
    question: 'What causes under-extrusion?',
    answer:
      'A partial clog, a slipping extruder, or extrusion that was never calibrated. Check the mechanical causes before adjusting flow, because a multiplier tuned to hide a mechanical fault comes undone with the next material.',
  },
  {
    question: 'Why did my print shift halfway through?',
    answer:
      'Something physically got in the way or a belt slipped. The most common hidden cause is a corner of the part curling up into the path of the nozzle, which reads as an electrical fault but is really a warping problem.',
  },
  {
    question: 'How do I know if my filament is wet?',
    answer:
      'It strings and pops. Wet filament crackles audibly at the nozzle, prints with a rough surface, and produces fine hairs between features. Drying it and reprinting the same file is the test.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: TITLE,
      description: DESC,
      url: URL,
      publisher: { '@type': 'Organization', name: 'PrintLog3D', url: 'https://www.printlog3d.com' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
        { '@type': 'ListItem', position: 2, name: 'Troubleshooting', item: URL },
      ],
    },
  ],
};

function SymptomList({ items }: { items: Symptom[] }) {
  return (
    <ul className="space-y-3">
      {items.map((s) => (
        <li key={s.symptom}>
          <Link
            href={s.href}
            className="group flex gap-4 p-4 rounded-xl border transition-colors hover:bg-brand-tint"
            style={{ borderColor: 'var(--border)' }}
          >
            <Image
              src={iconSrc(s.icon)}
              alt=""
              aria-hidden="true"
              width={48}
              height={48}
              className="h-12 w-12 flex-shrink-0"
            />
            <span className="min-w-0">
              <span
                className="block font-bold transition-colors group-hover:text-brand"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
              >
                {s.symptom}
              </span>
              <span className="block text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {s.looksLike}
              </span>
              <span className="block text-sm mt-2 leading-relaxed" style={{ color: 'var(--body-text)' }}>
                <strong style={{ color: 'var(--foreground)' }}>Check first:</strong> {s.firstCheck}
              </span>
              <span
                className="block text-sm mt-2 font-semibold underline underline-offset-4"
                style={{ color: 'var(--brand-primary)' }}
              >
                {s.linkLabel}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function TroubleshootingPage() {
  // Materials whose own profile records a distinctive failure. Derived so a new
  // material joins this list without anyone remembering to add it.
  const trickiest = MATERIAL_PROFILES.filter(
    (m) => m.difficulty === 'Advanced' || m.difficulty === 'Expert',
  ).slice(0, 8);

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main-content" className="pt-20">
        <section className="pt-16 pb-12 px-6" style={{ background: 'var(--surface-1)' }}>
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05 }}
            >
              Start with what the print is doing.
            </h1>
            <p className="text-lg max-w-[62ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
              Almost every print failure has one cause that is far more likely than the rest, and
              almost everybody changes three settings before checking it. Find the symptom below,
              do the first check, and only go deeper if that was not it.
            </p>
          </div>
        </section>

        <section className="py-14 px-6" style={{ background: 'var(--surface-0)' }} aria-label="Problems while printing">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              While it is printing
            </h2>
            <p className="text-sm mb-7" style={{ color: 'var(--muted-foreground)' }}>
              Something is going wrong you can watch happen.
            </p>
            <SymptomList items={WHEN_PRINTING} />
          </div>
        </section>

        <section className="py-14 px-6" style={{ background: 'var(--surface-1)' }} aria-label="Problems with the finished part">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              The print finished, but
            </h2>
            <p className="text-sm mb-7" style={{ color: 'var(--muted-foreground)' }}>
              It came off the plate and something is not right.
            </p>
            <SymptomList items={AFTER_PRINTING} />
          </div>
        </section>

        <section className="py-14 px-6" style={{ background: 'var(--surface-0)' }} aria-label="Material specific problems">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              Or the material is the problem
            </h2>
            <p className="text-sm mb-7 max-w-[62ch] leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Some failures are not faults at all, they are a material doing what that material
              does. Each profile records the failure people actually hit with it, alongside the
              settings.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {trickiest.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/library/${m.slug}`}
                    className="group flex items-center gap-3 py-3 -mx-3 px-3 rounded-lg transition-colors hover:bg-brand-tint"
                  >
                    <Image
                      src={iconSrc(m.category === 'PEEK' ? 'peek' : 'material-profiles')}
                      alt=""
                      aria-hidden="true"
                      width={40}
                      height={40}
                      className="h-10 w-10 flex-shrink-0"
                    />
                    <span className="min-w-0">
                      <span
                        className="block font-semibold transition-colors group-hover:text-brand"
                        style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}
                      >
                        {m.category}
                      </span>
                      <span className="block text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {m.difficulty}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm">
              <Link
                href="/library"
                className="font-semibold underline underline-offset-4"
                style={{ color: 'var(--brand-primary)' }}
              >
                All {MATERIAL_PROFILES.length} material profiles
              </Link>
            </p>
          </div>
        </section>

        <Faq items={FAQ} heading="Common questions" />

        <section className="py-14 px-6" style={{ background: 'var(--surface-1)' }} aria-label="Prevention">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
            >
              Most of these only happen once
            </h2>
            <p className="text-base max-w-[64ch] leading-relaxed mb-6" style={{ color: 'var(--body-text)' }}>
              A calibrated machine, a clean plate and dry filament remove the majority of what is
              on this page. The workshop covers each of those as a job rather than as a fix.
            </p>
            <Link
              href="/workshop"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold uppercase tracking-wider min-h-[48px] rounded transition-colors press-feedback"
              style={{ background: 'var(--brand-primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)' }}
            >
              The workshop
            </Link>
          </div>
        </section>

        <OwnedServiceCta variant="troubleshooting" tone="inline" />
      </main>

      <SiteFooter />
    </>
  );
}
