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
    { label: tl.footer.links.rooms, href: "/rooms" },
    { label: tl.footer.links.amenities, href: "/dining" },
    { label: tl.footer.links.experiences, href: "/experiences" },
    { label: tl.footer.links.offers, href: "/offers" },
    { label: tl.footer.links.gallery, href: "/gallery" },
  ];

  const experienceLinks = [
    { label: tl.footer.experienceLinks.sightseeing, href: "/experiences/excursions" },
    { label: tl.footer.experienceLinks.ubud, href: "/experiences/excursions" },
    { label: tl.footer.experienceLinks.diving, href: "/experiences/diving" },
    { label: tl.footer.experienceLinks.trekking, href: "/experiences/excursions" },
    { label: tl.footer.experienceLinks.volcano, href: "/experiences/excursions" },
  ];

  return (
    <footer id="contact" className="bg-parchment text-charcoal">
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
              width={80}
              height={80}
              unoptimized
              className="object-contain mb-3 sm:mb-4"
            />
            <h3 className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.15em] uppercase text-charcoal flex flex-col items-center">
              <span>Orlowsky</span>
              <span>Discovery Candidasa</span>
              <span className="mt-3">Hotel</span>
            </h3>
          </Link>
          <div className="flex items-center gap-2.5 mt-1.5" style={{ color: "#C9A84C" }}>
            <span className="block h-px w-6 sm:w-8 bg-charcoal/15" />
            {Array.from({ length: contact.stars }).map((_, i) => (
              <span key={i} className="text-base">
                ★
              </span>
            ))}
            <span className="block h-px w-6 sm:w-8 bg-charcoal/15" />
          </div>
        </div>

        {/* Columns */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-x-8">
          {/* Contact */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50 mb-4 sm:mb-5 underline underline-offset-4 decoration-charcoal/20">
              {tl.footer.contact}
            </h4>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {isRu && ruContacts.length > 0 && (
                <li>
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-charcoal/35 mb-1.5">
                    {tl.footer.whatsappRu}
                  </p>
                  <div className="space-y-1.5">
                    {ruContacts.map((c) => (
                      <a
                        key={c.number}
                        href={`https://wa.me/${c.number}?text=${encodeURIComponent(c.greeting)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[13px] sm:text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                      >
                        <MessageCircle size={14} className="text-brand-teal shrink-0" />
                        {c.label}
                      </a>
                    ))}
                  </div>
                </li>
              )}

              {enContacts.length > 0 && (
                <li>
                  {isRu && (
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-charcoal/35 mb-1.5">
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
                        className="flex items-center gap-2 text-[13px] sm:text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                      >
                        <MessageCircle size={14} className="text-brand-teal shrink-0" />
                        {c.label}
                      </a>
                    ))}
                  </div>
                </li>
              )}

              <li className="pt-1">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-[13px] sm:text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                >
                  <Mail size={14} className="text-brand-teal shrink-0" />
                  {contact.email}
                </a>
              </li>

              {isRu && tl.footer.paymentNote && (
                <li className="pt-1">
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-charcoal/35 mb-1.5">
                    Payment in Russia
                  </p>
                  <p className="font-sans text-[13px] sm:text-sm text-charcoal/60 leading-relaxed">
                    {tl.footer.paymentNote}
                  </p>
                </li>
              )}
            </ul>

            <div className="flex justify-center md:justify-start gap-5 mt-5">
              {contact.socials.map((social) => {
                const Icon = iconMap[social.icon];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="text-charcoal/30 hover:text-charcoal transition-colors duration-200"
                  >
                    <Icon size={18} />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {/* Location */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50 mb-4 sm:mb-5 underline underline-offset-4 decoration-charcoal/20">
              Location
            </h4>
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-teal shrink-0 mt-0.5" />
                <address className="not-italic text-[13px] sm:text-sm text-charcoal/60 leading-relaxed text-left">
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
                className="inline-flex items-center gap-1.5 font-sans text-xs text-brand-teal hover:text-deep-teal transition-colors duration-200 tracking-wide"
              >
                {tl.footer.getDirections}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-charcoal/10 md:w-px md:border-t-0 md:border-l md:self-stretch" />

          {/* Experiences */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50 mb-4 sm:mb-5 underline underline-offset-4 decoration-charcoal/20">
              {tl.footer.experiences}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {experienceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-[13px] sm:text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/50 mb-4 sm:mb-5 underline underline-offset-4 decoration-charcoal/20">
              {tl.footer.explore}
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-[13px] sm:text-sm text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-charcoal/10">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:py-5 flex flex-col items-center gap-1.5">
          <p className="font-sans text-[10px] text-charcoal/20 tracking-wider uppercase">
            Candidasa · Karangasem · Bali
          </p>
          <p className="font-sans text-[11px] sm:text-xs text-charcoal/30 tracking-wide">
            &copy; {new Date().getFullYear()} {contact.hotelName}. {tl.footer.allRightsReserved}.
          </p>
        </div>
      </div>
    </footer>
  );
}
