"use client"; // Uses useLanguage for translated labels and locale-based contact filtering

import Image from "next/image";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import {
  MessageCircle, Mail, MapPin,
  BedDouble, Utensils, Compass, Percent, Camera, Info,
  Map, Waves, CalendarDays, KeyRound, Sparkles, Globe,
  type LucideIcon,
} from "lucide-react";
import type { ContactData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { socialIconMap } from "@/lib/social-icons";

interface FooterProps {
  contact: ContactData;
}

export function Footer({ contact }: FooterProps) {
  const { locale, tl } = useLanguage();

  const isRu = locale === "ru";

  const ruContacts = contact.whatsappContacts.filter((c) => c.locale === "ru");
  const enContacts = contact.whatsappContacts.filter((c) => c.locale === "en");

  const footerLinks: { label: string; href: string; icon: LucideIcon }[] = [
    { label: tl.footer.links.rooms,       href: "/rooms",       icon: BedDouble },
    { label: tl.footer.links.amenities,   href: "/dining",      icon: Utensils },
    { label: tl.footer.links.experiences, href: "/experiences", icon: Compass },
    { label: tl.footer.links.offers,      href: "/offers",      icon: Percent },
    { label: tl.footer.links.gallery,     href: "/gallery",     icon: Camera },
    { label: tl.footer.links.about,       href: "/about",       icon: Info },
  ];

  const experienceLinks: { label: string; href: string; icon: LucideIcon; external?: boolean }[] = [
    { label: tl.footer.experienceLinks.spa,           href: "/spa",                                 icon: Sparkles },
    { label: tl.footer.experienceLinks.diving,        href: "/experiences/diving",                  icon: Waves },
    { label: tl.footer.experienceLinks.events,        href: "/experiences/events",                  icon: CalendarDays },
    { label: tl.footer.experienceLinks.carRental,     href: "/experiences/car-bike-rental",              icon: KeyRound },
    { label: tl.footer.experienceLinks.excursions,    href: "/experiences/excursions",              icon: Map },
    { label: tl.footer.experienceLinks.toursPartner,  href: "https://mybalitrips.com/?utm_pid=1260", icon: Globe, external: true },
  ];

  return (
    <footer id="contact" className="bg-espresso text-parchment">
      <div className="max-w-5xl mx-auto px-6 pt-16 sm:pt-20 pb-10 sm:pb-12">
        {/* Logo + tagline — centered */}
        <div className="flex flex-col items-center mb-10 sm:mb-16">
          <Link
            href="/"
            className="flex flex-col items-center text-center hover:opacity-80 transition-opacity duration-200"
          >
            <Image
              src="/images/logo/logo-dark.webp"
              alt="Orlowsky Discovery Hotel"
              width={80}
              height={80}
              unoptimized
              className="object-contain mb-4"
            />
            <h3 className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.15em] uppercase text-parchment flex flex-col items-center">
              <span>Orlowsky</span>
              <span>Discovery Candidasa</span>
              <span className="mt-3">Hotel</span>
            </h3>
          </Link>
          <div className="flex items-center gap-2.5 mt-4" style={{ color: "#C9A84C" }}>
            <span className="block h-px w-6 sm:w-8 bg-parchment/15" />
            {Array.from({ length: contact.stars }).map((_, i) => (
              <span key={i} className="text-base">
                ★
              </span>
            ))}
            <span className="block h-px w-6 sm:w-8 bg-parchment/15" />
          </div>
        </div>

        {/* Columns */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-x-8">
          {/* Contact */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            {/* Social icons — mobile only (above heading) */}
            <div className="flex justify-center gap-5 mb-6 md:hidden">
              {contact.socials.map((social) => {
                const Icon = socialIconMap[social.icon];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="text-parchment/30 hover:text-parchment transition-colors duration-200"
                  >
                    <Icon size={social.icon === "Youtube" ? 28 : 24} className={social.icon === "Youtube" ? "relative -top-0.5" : ""} />
                  </a>
                ) : null;
              })}
            </div>

            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-parchment/50 mb-4 underline underline-offset-4 decoration-parchment/20">
              {tl.footer.contact}
            </h4>
            <ul className="space-y-3 flex flex-col items-center md:items-start">
              {isRu && ruContacts.length > 0 && (
                <li>
                  <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-parchment/35 mb-1.5">
                    {tl.footer.whatsappRu}
                  </p>
                  <div className="space-y-1.5">
                    {ruContacts.map((c) => (
                      <a
                        key={c.number}
                        href={`https://wa.me/${c.number}?text=${encodeURIComponent(c.greeting)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[13px] sm:text-sm text-parchment/60 hover:text-parchment transition-colors duration-200"
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
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-parchment/35 mb-1.5">
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
                        className="flex items-center gap-2 text-[13px] sm:text-sm text-parchment/60 hover:text-parchment transition-colors duration-200"
                      >
                        <MessageCircle size={14} className="text-brand-teal shrink-0" />
                        {c.label}
                      </a>
                    ))}
                  </div>
                </li>
              )}

              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-[13px] sm:text-sm text-parchment/60 hover:text-parchment transition-colors duration-200"
                >
                  <Mail size={14} className="text-brand-teal shrink-0" />
                  {contact.email}
                </a>
              </li>

            </ul>

            {/* Social icons — desktop only (grouped with contact methods, before payment note) */}
            <div className="hidden md:flex justify-start gap-5 mt-5">
              {contact.socials.map((social) => {
                const Icon = socialIconMap[social.icon];
                return Icon ? (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="text-parchment/30 hover:text-parchment transition-colors duration-200"
                  >
                    <Icon size={social.icon === "Youtube" ? 28 : 24} className={social.icon === "Youtube" ? "relative -top-0.5" : ""} />
                  </a>
                ) : null;
              })}
            </div>

            {/* Russian payment note — desktop only (sits under КОНТАКТЫ) */}
            {isRu && tl.footer.paymentNote && (
              <div className="hidden md:block mt-8">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-parchment/50 mb-1.5 underline underline-offset-4 decoration-parchment/20">
                  {tl.footer.paymentInRussia}
                </p>
                {/* contrast-ok: brand-teal is 6.66:1 on espresso. The polarity
                    flips on the dark footer — deep-teal would be 2.64:1 here. */}
                <p className="font-sans text-[13px] text-brand-teal leading-relaxed font-medium whitespace-pre-line">
                  {tl.footer.paymentNote}
                </p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-parchment/50 mb-4 sm:mb-5 underline underline-offset-4 decoration-parchment/20">
              {tl.footer.location}
            </h4>
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-teal shrink-0 mt-0.5" />
                <address className="not-italic text-[13px] sm:text-sm text-parchment/60 leading-relaxed text-left">
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
                // contrast-ok: brand-teal is 6.66:1 on espresso. Hover goes to
                // parchment (12.53:1) — the old hover:text-deep-teal was
                // 2.64:1 on this ground, so the link failed while hovered.
                className="inline-flex items-center gap-1.5 font-sans text-xs text-brand-teal hover:text-parchment transition-colors duration-200 tracking-wide"
              >
                {tl.footer.getDirections}
                <span aria-hidden="true">→</span>
              </a>

            </div>

            {/* Russian payment note — mobile only (sits under РАСПОЛОЖЕНИЕ) */}
            {isRu && tl.footer.paymentNote && (
              <div className="md:hidden mt-8">
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-parchment/50 mb-1.5 underline underline-offset-4 decoration-parchment/20">
                  {tl.footer.paymentInRussia}
                </p>
                {/* contrast-ok: brand-teal is 6.66:1 on espresso. The polarity
                    flips on the dark footer — deep-teal would be 2.64:1 here. */}
                <p className="font-sans text-[13px] text-brand-teal leading-relaxed font-medium whitespace-pre-line">
                  {tl.footer.paymentNote}
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full border-t border-parchment/10 md:w-px md:border-t-0 md:border-l md:self-stretch" />

          {/* Experiences */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-parchment/50 mb-4 sm:mb-5 underline underline-offset-4 decoration-parchment/20">
              {tl.footer.experiences}
            </h4>
            <ul className="space-y-1.5 flex flex-col items-center md:items-start">
              {experienceLinks.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative inline-flex items-center gap-2 font-sans text-[13px] sm:text-sm text-parchment/60 hover:text-parchment transition-colors duration-200"
                    >
                      <link.icon size={13} className="absolute -left-5 top-1/2 -translate-y-1/2 md:static md:translate-y-0 text-brand-teal shrink-0" strokeWidth={1.5} />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="relative inline-flex items-center gap-2 font-sans text-[13px] sm:text-sm text-parchment/60 hover:text-parchment transition-colors duration-200"
                    >
                      <link.icon size={13} className="absolute -left-5 top-1/2 -translate-y-1/2 md:static md:translate-y-0 text-brand-teal shrink-0" strokeWidth={1.5} />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div className="w-full text-center md:text-left md:flex-1 md:min-w-0">
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-parchment/50 mb-4 sm:mb-5 underline underline-offset-4 decoration-parchment/20">
              {tl.footer.explore}
            </h4>
            <ul className="space-y-1.5 flex flex-col items-center md:items-start">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="relative inline-flex items-center gap-2 font-sans text-[13px] sm:text-sm text-parchment/60 hover:text-parchment transition-colors duration-200"
                  >
                    <link.icon size={13} className="absolute -left-5 top-1/2 -translate-y-1/2 md:static md:translate-y-0 text-brand-teal shrink-0" strokeWidth={1.5} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-parchment/10">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:py-5 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1">
            <Link href="/privacy" className="font-sans text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors duration-200 tracking-wide">
              {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
            </Link>
            <span className="text-parchment/20 text-[10px]">·</span>
            <Link href="/terms" className="font-sans text-[10px] text-parchment/30 hover:text-parchment/60 transition-colors duration-200 tracking-wide">
              {isRu ? "Условия использования" : "Terms of Service"}
            </Link>
          </div>
          <p className="font-sans text-[11px] sm:text-xs text-parchment/30 tracking-wide">
            &copy; {new Date().getFullYear()} {contact.hotelName}. {tl.footer.allRightsReserved}.
          </p>
        </div>
      </div>
    </footer>
  );
}
