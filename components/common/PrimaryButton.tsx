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
 */
export const PRIMARY_BUTTON_BASE = [
  "inline-block bg-brand-teal hover:bg-cta-teal hover:scale-[1.04] active:scale-[0.97] text-charcoal font-sans font-semibold",
  "px-8 py-3 rounded-full tracking-wide uppercase text-sm",
  "transition-colors duration-300",
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
