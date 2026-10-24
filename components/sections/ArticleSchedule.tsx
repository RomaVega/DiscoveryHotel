// Server Component: an event's days as a timeline, placed in the prose by `[[schedule]]`.
import { datePartsOf, type BlogStrings } from "@/lib/blog";
import type { BlogScheduleDay, Locale } from "@/lib/types";

interface ArticleScheduleProps {
  days: BlogScheduleDay[];
  locale: Locale;
  strings: BlogStrings;
}

/*
 * The dates are the markers because the days are the sequence: each day's
 * number is set large in the rail, as the hero sets the race dates, and a
 * hairline runs from one day to the next. Race starts (`key`) are bold, so a
 * runner finds their own start without reading every line. On sand the
 * figures are accent-text (5.36:1) and times charcoal/70 (6.05:1).
 */
export function ArticleSchedule({ days, locale, strings }: ArticleScheduleProps) {
  return (
    <ol aria-label={strings.blog.schedule} className="my-10 font-sans">
      {days.map((day, i) => {
        const d = datePartsOf(day.date, locale);
        const last = i === days.length - 1;
        return (
          <li key={day.date} className="relative grid grid-cols-[3.5rem_1fr] gap-x-4 sm:grid-cols-[4.5rem_1fr] sm:gap-x-6">
            {!last && (
              <span aria-hidden="true" className="absolute bottom-3 left-7 top-[4.75rem] w-px bg-charcoal/20 sm:left-9" />
            )}
            <p className="text-center">
              <time dateTime={day.date}>
                <span className="block font-serif text-5xl font-medium leading-none lining-nums text-accent-text">{d.day}</span>
                <span className="mt-1.5 block text-xs font-medium uppercase tracking-widest text-charcoal/70">{d.monthShort}</span>
              </time>
            </p>
            <div className={last ? "" : "pb-10"}>
              <p className="pt-1 text-base font-semibold text-charcoal md:text-lg">{d.weekday}</p>
              <ul className="mt-3 space-y-2">
                {day.items.map((item) => (
                  <li
                    key={`${item.time} ${item.what}`}
                    className="grid grid-cols-[5.75rem_1fr] items-baseline gap-x-3 text-[0.9375rem] leading-snug sm:grid-cols-[6.75rem_1fr] md:text-base"
                  >
                    <span className={`whitespace-nowrap text-sm tabular-nums sm:text-[0.9375rem] md:text-base ${item.key ? "font-semibold text-accent-text" : "text-charcoal/70"}`}>
                      {item.time}
                    </span>
                    <span className={`text-pretty ${item.key ? "font-semibold text-charcoal" : "text-charcoal"}`}>{item.what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
