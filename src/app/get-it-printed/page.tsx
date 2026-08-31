import Link from 'next/link';
import Image from 'next/image';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { OutsourceDecision } from '@/components/OutsourceDecision';
import { Faq, type FaqItem } from '@/components/Faq';
import { MATERIAL_PROFILES, iconFor, type MaterialProfile, iconSrc } from '@/lib/materials';
import { servicesFor } from '@/lib/commerce';
import { OWNED_SERVICE, capabilityFor, quoteUrlFor } from '@/lib/ownedService';
import type { Metadata } from 'next';

/**
 * The outsourcing hub.
 *
 * Held back during M1.3 because the brief said not to build it unless the owned
 * service's fulfilment state was ready. The owner has since accepted that risk,
 * so it ships.
 *
 * It is written as a decision page first and a commercial page second. The most
 * useful thing it can tell a reader is when NOT to outsource, and the second
 * most useful is that our own service cannot print the hardest materials — both
 * of which are here in plain sight. Every row derives from MATERIAL_PROFILES,
 * the capability gate and the verified third-party coverage, so it cannot drift
 * from what the material pages say.
 */

const BASE = 'https://www.printlog3d.com';

export const metadata: Metadata = {
  title: 'When to have a part 3D printed instead of printing it yourself',
  description:
    'Which materials a desktop printer realistically cannot handle, what a print service needs from you, what it costs in time, and who can actually print each material.',
  alternates: { canonical: `${BASE}/get-it-printed` },
};

const WORTH_IT = [
  'The material needs hardware you do not own and would not use again. A 400C hot end and heated chamber for one PEEK bracket is a poor trade.',
  'You need one part, not a capability. Buying machine time is almost always cheaper than buying the machine.',
  'You need dozens or hundreds. Print farms are set up for quantity in a way a single desktop machine is not.',
  'The deadline has stopped moving. Another evening of tuning is a real cost.',
];

const NOT_WORTH_IT = [
  'The material is PLA or PETG and your printer already runs it. You will wait longer and pay more for a part you could have made tonight.',
  'You want to iterate. Shipping turns a twenty-minute design change into a multi-day loop.',
  'The part is larger than the service can build. Check the size cap before anything else.',
  'You are still learning. The failed prints are how the settings get learned, and this site exists to shorten that.',
];

