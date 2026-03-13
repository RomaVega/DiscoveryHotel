"use client"; // Uses useLanguage for translated labels

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
import { Separator } from "@/components/ui/separator";
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
  const { tl } = useLanguage();
  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappGreeting)}`;

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
    <footer id="contact" className="bg-parchment text-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Desktop: 4 columns — Mobile: hotel info full-width, then 2-col links, then contact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-8 md:gap-10">
          {/* Hotel info — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex flex-col items-center text-center mb-2 hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Orlowsky Discovery Hotel"
                width={64}
                height={64}
                unoptimized
                className="object-contain mb-3"
              />
              <h3 className="font-serif text-xl font-light tracking-wide uppercase text-charcoal">
                <span className="block">Orlowsky</span>
                <span className="block">Discovery Candidasa</span>
                <span className="block">Hotel</span>
              </h3>
            </Link>
            <div className="flex items-center gap-2 mb-4 justify-center text-charcoal/30">
              <span className="block h-px w-4 bg-charcoal/20" />
              {Array.from({ length: contact.stars }).map((_, i) => (
                <span key={i} className="text-[9px]">
                  ✦
                </span>
              ))}
              <span className="block h-px w-4 bg-charcoal/20" />
            </div>
          </div>

          {/* Quick links — left column on mobile */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest mb-4">
              {tl.footer.explore}
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-charcoal/60 hover:text-charcoal text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences — right column on mobile */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest mb-4">
              {tl.footer.experiences}
            </h4>
            <ul className="space-y-2">
              {experienceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-charcoal/60 hover:text-charcoal text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest mb-4">
              {tl.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm text-charcoal/60">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-charcoal transition-colors duration-200"
                >
                  <MessageCircle
                    size={16}
                    className="text-brand-teal shrink-0"
                  />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 hover:text-charcoal transition-colors duration-200"
                >
                  <Mail size={16} className="text-brand-teal shrink-0" />
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-charcoal transition-colors duration-200"
                >
                  <MapPin size={16} className="text-brand-teal shrink-0" />
                  {tl.footer.getDirections}
                </a>
              </li>
            </ul>

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
                    className="text-charcoal/60 hover:text-charcoal transition-colors duration-200"
                  >
                    <Icon size={20} />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>

        <Separator className="mt-12 mb-8 bg-charcoal/15" />

        <div className="text-center text-sm text-charcoal/40">
          &copy; {new Date().getFullYear()} {contact.hotelName}.{" "}
          {tl.footer.allRightsReserved}.
        </div>
      </div>
    </footer>
  );
}
