"use client"; // Uses useLanguage

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { BookingBar } from "@/components/layout/BookingBar";
import type { ContactData } from "@/lib/types";

interface InnerPageLayoutProps {
  contact: ContactData;
  children: React.ReactNode;
  /** Overrides the floating Book Now's label and link for this page (see BookingBar). */
  bookingCta?: { label: string; href: string };
  /** Long reading pages: floating buttons hide while scrolling down on phones/tablets. */
  hideFloatingWhileScrollingDown?: boolean;
}

export function InnerPageLayout({ contact, children, bookingCta, hideFloatingWhileScrollingDown = false }: InnerPageLayoutProps) {
  return (
    <>
      <Navbar alwaysVisible />
      <main id="main-content">
        {children}
      </main>
      <Footer contact={contact} />
      <WhatsAppButton
        phone={contact.whatsapp}
        greeting={contact.whatsappGreeting}
        contacts={contact.whatsappContacts}
        alwaysVisible
        hideWhileScrollingDown={hideFloatingWhileScrollingDown}
      />
      <BookingBar alwaysVisible cta={bookingCta} hideWhileScrollingDown={hideFloatingWhileScrollingDown} />
    </>
  );
}
