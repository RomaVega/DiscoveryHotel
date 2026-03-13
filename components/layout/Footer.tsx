"use client"; // Uses useLanguage for translated labels and locale-based contact filtering

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  MapPin,
  CreditCard,
} from "lucide-react";
import type { ContactData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";

const iconMap: Record<string, React.FC<{ size?: number }>> = {
  Facebook,
  Instagram,
  Youtube,
};

interface FooterProps {
  contact: ContactData;
}

export function Footer({ contact }: FooterProps) {
  const { locale, tl } = useLanguage();

  const isRu = locale === "ru";

  const ruContacts = contact.whatsappContacts.filter((c) => c.locale === "ru");
  const enContacts = contact.whatsappContacts.filter((c) => c.locale === "en");

  const footerLinks = [
    { label: tl.footer.links.rooms, href: "#rooms" },
    { label: tl.footer.links.amenities, href: "#amenities" },
    { label: tl.footer.links.experiences, href: "#experiences" },
    { label: tl.footer.links.offers, href: "#offers" },
    { label: tl.footer.links.gallery, href: "#gallery" },
  ];

  const experienceLinks = [
    { label: tl.footer.experienceLinks.sightseeing, href: "/excursions" },
    { label: tl.footer.experienceLinks.ubud, href: "/excursions" },
    { label: tl.footer.experienceLinks.diving, href: "/diving" },
    { label: tl.footer.experienceLinks.trekking, href: "/excursions" },
    { label: tl.footer.experienceLinks.volcano, href: "/excursions" },
  ];

  return (
    <footer id="contact" className="bg-deep-teal text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 sm:pt-20 pb-10 sm:pb-12">
        {/* Logo + tagline — centered */}
        <div className="flex flex-col items-center mb-10 sm:mb-16">
          <Link
            href="/"
            className="flex flex-col items-center text-center hover:opacity-80 transition-opacity duration-200"
          >
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Orlowsky Discovery Hotel"
              width={48}
              height={48}
              unoptimized
              className="object-contain mb-3 sm:mb-4 brightness-0 invert"
            />
            <h3 className="font-serif text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-white">
              Orlowsky Discovery
            </h3>
            <p className="font-sans text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-white/40 mt-1.5">
              Candidasa · East Bali
            </p>
          </Link>
          <div className="flex items-center gap-2.5 mt-4 sm:mt-5 text-white/25">
            <span className="block h-px w-6 sm:w-8 bg-white/15" />
            {Array.from({ length: contact.stars }).map((_, i) => (
              <span key={i} className="text-[8px]">
                ✦
              </span>
            ))}
            <span className="block h-px w-6 sm:w-8 bg-white/15" />
          </div>
        </div>

        {/* Columns — mobile: centered, 2-col for links; desktop: 4-col */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12 text-center sm:text-left">
          {/* Explore */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 sm:mb-5">
              {tl.footer.explore}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-[13px] sm:text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 sm:mb-5">
              {tl.footer.experiences}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {experienceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-sans text-[13px] sm:text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full width on mobile, centered */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 sm:mb-5">
              {tl.footer.contact}
            </h4>
            <ul className="space-y-3 inline-flex flex-col items-center sm:items-start">
              {/* Russian WhatsApp numbers */}
              {isRu && ruContacts.length > 0 && (
                <li>
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/35 mb-1.5">
                    {tl.footer.whatsappRu}
                  </p>
                  <div className="space-y-1.5">
                    {ruContacts.map((c) => (
                      <a
                        key={c.number}
                        href={`https://wa.me/${c.number}?text=${encodeURIComponent(c.greeting)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[13px] sm:text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        <MessageCircle size={14} className="text-brand-teal shrink-0" />
                        {c.label}
                      </a>
                    ))}
                  </div>
                </li>
              )}

              {/* English / Indonesian WhatsApp */}
              {enContacts.length > 0 && (
                <li>
                  {isRu && (
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/35 mb-1.5">
                      {tl.footer.whatsappHotel}
                    </p>
                  )}
                  <div className="space-y-1.5">
                    {enContacts.map((c) => (
                      <a
                        key={c.number}
                        href={`https://wa.me/${c.number}?text=${encodeURIComponent(c.greeting)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[13px] sm:text-sm text-white/60 hover:text-white transition-colors duration-200"
                      >
                        <MessageCircle size={14} className="text-brand-teal shrink-0" />
                        {c.label}
                      </a>
                    ))}
                  </div>
                </li>
              )}

              {/* Email */}
              <li className="pt-1">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-[13px] sm:text-sm text-white/60 hover:text-white transition-colors duration-200"
                >
                  <Mail size={14} className="text-brand-teal shrink-0" />
                  {contact.email}
                </a>
              </li>
            </ul>

            {/* Social icons — under contacts */}
            <div className="flex justify-center sm:justify-start gap-5 mt-5">
              {contact.socials.map((social) => {
                const Icon = iconMap[social.icon];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="text-white/30 hover:text-white transition-colors duration-200"
                  >
                    <Icon size={18} />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {/* Location */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 sm:mb-5">
              Location
            </h4>
            <div className="inline-flex flex-col items-center sm:items-start gap-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-teal shrink-0 mt-0.5" />
                <address className="not-italic text-[13px] sm:text-sm text-white/60 leading-relaxed">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans text-xs text-brand-teal hover:text-white transition-colors duration-200 tracking-wide"
              >
                {tl.footer.getDirections}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Payment note — Russian locale only */}
        {isRu && tl.footer.paymentNote && (
          <div className="mt-10 sm:mt-12 flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2.5 border border-white/10 rounded-sm max-w-sm text-center sm:text-left">
              <CreditCard size={14} className="text-brand-teal shrink-0 hidden sm:block" />
              <p className="font-sans text-[11px] sm:text-xs text-white/50 leading-relaxed tracking-wide">
                {tl.footer.paymentNote}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="font-sans text-[11px] sm:text-xs text-white/30 tracking-wide">
            &copy; {new Date().getFullYear()} {contact.hotelName}. {tl.footer.allRightsReserved}.
          </p>
          <p className="font-sans text-[10px] text-white/20 tracking-wider uppercase">
            Candidasa · Karangasem · Bali
          </p>
        </div>
      </div>
    </footer>
  );
}
