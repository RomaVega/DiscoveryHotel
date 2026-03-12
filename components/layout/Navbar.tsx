"use client"; // Uses useState, scroll listener, IntersectionObserver

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const [sheetOpen, setSheetOpen] = useState(false);

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
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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

  const handleAnchorClick = useCallback(() => {
    setSheetOpen(false);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-deep-teal/85 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-brand-teal text-white px-4 py-2 font-sans text-sm"
      >
        Skip to content
      </a>

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-serif text-xl font-light text-white tracking-wide"
        >
          Orlowsky Discovery
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
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 bg-brand-teal transition-all duration-300",
                    activeSection === link.href.replace("#", "")
                      ? "w-full"
                      : "w-0"
                  )}
                />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#booking"
              className="font-sans text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/80 px-5 py-2 tracking-wide uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-deep-teal"
            >
              Book Now
            </a>
          </li>
        </ul>

        {/* Mobile menu */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            className="md:hidden text-white p-2 focus-visible:ring-2 focus-visible:ring-brand-teal"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-deep-teal border-deep-teal w-72"
          >
            <SheetTitle className="font-serif text-xl font-light text-white tracking-wide">
              Orlowsky Discovery
            </SheetTitle>

            <nav className="mt-8 flex flex-col gap-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleAnchorClick}
                  className={cn(
                    "font-sans text-base font-medium tracking-wide transition-colors duration-200",
                    activeSection === link.href.replace("#", "")
                      ? "text-brand-teal"
                      : "text-white/70 hover:text-white"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#booking"
                onClick={handleAnchorClick}
                className="text-center font-sans text-sm font-semibold text-white bg-brand-teal hover:bg-brand-teal/80 px-5 py-3 tracking-wide uppercase mt-4"
              >
                Book Now
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
