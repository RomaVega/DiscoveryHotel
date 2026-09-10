"use client"; // Framer Motion sheen + useLanguage

import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { PRIMARY_BUTTON_BASE } from "@/components/common/PrimaryButton";
import { useLanguage } from "@/lib/language-context";
import { BOOKING_URL } from "@/lib/booking";

interface BookNowButtonProps {
  className?: string;
  onClick?: () => void;
  /**
   * `solid` (default) is the teal pill used everywhere the ground is known.
   *
   * `ghost` is the hero's treatment — an outlined button that lets the video
   * through, so the hero stays cinematic instead of carrying a brand-coloured
   * slab. It is NOT the original ghost button: that one used `bg-black/15`,
   * which over a bright frame darkened almost nothing and left white text at
   * 1.32:1.
   *
   * `black/30` is the lightest scrim with real margin. Measured by scanning
   * all 8s of the mobile hero video at 40 points, finding the brightest frame
   * under the button (t=7.30s, rgb(164,193,198)) and testing against that one
   * frame: /30 gives 5.73:1 and /25 gives 4.76:1, which is AA's 4.5 floor with
   * almost nothing left. **Anything lighter fails, and a new hero video moves
   * the frame this was measured against** — re-run the scan before changing
   * either the scrim or the video.
   */
  variant?: "solid" | "ghost";
}

/**
 * The site's booking CTA, in one place.
 *
 * It exists as a component rather than an exported class string because the
 * treatment is no longer a single line — a gradient fill, a white keyline, two
 * shadow layers and an animated sheen — and CLAUDE.md's rule about not
 * hand-copying `PRIMARY_BUTTON_BASE` applies with more force the longer the
 * string gets. The floating button and the mobile drawer render this same
 * component, so they cannot drift apart.
 *
 * The label comes from `nav.bookNow`, the same key the navbar uses, so all
 * three surfaces are one word by construction. They briefly were not: the
 * floating button carried its own `bookingBar.label`, and English ended up
 * saying "Book Stay" in the navbar and "Book Now" on the button.
 */
export function BookNowButton({ className, onClick, variant = "solid" }: BookNowButtonProps) {
  const { tl } = useLanguage();

  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        PRIMARY_BUTTON_BASE,
        variant === "ghost" && [
          // Overrides the base's fill, label colour, weight and tracking. The
          // base's `uppercase` is deliberately kept — the hero's CTA was always
          // letterspaced caps, and that is the part of the old look worth
          // keeping.
          "bg-black/30 hover:bg-black/45 text-white",
          "border border-white/70 hover:border-white",
          "font-light tracking-[0.18em]",
          // The drop shadow does not replace the scrim — it softens the glyph
          // edges over busy footage. WCAG does not count it toward contrast.
          "drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",
        ],
        // relative + overflow-hidden + isolate contain the sheen to the pill's
        // rounded shape and keep it under the label.
        "relative overflow-hidden isolate",
        // A vertical teal gradient rather than the flat fill: it gives the pill
        // a little dimension without changing its size. Both stops are
        // documented button fills and both hold the base's charcoal label —
        // measured 7.36:1 on brand-teal at the top and 7.23:1 lower down.
        //
        // The label stays charcoal. espresso was tried and is warmer but
        // measurably dimmer (6.64 / 5.86); white would be 2.41:1 and is the
        // exact regression PrimaryButton already fixed once.
        variant === "solid" && "bg-gradient-to-b from-brand-teal to-cta-teal",
        // normal-case because the label is written "Book Now", not shouted.
        variant === "solid" && "normal-case",
        // Three layers in one box-shadow rather than a border or Tailwind's
        // `ring`: a border would add 2px and break both the 44px height and the
        // midline alignment with the WhatsApp mark, and `ring` is also
        // box-shadow, so it would fight this declaration.
        //
        //  1. a white hairline keyline — the same construction the WhatsApp logo
        //     already has, so the pair reads as one set. 1.13:1 on the sand page
        //     (invisible where nothing is needed) and 15.56:1 over a dark photo,
        //     which is where it earns its keep. Deliberately weak against the
        //     fill (2.41:1) so it stays a keyline and never becomes an outline.
        //  2. a tight shadow to seat the edge.
        //  3. a wide soft one for the lift.
        variant === "solid" && "shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_2px_6px_rgba(0,0,0,0.16),0_8px_24px_rgba(0,0,0,0.18)]",
        className
      )}
    >
      <span className="relative z-10">{tl.nav.bookNow}</span>
      {/* Sheen. Decorative, transform-only, and long-delayed: a highlight that
          crosses once every few seconds reads as a catch of light, while a fast
          or frequent one reads as a banner ad. Framer Motion so `MotionConfig
          reducedMotion="user"` in MotionProvider drops it for anyone who asks —
          a CSS keyframe would need its own query. */}
      {variant === "solid" && (
      <m.span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/3 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
        animate={{ x: ["0%", "460%"] }}
        transition={{ duration: 1.15, ease: "easeInOut", repeat: Infinity, repeatDelay: 4.5 }}
      />
      )}
    </a>
  );
}
