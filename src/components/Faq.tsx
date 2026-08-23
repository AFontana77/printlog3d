/**
 * One FAQ, one source of truth.
 *
 * Golden Property Standard section 3: a claim usually exists twice. Emitting
 * FAQPage schema separately from the visible copy is how seven DPF posts ended
 * up telling Google about answers no reader could see. Here the schema is
 * generated from the same array that renders the markup, so the two cannot
 * drift and an answer cannot be asserted to Google without also being on the
 * page.
 *
 * `answer` is plain text on purpose. Rich markup in an answer would have to be
 * stripped for the schema, which reintroduces the drift this component exists
 * to prevent.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export function Faq({
  items,
  heading = 'Common questions',
  id = 'faq',
}: {
  items: FaqItem[];
  heading?: string;
  id?: string;
}) {
  if (items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <section id={id} className="py-14 px-4 bg-white border-t border-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{heading}</h2>
        <dl className="space-y-6">
          {items.map((item) => (
            <div key={item.question} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <dt className="font-semibold text-gray-900 mb-2">{item.question}</dt>
              <dd className="text-gray-600 leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
