import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  heading: string;
  subtext?: string;
  centered?: boolean;
}

export function SectionHeading({
  label,
  heading,
  subtext,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 md:mb-16", centered && "text-center")}>
      {label && (
        // deep-teal, not brand-teal. This eyebrow is 14px, so AA asks 4.5:1 and
        // brand-teal measures 2.13:1 on sand, 2.27:1 on ivory and 1.88:1 on
        // parchment — it fails on every light ground the site uses. deep-teal
        // is 5.36 / 5.73 / 4.74 respectively.
        <span className="font-sans text-sm font-medium uppercase tracking-widest text-deep-teal">
          {label}
        </span>
      )}
      <h2 className="font-serif font-light text-4xl md:text-5xl mt-3 text-charcoal">
        {heading}
      </h2>
      {subtext && (
        <p className={cn("mt-4 max-w-2xl text-lg leading-relaxed text-stone", centered && "mx-auto")}>
          {subtext}
        </p>
      )}
    </div>
  );
}
