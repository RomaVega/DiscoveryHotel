"use client"; // Uses useLanguage for locale-based contact filtering

import { FadeIn } from "@/components/common/FadeIn";
import { MessageCircle, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
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
    <section className="py-16 md:py-24 bg-sand">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* WhatsApp */}
            <div className="bg-ivory p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <MessageCircle size={20} className="text-brand-teal shrink-0" />
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
                  WhatsApp
                </h2>
              </div>
              <div className="space-y-3">
                {whatsappContacts.map((c) => (
                  <a
                    key={c.number}
                    href={`https://wa.me/${c.number}?text=${encodeURIComponent(c.greeting)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-sans text-sm text-charcoal hover:text-brand-teal transition-colors duration-200"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="bg-ivory p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Mail size={20} className="text-brand-teal shrink-0" />
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
                  Email
                </h2>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="font-sans text-sm text-charcoal hover:text-brand-teal transition-colors duration-200 break-all"
              >
                {contact.email}
              </a>
            </div>

            {/* Address + Socials */}
            <div className="bg-ivory p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <MapPin size={20} className="text-brand-teal shrink-0" />
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-charcoal">
                  {isRu ? "Адрес" : "Address"}
                </h2>
              </div>
              <address className="not-italic font-sans text-sm text-charcoal leading-relaxed">
                {contact.address.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </address>
              <div className="flex gap-4 mt-6">
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
        </FadeIn>
      </div>
    </section>
  );
}
