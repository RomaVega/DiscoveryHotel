"use client"; // Error boundaries must be client components

import { useEffect, useState } from "react";
import { ErrorFallback, localeFromPath } from "@/components/layout/ErrorFallback";
import { reportBoundaryError } from "@/lib/report-error";

/**
 * Catches errors thrown by the root layout itself, including fatal hydration
 * failures. It replaces the whole document, so it renders its own <html>/<body>
 * and cannot rely on anything the root layout sets up (fonts, LanguageProvider).
 *
 * Without this file a single client-side exception blanks a page whose content
 * was already fully present in the static HTML.
 *
 * Replacing the document does not tear down the JS context, so gtag/dataLayer
 * loaded by the old tree are still on `window` and the report below still sends.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const [locale] = useState(localeFromPath);

  useEffect(() => {
    reportBoundaryError(error, true);
  }, [error]);

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
