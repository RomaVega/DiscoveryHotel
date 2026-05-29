"use client"; // Reads current locale from context to prefix internal hrefs

import { useContext } from "react";
import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { LanguageContext, localizedPath } from "@/lib/language-context";

type Props = Omit<LinkProps, "href"> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> & {
    href: string;
    children: ReactNode;
  };

/**
 * Drop-in replacement for `next/link` that prefixes the href with the current
 * locale. From a /ru/* page, <LocalizedLink href="/rooms"> renders /ru/rooms.
 * External URLs, hashes, and already-localized paths pass through unchanged.
 */
export function LocalizedLink({ href, children, ...rest }: Props) {
  // Falls back to "en" when no provider is mounted (404 page, isolated test).
  const locale = useContext(LanguageContext)?.locale ?? "en";
  const resolved =
    href.startsWith("/") && !href.startsWith("//")
      ? localizedPath(href, locale)
      : href;
  return (
    <Link href={resolved} {...rest}>
      {children}
    </Link>
  );
}
