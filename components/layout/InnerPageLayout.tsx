"use client"; // Uses useLanguage

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import type { ContactData } from "@/lib/types";

interface InnerPageLayoutProps {
  contact: ContactData;
  children: React.ReactNode;
}

export function InnerPageLayout({ contact, children }: InnerPageLayoutProps) {
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
      />
    </>
  );
}
