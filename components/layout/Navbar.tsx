"use client"; // Uses useState, scroll listener, usePathname

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, BedDouble, Sparkles, Compass, Tag, Camera, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { LanguageSelector } from "@/components/layout/LanguageSelector";

interface NavbarProps {
  alwaysVisible?: boolean;
  scrollThreshold?: number; // pixels from top before navbar appears, default 80
}

/** Shared brand logo + text — used in both navbar and drawer so they match exactly */
function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/images/logo/logo-dark.svg"
        alt="Orlowsky Discovery Hotel"
        width={44}
        height={44}
        unoptimized
        className="object-contain shrink-0"
      />
      <span className="font-serif font-semibold text-black tracking-wide uppercase leading-tight text-base">
        Orlowsky{" "}<span className="whitespace-nowrap">Discovery Candidasa</span>
      </span>
    </Link>
  );
}

export function Navbar({ alwaysVisible = false, scrollThreshold = 80 }: NavbarProps) {
  const [scrolled, setScrolled] = useState(alwaysVisible);
  const [menuOpen, setMenuOpen] = useState(false);
  const { tl } = useLanguage();
  const pathname = usePathname();

  const links = [
    { label: tl.nav.rooms, href: "/rooms", icon: BedDouble },
    { label: tl.nav.amenities, href: "/dining", icon: Sparkles },
    { label: tl.nav.experiences, href: "/experiences", icon: Compass },
    { label: tl.nav.offers, href: "/offers", icon: Tag },
    { label: tl.nav.gallery, href: "/gallery", icon: Camera },
    { label: tl.nav.about, href: "/about", icon: Info },
  ];

  useEffect(() => {
    if (alwaysVisible) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysVisible, scrollThreshold]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "bg-parchment shadow-sm opacity-100 translate-y-0"
            : "lg:opacity-0 lg:-translate-y-3 lg:pointer-events-none pointer-events-auto"
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-brand-teal text-white px-4 py-2 font-sans text-sm"
        >
          {tl.nav.skipToContent}
        </a>

        <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 lg:px-6 py-3">
          {/* Logo */}
          <div
            className={cn(
              "transition-all duration-500",
              scrolled
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <BrandLogo />
          </div>

          {/* Desktop navigation */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative whitespace-nowrap font-sans text-[13px] xl:text-sm font-medium tracking-wide transition-colors duration-200",
                    isActive(link.href)
                      ? "text-charcoal"
                      : "text-charcoal/60 hover:text-charcoal"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-brand-teal transition-all duration-300",
                      isActive(link.href) ? "w-full" : "w-0"
                    )}
                  />
                </Link>
              </li>
            ))}

            <li className="h-4 w-px bg-charcoal/20" aria-hidden="true" />

            <li>
              <LanguageSelector variant="dark" />
            </li>

            <li>
              <a
                href="https://secure.guestpro.net/odch"
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap shrink-0 font-sans text-xs font-semibold text-charcoal bg-transparent hover:bg-brand-teal/10 border border-brand-teal rounded-full px-5 py-2 tracking-wide transition-all duration-200"
              >
                {tl.nav.bookNow}
              </a>
            </li>
          </ul>

          {/* Mobile right side — hamburger only */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              className={cn(
                "p-2 -mr-2 focus-visible:ring-2 focus-visible:ring-brand-teal transition-all duration-300",
                scrolled
                  ? "text-charcoal opacity-100"
                  : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] opacity-40"
              )}
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-parchment lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Header row — identical to navbar */}
            <div className="flex items-center justify-between px-8 py-3 border-b border-charcoal/10 shrink-0">
              <BrandLogo />
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="p-2 -mr-2 text-charcoal/60 hover:text-charcoal transition-colors shrink-0"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links — centered in full remaining space */}
            <nav className="flex-1 flex flex-col justify-center px-8 text-center">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  className="w-full"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.08 + i * 0.05,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center justify-center gap-3 py-4 font-serif text-2xl font-semibold tracking-wide transition-colors duration-200",
                      isActive(link.href) ? "text-black" : "text-charcoal/70 hover:text-black"
                    )}
                  >
                    <link.icon size={20} strokeWidth={1.5} className="text-brand-teal shrink-0" />
                    {link.label}
                  </Link>
                  <div className="h-px bg-charcoal/10" />
                </motion.div>
              ))}
            </nav>

            {/* Bottom actions — pinned to bottom */}
            <div className="shrink-0 flex flex-col items-center gap-5 px-8 pb-8 pt-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.45 }}
              >
                <a
                  href="https://secure.guestpro.net/odch"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="text-charcoal border border-brand-teal rounded-full font-sans font-semibold text-sm px-8 py-3 tracking-widest transition-all duration-200 hover:bg-brand-teal/10 hover:scale-[1.04] active:scale-[0.97]"
                >
                  {tl.nav.bookNow}
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.55 }}
                className="mt-3"
              >
                <LanguageSelector variant="dark" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