export default function GetItPrintedPage() {
  // Materials a reader realistically struggles with at home.
  const hard = MATERIAL_PROFILES.filter(
    (m) => m.difficulty === 'Advanced' || m.difficulty === 'Expert',
  );

  const faq: FaqItem[] = [
    {
      question: 'Can I get PEEK 3D printed if my printer cannot do it?',
      answer:
        'Yes. PEEK needs a 400C hot end and a heated chamber, which almost no desktop printer has, but industrial services run it routinely. Our own service does not print PEEK, so for that material we point to Xometry and JLC3DP instead.',
    },
    {
      question: 'What file do I need to send a 3D printing service?',
      answer: `An STL is the common answer and is accepted everywhere. STEP preserves real dimensions and is better if you have it. ${OWNED_SERVICE.name} accepts ${OWNED_SERVICE.fileTypes.join(', ')}.`,
    },
    {
      question: 'How big a part can be printed?',
      answer: `${OWNED_SERVICE.name} prints up to ${OWNED_SERVICE.maxDimensionMm}mm per side on FDM. Larger parts either need an industrial service or need splitting into sections and bonding, which is often the cheaper route.`,
    },
    {
      question: 'How accurate is a printed part?',
      answer:
        'FDM holds roughly plus or minus 0.5 percent with a floor near half a millimetre. That is typical rather than a guarantee, so design clearance into anything that has to fit.',
    },
    {
      question: 'Is it cheaper to print it myself?',
      answer:
        'For PLA or PETG on a printer you already own, almost always yes. For a material needing an enclosure, a dry box and a high-temperature hot end you do not have, almost always no, because the equipment costs more than the part.',
    },
  ];

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Get it printed', item: `${BASE}/get-it-printed` },
    ],
  };

  return (
    <>
      <SiteNav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <main id="main-content" className="pt-20">
        <section className="pt-14 pb-12 px-6 relative overflow-hidden" style={{ background: 'var(--surface-1)' }}>
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] brand-hatch pointer-events-none" />
          <div className="max-w-4xl mx-auto relative">
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5 max-w-3xl text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
            >
              When to have a part printed{' '}
              <span style={{ color: 'var(--brand-primary)' }}>instead of printing it yourself.</span>
            </h1>
            <p className="text-lg max-w-[62ch] leading-relaxed" style={{ color: 'var(--body-text)' }}>
              Most of this site is about running the material yourself. This page is about the
              cases where that is the wrong call, and what to do instead.
            </p>
          </div>
        </section>

        <section className="py-14 px-6" style={{ background: 'var(--surface-0)' }}>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                Worth outsourcing
              </h2>
              <ul className="space-y-3">
                {WORTH_IT.map((t) => (
                  <li key={t} className="text-sm leading-relaxed flex gap-2.5" style={{ color: 'var(--body-text)' }}>
                    <span aria-hidden="true" className="text-brand flex-shrink-0">&bull;</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}>
                Print it yourself
              </h2>
              <ul className="space-y-3">
                {NOT_WORTH_IT.map((t) => (
                  <li key={t} className="text-sm leading-relaxed flex gap-2.5" style={{ color: 'var(--body-text)' }}>
                    <span aria-hidden="true" className="flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>&bull;</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Who can actually print what. Derived, so it cannot contradict a material page. */}
        <section className="py-14 px-6 border-t" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}>
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
            >
              Materials most desktop printers cannot run
            </h2>
            <p className="text-sm mb-8 max-w-[62ch]" style={{ color: 'var(--muted-foreground)' }}>
              These need an enclosure, a dry box, and a hot end well past 250&deg;C. Where our own
              service cannot print one, the column says so and names who can.
            </p>

            <ul className="space-y-3">
              {hard.map((m: MaterialProfile) => {
                const cap = capabilityFor(m);
                const third = servicesFor(m);
                return (
                  <li
                    key={m.slug}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 p-4 rounded-xl border"
                    style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
                  >
                    <Image
                      src={iconSrc(iconFor(m))}
                      alt=""
                      aria-hidden="true"
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 flex-shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <Link
                        href={`/library/${m.slug}`}
                        className="font-semibold text-brand hover:text-brand-dark underline underline-offset-4"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {m.category}
                      </Link>
                      <span className="block text-xs tabular-nums mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {m.printTempC}&deg;C nozzle &middot; {m.bedTempC}&deg;C bed &middot; {m.difficulty}
                      </span>
                    </span>
                    <span className="text-sm w-full sm:w-auto" style={{ color: 'var(--body-text)' }}>
                      {cap === 'SUPPORTED' && <strong>We print this</strong>}
                      {cap === 'CONDITIONAL' && <strong>We quote this by hand</strong>}
                      {cap !== 'SUPPORTED' && cap !== 'CONDITIONAL' && (
                        <>
                          We do not print this.{' '}
                          {third.length ? (
                            <>Try {third.map((s) => s.name).join(' or ')}.</>
                          ) : (
                            <>No service we have verified offers it.</>
                          )}
                        </>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="py-14 px-6 border-t" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
            >
              What a service needs from you
            </h2>
            <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
              {[
                ['A model file', `${OWNED_SERVICE.fileTypes.join(', ')} are accepted. STL is universal; STEP keeps real dimensions and is better if your CAD produces it.`],
                ['The material', 'Decide before you upload. Price and lead time both move with it, and not every service carries every material.'],
                ['Size within the build envelope', `${OWNED_SERVICE.maxDimensionMm}mm per side on FDM here. Larger parts get split and bonded, which is often cheaper anyway.`],
                ['Any tolerance that matters', 'FDM holds roughly ±0.5%, floor near half a millimetre. If a hole has to fit a bearing, say so rather than assuming.'],
              ].map(([t, d]) => (
                <div key={t}>
                  <dt className="font-semibold mb-1" style={{ color: 'var(--foreground)', fontFamily: 'var(--font-display)' }}>{t}</dt>
                  <dd className="text-sm leading-relaxed" style={{ color: 'var(--body-text)' }}>{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="py-14 px-6 border-t" style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }} data-placement="owned-service-hub">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)', letterSpacing: '-0.015em' }}
            >
              How this site relates to {OWNED_SERVICE.name}
            </h2>
            <p className="leading-relaxed mb-4 max-w-[62ch]" style={{ color: 'var(--body-text)' }}>
              <strong>They are both ours.</strong> PrintLog3D is the reference; {OWNED_SERVICE.name}{' '}
              is a print service, and both are Anvil Road properties. So when we send you there we
              have a commercial interest, and you should read it that way.
            </p>
            <p className="leading-relaxed mb-6 max-w-[62ch]" style={{ color: 'var(--body-text)' }}>
              What that does not mean is that it is always the answer. It prints{' '}
              {OWNED_SERVICE.process} up to {OWNED_SERVICE.maxDimensionMm}mm and ships within the{' '}
              {OWNED_SERVICE.shipsTo}, and it does not print PEEK, polycarbonate or plain nylon at
              all. For those the table above names independent services instead, which is the
              honest answer even though it earns us nothing.
            </p>
            <a
              href={quoteUrlFor({ sourcePage: '/get-it-printed', placement: 'hub-primary' })}
              target="_blank"
              rel="noopener noreferrer"
              data-event="owned_service_click"
              data-owned-service={OWNED_SERVICE.domain}
              data-capability="HUB"
              data-material="none"
              className="inline-flex items-center gap-2 font-semibold px-7 py-3.5 rounded transition-colors min-h-[48px] text-sm uppercase tracking-wider"
              style={{ background: 'var(--brand-primary)', color: 'var(--on-primary)', fontFamily: 'var(--font-display)' }}
            >
              Upload a file for a quote
            </a>
          </div>
        </section>

        <OutsourceDecision />

        <Faq items={faq} heading="Common questions about print services" />
      </main>
      <SiteFooter />
    </>
  );
}
