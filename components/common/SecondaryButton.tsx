import { LocalizedLink } from "@/components/common/LocalizedLink";
import { cn } from "@/lib/utils";

/**
 * Shape and colour, without any interaction state.
 *
 * Exported because two call sites cannot use this component: the pill inside an
 * Experiences card and the one inside an ExperiencesHub card are `<span>`s
 * nested in a card-wide `<a>`, and an anchor inside an anchor is invalid HTML.
 * They render the look without the semantics, so they share the constant
 * instead of hand-copying the class list — which is how the two of them drifted
 * out of sync with this file in the first place.
 *
 * deep-teal rather than brand-teal: brand-teal is 2.13:1 on sand as text, and
 * its border misses the 3:1 non-text floor too.
 */
export const SECONDARY_BUTTON_BASE =
  "inline-block bg-transparent border border-deep-teal text-accent-text " +
  "font-sans font-semibold px-5 py-2 rounded-full tracking-wide text-xs whitespace-nowrap " +
  "transition-all duration-300";

/**
 * Hover fill. Text goes charcoal, not white: white on brand-teal is 2.41:1,
 * while charcoal on the same fill is 7.21:1.
 */
export const SECONDARY_BUTTON_HOVER =
  "hover:bg-brand-teal hover:text-charcoal hover:scale-[1.04] active:scale-[0.97]";

const BASE_STYLES =
  SECONDARY_BUTTON_BASE + " " + SECONDARY_BUTTON_HOVER + " " +
  "focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2";

interface SecondaryButtonBase {
  children: React.ReactNode;
  className?: string;
}

interface SecondaryButtonAsLink extends SecondaryButtonBase {
  href: string;
  external?: boolean;
  onClick?: never;
}

interface SecondaryButtonAsButton extends SecondaryButtonBase {
  href?: never;
  external?: never;
  onClick: () => void;
  /** Forwarded to the <button> — needed when this drives a disclosure. */
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

type SecondaryButtonProps = SecondaryButtonAsLink | SecondaryButtonAsButton;

export function SecondaryButton({ children, className, ...rest }: SecondaryButtonProps) {
  const styles = cn(BASE_STYLES, className);

  if ("onClick" in rest && rest.onClick) {
    return (
      <button
        onClick={rest.onClick}
        aria-expanded={rest["aria-expanded"]}
        aria-controls={rest["aria-controls"]}
        className={styles}
      >
        {children}
      </button>
    );
  }

  const { href, external } = rest as SecondaryButtonAsLink;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles}>
        {children}
      </a>
    );
  }

  return (
    <LocalizedLink href={href!} className={styles}>
      {children}
    </LocalizedLink>
  );
}
