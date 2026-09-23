import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteNav } from '@/components/layout/SiteNav';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CostCalculator } from '@/components/CostCalculator';
import { Faq, type FaqItem } from '@/components/Faq';
import { bodyStyle, h2Style, linkStyle } from '@/components/comparison/shared';

const URL = 'https://www.printlog3d.com/3d-printing-cost-calculator';

export const metadata: Metadata = {
  title: '3D Printing Cost Calculator: What One Print Actually Costs',
  description:
    'Work out what a 3D print costs you. Filament, electricity, printer wear and failed prints, using your own numbers. Shows the arithmetic so you can check it.',
  alternates: { canonical: '/3d-printing-cost-calculator' },
};

/**
 * Answer-shaped opening, then the tool.
 *
 * The first paragraph answers the question in the title in plain language,
 * because that is the shape an AI assistant can quote. ChatGPT is already a
 * measurable traffic source for this estate, so a page that buries the answer
 * under a tool is a page an assistant cannot cite.
 */
const FAQS: FaqItem[] = [
  {
    question: 'How much does a 3D print cost?',
    answer:
      'Most small prints cost between 50 cents and 3 dollars in filament and electricity. A 85 gram print from a 24 dollar kilogram spool uses about 2 dollars of filament. Six hours on a 120 watt printer at 17 cents per kilowatt hour adds about 12 cents of electricity. Filament is almost always the biggest number, and electricity is almost always smaller than people expect.',
  },
  {
    question: 'How do I work out filament cost per gram?',
    answer:
      'Divide the spool price by the spool weight in grams. A 24 dollar spool holding 1000 grams costs 2.4 cents per gram. Multiply that by the grams your slicer says the print needs. Do not use the length in metres unless you also know the filament diameter and density, because the same length of PLA and PETG do not weigh the same.',
  },
  {
    question: 'How much electricity does a 3D printer use?',
    answer:
      'A common desktop printer draws somewhere between 50 and 150 watts once it is running, with the heated bed accounting for most of it. The bed cycles on and off, so a plug meter gives a far better figure than the number on the printer label. At 100 watts for 10 hours you use 1 kilowatt hour, which is about 17 cents in much of the United States.',
  },
  {
    question: 'Should I include failed prints in the cost?',
    answer:
      'Yes, if you want a number you can price from. Every failed print is paid for by the prints that succeed. If one print in ten fails, add about 10 percent to the cost of the ones that work. Leaving failures out is the most common reason a maker prices a job and then loses money on it.',
  },
  {
    question: 'Does printer wear belong in the cost?',
    answer:
      'It does if you are selling. Nozzles, belts, bed sheets and eventually the printer itself all wear out. Spreading the machine cost plus consumables over the hours you expect it to run gives a per hour figure. A few cents an hour is a common starting point, but it depends entirely on what you paid and how hard you run it.',
  },
  {
    question: 'What does this calculator not include?',
    answer:
      'It does not include your time, post processing supplies like sandpaper or paint, shipping, packaging, or platform fees if you sell on a marketplace. It also does not know your local electricity rate or what you paid for filament, which is why it asks rather than assuming.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: '3D Printing Cost Calculator',
      url: URL,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      description:
        'Calculates the cost of a 3D print from filament price, print weight, print time, printer wattage, electricity rate and failure rate.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'PrintLog3D' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.printlog3d.com' },
        { '@type': 'ListItem', position: 2, name: '3D Printing Cost Calculator', item: URL },
      ],
    },
  ],
};

export default function CostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main id="main-content" className="pt-20">
        <article style={{ maxWidth: '54rem', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
            3D Printing Cost Calculator
          </h1>

          <p style={{ ...bodyStyle, fontSize: '1.08rem' }}>
            A 3D print costs you filament, electricity, a share of the wear on
            your printer, and a share of the prints that failed. For most small
            parts that lands between 50 cents and 3 dollars, and filament is
            nearly always the biggest line. Put your own numbers in below and the
            calculator shows every step of the arithmetic, so you can check it
            rather than take our word for it.
          </p>

          <p style={bodyStyle}>
            Nothing is sent anywhere. The maths runs in your browser.
          </p>

          <div style={{ margin: '2rem 0' }}>
            <CostCalculator />
          </div>

          <h2 style={h2Style}>Which number surprises people</h2>
          <p style={bodyStyle}>
            Electricity. Makers often assume a printer running overnight is
            expensive, and it usually is not: ten hours at 100 watts is one
            kilowatt hour, which costs about what a single cup of coffee does not.
            The two numbers that actually decide whether a job is worth taking are
            the filament you used and the share of prints you throw away. If you
            are pricing work for other people and you are losing money, look at
            your failure rate before you look at your power bill.
          </p>

          <h2 style={h2Style}>Getting the grams right</h2>
          <p style={bodyStyle}>
            Your slicer already knows. PrusaSlicer, OrcaSlicer, Cura and Bambu
            Studio all report the filament a sliced model needs, in grams and in
            metres, next to the estimated print time. Use the grams. Length is
            ambiguous unless you also account for diameter and for the density of
            the specific material, and{' '}
            <Link href="/library/pla" style={linkStyle}>PLA</Link>,{' '}
            <Link href="/library/petg" style={linkStyle}>PETG</Link> and{' '}
            <Link href="/library/nylon-pa12" style={linkStyle}>nylon</Link> do not
            weigh the same per metre.
          </p>

          <h2 style={h2Style}>What the spool actually cost</h2>
          <p style={bodyStyle}>
            Use the price you paid, including shipping, and the weight of filament
            rather than the weight of the box. A spool sold as 1 kg holds 1 kg of
            filament plus the plastic reel it is wound on. Our{' '}
            <Link href="/library" style={linkStyle}>material library</Link> lists a
            typical street price band per material, which is useful for a sanity
            check but is not a substitute for your own receipt.
          </p>

          <Faq items={FAQS} />

          <section style={{ marginTop: '2.5rem' }}>
            <h2 style={h2Style}>Related</h2>
            <ul style={{ ...bodyStyle, paddingLeft: '1.1rem' }}>
              <li><Link href="/library" style={linkStyle}>Filament material library</Link></li>
              <li><Link href="/pla-vs-petg" style={linkStyle}>PLA vs PETG</Link></li>
              <li><Link href="/3d-printer-troubleshooting" style={linkStyle}>Print troubleshooting</Link></li>
            </ul>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
