"use client"; // Uses useState, scroll listener, IntersectionObserver

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { label: "Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Experiences", href: "#experiences" },
  { label: "Offers", href: "#offers" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "bg-parchment shadow-sm opacity-100 translate-y-0"
            : "md:opacity-0 md:-translate-y-3 md:pointer-events-none"
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-brand-teal text-white px-4 py-2 font-sans text-sm"
        >
          Skip to content
        </a>

        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 transition-all duration-500",
              scrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <Image
              src="/images/logo/logo-dark.svg"
              alt="Orlowsky Discovery Hotel"
              width={40}
              height={40}
              unoptimized
              className="object-contain shrink-0"
            />
            <span className="font-serif text-xl font-semibold text-black tracking-wide uppercase">
              Orlowsky Discovery
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "relative font-sans text-sm font-medium tracking-wide transition-colors duration-200",
                    activeSection === link.href.replace("#", "")
                      ? "text-charcoal"
                      : "text-charcoal/60 hover:text-charcoal"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-brand-teal transition-all duration-300",
                      activeSection === link.href.replace("#", "") ? "w-full" : "w-0"
                    )}
                  />
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://secure.guestpro.net/odch"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs font-semibold text-charcoal bg-transparent hover:bg-brand-teal/10 border border-brand-teal rounded-sm px-5 py-2 tracking-wide uppercase transition-all duration-200"
              >
                Book Now
              </a>
            </li>
          </ul>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-3">
            <button
              className={cn(
                "p-2 focus-visible:ring-2 focus-visible:ring-brand-teal transition-all duration-300",
                scrolled ? "text-charcoal opacity-100" : "text-white opacity-30"
              )}
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu — parchment style */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-parchment md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Header row */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-charcoal/10">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/logo/logo-dark.svg"
                  alt="Orlowsky Discovery Hotel"
                  width={36}
                  height={36}
                  unoptimized
                  className="object-contain"
                />
                <span className="font-serif text-lg font-semibold text-black tracking-wide uppercase">
                  Orlowsky Discovery
                </span>
              </div>
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="p-2 text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col flex-1 justify-center items-center px-8 text-center">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  className="w-full"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 + i * 0.05, ease: "easeOut" }}
                >
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "block py-5 font-serif text-2xl font-semibold tracking-wide transition-colors duration-200",
                      activeSection === link.href.replace("#", "")
                        ? "text-black"
                        : "text-charcoal/70 hover:text-black"
                    )}
                  >
                    {link.label}
                  </a>
                  <div className="h-px bg-charcoal/10" />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.45 }}
                className="mt-16"
              >
                <a
                  href="https://secure.guestpro.net/odch"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="inline-block text-charcoal border border-brand-teal rounded-sm font-sans font-semibold text-sm px-8 py-3 tracking-widest uppercase transition-all duration-200 hover:bg-brand-teal/10"
                >
                  Book Now
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
