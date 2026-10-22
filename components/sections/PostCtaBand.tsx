// Server Component: chooses between the post's own band and the generic one.
import { BookingCta } from "@/components/sections/BookingCta";
import type { BlogStrings } from "@/lib/blog";
import type { ResolvedPostCta } from "@/lib/blog-meta";
import type { BookingCtaData } from "@/lib/types";

interface PostCtaBandProps {
  /** The post's resolved CTA, or null when it has none or its offer is off. */
  cta: ResolvedPostCta | null;
  /** The site's generic band (home.json `bookingCta`) — used when `cta` is null. */
  fallback: BookingCtaData;
  strings: BlogStrings;
}

/**
 * The deep-teal band at the foot of a post. Same component and look as every
 * other page's band, so a post does not invent its own CTA style — only the
 * words, the destination (the offer's WhatsApp enquiry) and the promo code
 * between subtext and button change.
 */
export function PostCtaBand({ cta, fallback, strings }: PostCtaBandProps) {
  if (!cta) return <BookingCta data={fallback} />;

  return (
    <BookingCta
      data={{ heading: cta.heading, subtext: cta.subtext, bookingUrl: cta.href, fallbackCta: cta.button }}
      ctaLocation="blog_band"
    >
      {cta.code && (
        // contrast-ok: white on deep-teal 6.08:1, white/80 4.54:1 (see Design Tokens).
        <p className="inline-flex items-baseline gap-3 rounded-md border-2 border-dashed border-white/50 px-4 py-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-white/80">{strings.offers.codeLabel}</span>
          <span className="font-mono text-xl font-semibold tracking-wider text-white">{cta.code}</span>
        </p>
      )}
    </BookingCta>
  );
}
