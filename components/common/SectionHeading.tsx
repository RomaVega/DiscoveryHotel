import { cn } from "@/lib/utils";
import { MobileBreaks } from "@/components/common/MobileBreaks";

interface SectionHeadingProps {
  label?: string;
  heading: string;
  subtext?: string;
  centered?: boolean;
  /** Extra classes for the h2, merged over the defaults (e.g. a heavier weight). */
  headingClassName?: string;
  /** A short teal hairline between the heading and the subtext. */
  rule?: boolean;
}

export function SectionHeading({
  label,
  heading,
  subtext,
  centered = true,
  headingClassName,
  rule = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 md:mb-16", centered && "text-center")}>
      {label && (
        // 14px, so AA asks 4.5:1 — see the accent-text token in globals.css.
        <span className="font-sans text-sm font-medium uppercase tracking-widest text-accent-text">
          {label}
        </span>
      )}
      <h2 className={cn("font-serif font-light text-4xl md:text-5xl mt-3 text-charcoal", headingClassName)}>
        <MobileBreaks text={heading} />
      </h2>
      {rule && (
        // Decorative, so the same teal as the label rather than brand-teal,
        // which reads as a highlight next to text at this size.
        <div aria-hidden="true" className={cn("mt-5 h-px w-10 bg-accent-text", centered && "mx-auto")} />
      )}
      {subtext && (
        <p className={cn("mt-4 max-w-2xl text-lg leading-relaxed text-stone", centered && "mx-auto")}>
          {subtext}
        </p>
      )}
    </div>
  );
}
