import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "Orlowsky Discovery Hotel | Candidasa, Bali",
  description:
    "Four-star boutique hotel on the shores of Candidasa, East Bali. Ocean-view villas, tropical gardens, spa, diving, and authentic Balinese hospitality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preload hero video for faster LCP */}
        <link rel="preload" as="video" href="/video/hero-desktop.webm" type="video/webm" />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`} suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var h=new Date().getHours();if(h<6||h>=20||window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('night');})();` }} />
        <LanguageProvider>
          <LoadingScreen />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
