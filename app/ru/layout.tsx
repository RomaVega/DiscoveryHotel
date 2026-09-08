import { LanguageProvider } from "@/lib/language-context";
import type { ReactNode } from "react";

export default function RuLayout({ children }: { children: ReactNode }) {
  return (
    // lang="ru" is stamped into the served HTML by scripts/fix-ru-lang.js and
    // kept in step across client-side language switches by LanguageProvider.
    // The inline script that used to sit here did neither job properly: React
    // inserts it via innerHTML on a router.push(), and the HTML spec says
    // scripts inserted that way never execute.
    <LanguageProvider locale="ru">{children}</LanguageProvider>
  );
}
