import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400"],
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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${geist.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
