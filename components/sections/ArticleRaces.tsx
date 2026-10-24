// Server Component: a race weekend's distances as one band, placed in the
// prose by `[[races]]`. Edge to edge, so ArticleBody renders it between runs
// of the text column rather than inside one.
import { formatPostNumber, type BlogStrings } from "@/lib/blog";
import type { BlogRaces, Locale } from "@/lib/types";
import { fill } from "@/lib/utils";

interface ArticleRacesProps {
  races: BlogRaces;
  locale: Locale;
  strings: BlogStrings;
}

/*
 * Espresso, the footer's ground: the long races start in the dark, and gold on
 * espresso is the brand mark's own pairing. Colours are the footer's measured
 * set — white for figures, parchment/75 for names (7.62:1), /65 for labels
 * (6.07:1) — and logo-gold (7.04:1 on espresso) appears only on this ground;
 * on sand it is 2.01:1.
 *
 * Each column's climbing is drawn to scale against the hilliest distance, so
 * side by side the bars step down from the ultra to the family run. Fine gold
 * rules rather than a solid fill: they read as contour lines, and a solid
 * block of gold at this size shouts. Only published figures belong here.
 */
export function ArticleRaces({ races, locale, strings }: ArticleRacesProps) {
  const s = strings.blog.races;
  const most = Math.max(1, ...races.items.map((r) => r.climb));
  const num = (n: number) => formatPostNumber(n, locale);

  return (
    <section aria-label={s.label} className="my-16 bg-espresso py-14 text-white md:my-20 md:py-20">
      <ol className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-14 px-6 md:grid-cols-4 lg:gap-x-12">
        {races.items.map((race) => {
          // A floor of 4% keeps a flat race visible as a sliver rather than nothing.
          const share = Math.max(4, Math.round((race.climb / most) * 100));
          return (
            <li key={race.km} className="flex min-w-0 flex-col">
              <p className="font-sans text-sm leading-snug text-parchment/75">{race.name}</p>
              <p className="mt-2 font-serif text-7xl font-medium leading-[0.85] lining-nums lg:text-8xl">
                {num(race.km)}
                <span className="ml-1.5 font-sans text-base font-medium text-logo-gold">{s.km}</span>
              </p>

              {/* The climb, with its figure riding on top of the bar. */}
              <div className="relative mt-4 h-36 border-b border-parchment/30 lg:h-48">
                <div className="absolute inset-x-0 bottom-0 top-16">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 bg-[repeating-linear-gradient(to_top,var(--color-logo-gold)_0_1px,transparent_1px_6px)]"
                    style={{ height: `${share}%` }}
                  />
                  <p className="absolute inset-x-0 pb-2 leading-tight" style={{ bottom: `${share}%` }}>
                    <span className="block font-serif text-2xl lining-nums">{fill(s.metres, { n: num(race.climb) })}</span>
                    <span className="block font-sans text-xs text-parchment/65">{s.climb}</span>
                  </p>
                </div>
              </div>

              <dl className="mt-4 divide-y divide-parchment/10 font-sans text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 pb-2.5">
                  <dt className="text-xs text-parchment/65">{s.start}</dt>
                  <dd className="text-right">
                    <span className="tabular-nums">{race.start}</span>
                    <span className="block text-xs text-parchment/75">{race.day}</span>
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 py-2.5">
                  <dt className="text-xs text-parchment/65">{s.cutoff}</dt>
                  <dd>{race.cutoff}</dd>
                </div>
                <div className="pt-2.5">
                  <dt className="text-xs text-parchment/65">{fill(s.entry, { currency: races.currency })}</dt>
                  <dd className="mt-1 space-y-0.5">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-xs text-parchment/75">{s.local}</span>
                      <span className="tabular-nums">{num(race.entry.local)}</span>
                    </span>
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-xs text-parchment/75">{s.foreign}</span>
                      <span className="tabular-nums">{num(race.entry.foreign)}</span>
                    </span>
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
