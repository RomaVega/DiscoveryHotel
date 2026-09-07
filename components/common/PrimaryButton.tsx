import { LocalizedLink } from "@/components/common/LocalizedLink";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

/**
 * The button's own classes, for the rare call site that cannot render the
 * component — a `mailto:` cannot go through `LocalizedLink`, and `external`
 * would force `target="_blank"` and leave an empty tab behind. Import this
 * rather than hand-copying, the way SECONDARY_BUTTON_BASE is used.
 *
 * charcoal on the teal fill, not white: white is 2.41:1 on brand-teal,
 * charcoal is 7.21:1. The fill itself is unchanged, so the button keeps the
 * brand's teal. Hover moves to cta-teal (6.28:1) rather than the old
 * deep-teal, which would drop dark text to 2.86:1.
 *
 * The transition names its properties explicitly rather than using
 * `transition-colors` or `transition-all`. It was `transition-colors`, which
 * does not cover the scale, so both steps below jumped instantly: the hover
 * animation was declared but never actually ran. `transition-all` would fix
 * that by also transitioning width/height/padding, which the Animation Rules
 * rule out — hence the explicit list.
 *
 * The property is `scale`, not `transform`: Tailwind 4 compiles `scale-[1.04]`
 * to the standalone `scale:` CSS property, so a list naming `transform` still
 * animates nothing. Anything added here later has the same trap — `translate-*`
 * and `rotate-*` are their own properties too, and each needs adding by name.
 * (The `transition-transform` utility covers all four; it just cannot be
 * combined with colours in one property list.)
 *
 * The scales are `motion-safe:` so prefers-reduced-motion drops them entirely
 * (static fallback) while the colour change still eases, matching how
 * GalleryMosaic gates its image zoom.
 */
export const PRIMARY_BUTTON_BASE = [
  "inline-block bg-brand-teal hover:bg-cta-teal motion-safe:hover:scale-[1.04] motion-safe:active:scale-[0.97] text-charcoal font-sans font-semibold",
  "px-8 py-3 rounded-full tracking-wide uppercase text-sm",
  "transition-[background-color,scale] duration-300 ease-out",
  "focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2",
].join(" ");

export function PrimaryButton({
  href,
  children,
  className,
  external = false,
}: PrimaryButtonProps) {
  const styles = cn(PRIMARY_BUTTON_BASE, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <LocalizedLink href={href} className={styles}>
      {children}
    </LocalizedLink>
  );
}
