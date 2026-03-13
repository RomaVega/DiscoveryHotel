import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Star,
  MessageCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { ContactData } from "@/lib/types";

const iconMap: Record<string, React.FC<{ size?: number }>> = {
  Facebook,
  Instagram,
  Youtube,
};

const experienceLinks = [
  { label: "Sightseeing Tours", href: "/excursions" },
  { label: "Ubud Attractions", href: "/excursions" },
  { label: "Diving", href: "/diving" },
  { label: "Trekking", href: "/excursions" },
  { label: "Volcano Tour", href: "/excursions" },
];

const footerLinks = [
  { label: "Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Experiences", href: "#experiences" },
  { label: "Offers", href: "#offers" },
  { label: "Gallery", href: "#gallery" },
];

interface FooterProps {
  contact: ContactData;
}

export function Footer({ contact }: FooterProps) {
  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappGreeting)}`;

  return (
    <footer id="contact" className="bg-parchment text-charcoal">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Desktop: 4 columns — Mobile: hotel info full-width, then 2-col links, then contact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-8 md:gap-10">
          {/* Hotel info — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex flex-col items-center text-center mb-2 hover:opacity-80 transition-opacity duration-200">
              <Image
                src="/images/logo/logo-dark.svg"
                alt="Orlowsky Discovery Hotel"
                width={64}
                height={64}
                unoptimized
                className="object-contain mb-3"
              />
              <h3 className="font-serif text-xl font-semibold tracking-wide uppercase text-black">
                <span className="block">Orlowsky</span>
                <span className="block">Discovery Candidasa</span>
                <span className="block">Hotel</span>
              </h3>
            </Link>
            <div className="flex gap-0.5 mb-4 justify-center">
              {Array.from({ length: contact.stars }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="text-[#e8c05a]" />
              ))}
            </div>
          </div>

          {/* Quick links — left column on mobile */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest mb-4">
              Explore
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
              Experiences
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
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-charcoal/60">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-charcoal transition-colors duration-200"
                >
                  <MessageCircle size={16} className="text-brand-teal shrink-0" />
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
                  Get Directions
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
          &copy; {new Date().getFullYear()} {contact.hotelName}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
