"use client"; // Needs LanguageProvider with defaultLocale="ru"

import { LanguageProvider } from "@/lib/language-context";
import type { ReactNode } from "react";

export default function RuLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Set lang="ru" before hydration so Google sees correct language attribute */}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang='ru'` }} />
      <LanguageProvider defaultLocale="ru">
        {children}
      </LanguageProvider>
    </>
  );
}
