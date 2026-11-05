import type { ReactNode } from "react";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { cn } from "@/lib/utils";

/**
 * "Label →" link from one page's content to another page of the site — the
 * Location page's route to /transfer, the Events wedding card to /weddings.
 * Same teal-semibold-arrow treatment as the blog's "Read post →", but
 * underlined at rest: it sits inside a block of grey text rather than a
 * card-wide link, and on a phone there is no hover to reveal it.
 */
export const TEXT_LINK =
  "inline-block font-sans text-sm font-semibold text-accent-text underline decoration-accent-text/40 underline-offset-[3px] transition-[text-decoration-color] duration-200 hover:decoration-accent-text";

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <LocalizedLink href={href} className={cn(TEXT_LINK, className)}>
      {children}
      <span aria-hidden="true"> →</span>
    </LocalizedLink>
  );
}
