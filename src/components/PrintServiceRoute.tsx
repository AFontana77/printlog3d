import { ExternalLink, Factory } from 'lucide-react';
import type { MaterialProfile } from '@/lib/materials';
import { servicesFor, serviceFraming } from '@/lib/commerce';

/**
 * The escape hatch.
 *
 * Our advanced and expert material pages correctly tell the reader their machine
 * cannot realistically run this material, and then stopped. That is a reader with
 * a fully formed need and nowhere to go.
 *
 * The honest next action is not a product. It is a service that owns the right
 * machine. Authority first, then the route: we do not soften the "you cannot do
 * this" verdict in order to sell something, and we do not pretend a $200 printer
 * will manage PEEK.
 *
 * These are plain editorial links. No affiliate relationship exists with any of
 * these services, so no tracking is attached and none is disclosed. If one is
 * joined later the route gains tracking without the copy changing.
 */
export function PrintServiceRoute({ material }: { material: MaterialProfile }) {
  const framing = serviceFraming(material);

  return (
    <section
      className="py-14 px-4 bg-slate-50 border-t border-slate-200"
      data-placement="print-service"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Factory size={20} className="text-slate-600" aria-hidden="true" />
          If your printer cannot run {material.category}
        </h2>

        <p className="text-gray-700 leading-relaxed mb-4">
          {framing === 'cannot' ? (
            <>
              Most desktop machines cannot print {material.category}, and no amount of tuning
              changes that. It needs a hot end reaching {material.printTempC}&deg;C and a heated
              chamber. If yours does not have both, the material is out of reach.
            </>
          ) : (
            <>
              {material.category} needs an enclosure, a dry box and a hot end comfortable at{' '}
              {material.printTempC}&deg;C. That is a real hardware investment for a single part.
              If you need one bracket rather than a new capability, buying the machine time is
              usually the cheaper answer.
            </>
          )}
        </p>

        <p className="text-gray-700 leading-relaxed mb-6">
          A print service already owns the machine. You upload the model, choose{' '}
          {material.category}, and a part arrives. For a one-off this is almost always cheaper
          than the equipment, and it is the only route if your printer tops out below{' '}
          {material.printTempC.split('-')[0]}&deg;C.
        </p>

        <div className="space-y-3">
          {servicesFor(material).map((s) => (
            <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-violet-800 hover:text-violet-900 underline underline-offset-4 inline-flex items-center gap-1.5 min-h-[44px]"
              >
                {s.name}
                <ExternalLink size={13} aria-hidden="true" />
              </a>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{s.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          Confirm the service actually offers {material.category} before uploading. Material
          menus change, and a service that lists dozens of options may not carry this one. We
          have no commercial relationship with any of these companies, and these are ordinary
          links.
        </p>
      </div>
    </section>
  );
}
