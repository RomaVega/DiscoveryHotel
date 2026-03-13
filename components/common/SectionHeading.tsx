import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  heading: string;
  subtext?: string;
  centered?: boolean;
  light?: boolean;
}

export function SectionHeading({
  label,
  heading,
  subtext,
  centered = true,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 md:mb-16", centered && "text-center")}>
      {label && (
        <span
          className={cn(
            "font-sans text-sm font-medium uppercase tracking-widest",
            light ? "text-brand-teal/80" : "text-brand-teal"
          )}
        >
          {label}
        </span>
      )}
      <h2
        className={cn(
          "font-serif font-light text-4xl md:text-5xl mt-3",
          light ? "text-white" : "text-charcoal"
        )}
      >
        {heading}
      </h2>
      {subtext && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg leading-relaxed",
            centered && "mx-auto",
            light ? "text-white/70" : "text-stone"
          )}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
