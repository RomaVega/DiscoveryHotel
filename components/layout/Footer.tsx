import { Facebook, Instagram, Youtube, Star } from "lucide-react";
import type { ContactData } from "@/lib/types";

const iconMap: Record<string, React.FC<{ size?: number }>> = {
  Facebook,
  Instagram,
  Youtube,
};

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
    <footer id="contact" className="bg-deep-teal text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Hotel info */}
          <div>
            <h3 className="font-serif text-2xl font-light mb-2">
              {contact.hotelName}
            </h3>
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: contact.stars }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="text-brand-teal" />
              ))}
            </div>
            {contact.address.map((line) => (
              <p key={line} className="text-white/70 text-sm leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-sm font-semibold uppercase tracking-widest mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-white transition-colors duration-200"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
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
                    className="text-white/70 hover:text-white transition-colors duration-200"
                  >
                    <Icon size={20} />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} {contact.hotelName}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
