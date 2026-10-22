// Server Component: static card, no interaction.
import { Car, Flag, Footprints, MapPin } from "lucide-react";
import type { BlogDistance } from "@/lib/types";

const MODE_ICON = { walk: Footprints, drive: Car } as const;

/**
 * "How far is it": two points and the time between them, placed in a post by
 * `[[distance]]`.
 *
 * Deliberately a diagram, not a map. It makes no claim about direction or
 * scale — only the travel times the hotel has measured — so it cannot be wrong
 * about geography. A real map is one tap away through `mapLink`.
 *
 * Phone: the two points stack with a vertical connector and the times beside
 * it. From `sm`: one row, the times stacked above a connector that runs
 * between the points.
 */
export function ArticleDistance({ data }: { data: BlogDistance }) {
  return (
    <aside aria-labelledby="distance-heading" className="my-10 rounded-md border border-charcoal/10 bg-ivory p-6 md:p-8">
      <h3 id="distance-heading" className="font-sans text-xs font-semibold uppercase tracking-widest text-accent-text">
        {data.heading}
      </h3>

      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <Point icon={MapPin} name={data.from.name} note={data.from.note} />

        <div className="flex items-stretch gap-4 py-2 pl-[1.125rem] sm:flex-1 sm:flex-col sm:items-center sm:gap-2 sm:py-0 sm:pl-0">
          {/* The connector: vertical on a phone, horizontal from sm. */}
          <span aria-hidden="true" className="w-0 border-l-2 border-dashed border-deep-teal/40 sm:order-2 sm:h-0 sm:w-full sm:border-l-0 sm:border-t-2" />
          <ul className="flex flex-col justify-center gap-1.5 py-2 sm:order-1 sm:py-0">
            {data.times.map((t) => {
              const Icon = MODE_ICON[t.mode];
              return (
                <li key={t.mode} className="flex items-center gap-2 whitespace-nowrap font-sans text-sm text-charcoal">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-deep-teal" strokeWidth={1.75} />
                  <span>
                    {t.label}: <strong className="font-semibold">{t.time}</strong>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <Point icon={Flag} name={data.to.name} note={data.to.note} />
      </div>

      {data.mapLink && (
        <p className="mt-6">
          <a
            href={data.mapLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-semibold text-accent-text underline underline-offset-[3px] hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 rounded-sm"
          >
            {data.mapLink.label}
            <span aria-hidden="true"> ↗</span>
          </a>
        </p>
      )}
    </aside>
  );
}

function Point({ icon: Icon, name, note }: { icon: typeof MapPin; name: string; note?: string }) {
  return (
    <div className="flex items-start gap-3 sm:max-w-[10rem]">
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-deep-teal">
        <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
      </span>
      <div>
        <p className="font-sans text-sm font-semibold leading-snug text-charcoal">{name}</p>
        {note && <p className="mt-0.5 font-sans text-xs leading-snug text-charcoal/70">{note}</p>}
      </div>
    </div>
  );
}
