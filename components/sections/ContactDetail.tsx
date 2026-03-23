"use client"; // Uses useLanguage for locale-based contact filtering

import { FadeIn } from "@/components/common/FadeIn";
import { Facebook, Instagram, Youtube } from "lucide-react";
import type { ContactData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Facebook,
  Instagram,
  Youtube,
};

interface ContactDetailProps {
  contact: ContactData;
}

export function ContactDetail({ contact }: ContactDetailProps) {
  const { locale } = useLanguage();
  const isRu = locale === "ru";

  const whatsappContacts = isRu
    ? contact.whatsappContacts
    : contact.whatsappContacts.filter((c) => c.locale === "en" || c.locale === "all");

  return (
    <FadeIn>
      <section className="bg-sand py-20 md:py-28 px-6">
        <div className="max-w-2xl mx-auto space-y-14">

          {/* WhatsApp */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone mb-4">
              WhatsApp
            </p>
            <div className="space-y-3">
              {whatsappContacts.map((c) => (
                <a
                  key={c.number}
                  href={`https://wa.me/${c.number}?text=${encodeURIComponent(c.greeting)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-serif text-3xl md:text-4xl font-light text-charcoal hover:text-brand-teal transition-colors duration-200"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-charcoal/8" />

          {/* Email */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone mb-4">
              Email
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="font-serif text-3xl md:text-4xl font-light text-charcoal hover:text-brand-teal transition-colors duration-200 break-all"
            >
              {contact.email}
            </a>
          </div>

          <div className="w-full h-px bg-charcoal/8" />

          {/* Address */}
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-stone mb-4">
              {isRu ? "Адрес" : "Address"}
            </p>
            <address className="not-italic font-serif text-3xl md:text-4xl font-light text-charcoal leading-snug">
              {contact.address.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>
            <div className="flex gap-5 mt-8">
              {contact.socials.map((social) => {
                const Icon = iconMap[social.icon];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="text-charcoal/40 hover:text-charcoal transition-colors duration-200"
                  >
                    <Icon size={18} />
                  </a>
                ) : null;
              })}
            </div>
          </div>

        </div>
      </section>
    </FadeIn>
  );
}
