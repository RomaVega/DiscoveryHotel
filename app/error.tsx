"use client"; // Error boundaries must be client components

import { useEffect, useState } from "react";
import { ErrorFallback, localeFromPath } from "@/components/layout/ErrorFallback";
import { reportBoundaryError } from "@/lib/report-error";

/**
 * Catches errors thrown below the root layout — i.e. anything in a page or
 * section. The root layout survives, so this renders in place of `children`.
 * Errors in the layout itself fall through to app/global-error.tsx.
 */
export default function Error({ error }: { error: Error & { digest?: string } }) {
  const [locale] = useState(localeFromPath);

  useEffect(() => {
    reportBoundaryError(error, false);
  }, [error]);

  if (process.env.NODE_ENV !== "production") {
    console.error("Route error boundary caught:", error);
  }

  return <ErrorFallback locale={locale} />;
}
