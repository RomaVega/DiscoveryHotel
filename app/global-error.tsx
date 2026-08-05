"use client"; // Error boundaries must be client components

import { useState } from "react";
import { ErrorFallback, localeFromPath } from "@/components/layout/ErrorFallback";

/**
 * Catches errors thrown by the root layout itself, including fatal hydration
 * failures. It replaces the whole document, so it renders its own <html>/<body>
 * and cannot rely on anything the root layout sets up (fonts, LanguageProvider).
 *
 * Without this file a single client-side exception blanks a page whose content
 * was already fully present in the static HTML.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const [locale] = useState(localeFromPath);

  if (process.env.NODE_ENV !== "production") {
    console.error("Global error boundary caught:", error);
  }

  return (
    <html lang={locale}>
      <body>
        <ErrorFallback locale={locale} />
      </body>
    </html>
  );
}
