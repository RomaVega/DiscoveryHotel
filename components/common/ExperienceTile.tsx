import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { joinSlashes, longestTitleLine, splitTitle } from "@/lib/typography";
import type { ExperienceCard } from "@/lib/types";

interface ExperienceTileProps {
  item: ExperienceCard;
  /** Title and alt text already resolved for the page's locale. */
  title: string;
  imageAlt: string;
  /**
   * Characters to fit across the tile — pass the grid's longest title line
   * (`longestTitleLine`) so every tile in a row shrinks to the same size on a
   * narrow phone instead of each sizing to its own title. Defaults to this
   * tile's own longest line.
   */
  fitChars?: number;
}

/**
 * Average advance of one character of Cormorant Garamond Bold, in em, measured
 * on the widest titles: "Аюрведический" is 6.86em over 13 characters, "Car &
 * Motorbike" 7.2em over 15. Used to shrink the title on narrow tiles so its
 * longest line always fits on one line (see the font-size below).
 */
const EM_PER_CHAR = 0.53;

const TILE_CLASS =
  "group @container isolate relative block aspect-[4/5] overflow-hidden rounded-2xl bg-espresso " +
  "shadow-lg shadow-espresso/20 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-sand";

/**
 * A photo tile for one experience: the photo fills a 4:5 card, and the title
 * sits at the bottom in white Cormorant Bold on a warm shade that covers only
 * the text, always on two lines (see `splitTitle`). A thin white keyline frames
 * the photo.
 *
 * Shared by the home page's Experiences section and the /experiences hub, so
 * the same six cards look identical on both — the reason the old cards' titles
 * were moved to Inter was that the two pages had drifted apart.
 *
 * Titles over photography need a ground dark enough for AA. An earlier overlay
 * attempt was dropped after one title measured 1.3:1 against a white dress.
 * This shade covers only the title: measured on the built pages (Oct 2026: all
 * six photos, EN and RU, home and /experiences, at 320, 360, 390 and 1280px),
 * white measures at least 6.71:1 against the brightest single pixel behind any
 * title, and at least 7.4:1 at the 95th percentile — above 4.5:1, so it holds
 * even where a narrow phone shrinks the title below the 18.66px bold "large
 * text" size. Re-measure before lightening the shade, shortening its fade, or
 * adding a photo with a bright lower edge.
 */
export function ExperienceTile({ item, title, imageAlt, fitChars }: ExperienceTileProps) {
  const lines = splitTitle(title);
  const chars = fitChars ?? longestTitleLine(title);
  const fit = { "--title-em": (chars * EM_PER_CHAR).toFixed(2) } as CSSProperties;

  const inner = (
    <>
      <Image
        src={item.image}
        alt={imageAlt}
        fill
        sizes="(max-width: 1024px) 50vw, 400px"
        className="object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.02]"
        // The tile is portrait and every source is landscape, so roughly half
        // the photo's width shows; the focal point comes from content.
        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
      />
      <h3
        // Font size: the cap (21px on phones, 28px from sm), or less when the
        // tile is too narrow for the longest line — 100cqi is the tile's width,
        // minus the 1rem of side padding, divided by that line's width in em.
        // Cards are 130px wide at 320px, which is where the cap gives way.
        //
        // The shade is the title's own background, so it is exactly as tall as
        // the text plus a 20px fade above it (pt-5) at any size. It used to be a
        // full-card overlay fading out at 70% of the height, which darkened half
        // of every photo for two lines of text.
        className={
          "absolute inset-x-0 bottom-0 px-2 pt-5 pb-[18px] sm:pb-6 text-center text-white text-shadow-subtle " +
          "bg-linear-to-t from-espresso/85 via-espresso/72 via-75% to-transparent " +
          // Cormorant Bold comes from its own font instance, --font-serif-bold,
          // which is the only place 700 is loaded (see app/layout.tsx).
          "font-[family-name:var(--font-serif-bold)] font-bold leading-[1.1] tracking-[0.02em] " +
          "text-[length:min(1.3125rem,calc((100cqi_-_1rem)/var(--title-em)))] " +
          "sm:text-[length:min(1.75rem,calc((100cqi_-_1rem)/var(--title-em)))]"
        }
        style={fit}
      >
        {lines.map((line, i) => (
          // The space between the block spans keeps the accessible name
          // "Ayurvedic Spa" rather than "AyurvedicSpa"; it collapses visually.
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="block whitespace-nowrap">{joinSlashes(line)}</span>
          </Fragment>
        ))}
      </h3>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/50"
      />
    </>
  );

  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={TILE_CLASS}>
      {inner}
    </a>
  ) : (
    <Link href={item.href} className={TILE_CLASS}>
      {inner}
    </Link>
  );
}
