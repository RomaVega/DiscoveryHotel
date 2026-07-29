"use client"; // Uses useState, scroll listener, usePathname

import { useState, useEffect, useCallback, useRef } from "react";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, BedDouble, Utensils, Compass, Percent, Camera, Info } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { SecondaryButton } from "@/components/common/SecondaryButton";

interface NavbarProps {
  alwaysVisible?: boolean;
  scrollThreshold?: number; // pixels from top before navbar appears, default 80
  /** Hold the logo/brand text back until the hero has scrolled fully out of
      view — for pages whose hero already carries the full brand block, so the
      bar doesn't duplicate it while both are on screen. */
  brandAfterHero?: boolean;
}

/** Shared brand text */
function BrandText({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="font-serif font-semibold text-black tracking-widest uppercase leading-tight text-[17px] text-center">
      <span className="block">Orlowsky</span>
      <span className="block">Discovery Candidasa</span>
    </Link>
  );
}

/** Shared brand logo — absolute left on mobile, inline on desktop */
function BrandLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="absolute left-8 top-1/2 -translate-y-1/2 lg:static lg:translate-y-0">
      <Image
        src="/images/logo/logo-dark.webp"
        alt="Orlowsky Discovery Hotel"
        width={44}
        height={44}
        className="object-contain shrink-0"
      />
    </Link>
  );
}

export function Navbar({ alwaysVisible = false, scrollThreshold = 80, brandAfterHero = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(alwaysVisible);
  const [heroPassed, setHeroPassed] = useState(!brandAfterHero);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const { tl } = useLanguage();
  const pathname = usePathname();

  const links = [
    { label: tl.nav.rooms, href: "/rooms", icon: BedDouble },
    { label: tl.nav.amenities, href: "/dining", icon: Utensils },
    { label: tl.nav.experiences, href: "/experiences", icon: Compass },
    { label: tl.nav.offers, href: "/offers", icon: Percent },
    { label: tl.nav.gallery, href: "/gallery", icon: Camera },
    { label: tl.nav.about, href: "/about", icon: Info },
  ];

  useEffect(() => {
    if (alwaysVisible) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > scrollThreshold);
    onScroll(); // sync initial state — on reload the page may already be scrolled past the threshold
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysVisible, scrollThreshold]);

  // The hero hides its own brand block (logo + title) as soon as it stops covering the
  // viewport — see `atTop` in HeroImage. Mirror that exact geometry test so the bar's brand
  // takes over at that same instant. Waiting for the hero to leave the viewport entirely
  // (the old IntersectionObserver) left a scrolled bar with neither brand for a whole
  // screen of scrolling on mobile, where the hero is a full-height video.
  useEffect(() => {
    if (!brandAfterHero) { setHeroPassed(true); return; }
    const hero = document.querySelector("#main-content > section");
    if (!hero) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      setHeroPassed(hero.getBoundingClientRect().bottom < window.innerHeight - 2);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update(); // sync initial state on reload (e.g. restored scroll position)

    document.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("scroll", schedule, { capture: true });
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [brandAfterHero]);

  // Scroll-locked footer push: every scroll tick writes an instant transform so the footer
  // pixel-locks the navbar. The slide-down entrance is a CSS keyframe animation applied via
  // className when `scrolled` is true — animations override inline transform during their run,
  // so the push and the entrance don't race for the same property.
  useEffect(() => {
    const footer = document.querySelector("footer");
    const header = headerRef.current;
    if (!footer || !header) return;
    let rafId = 0;
    const update = () => {
      const navH = header.offsetHeight || 64;
      const footerTop = footer.getBoundingClientRect().top;
      const push = Math.max(0, Math.min(navH, navH - footerTop));
      header.style.transform = `translateY(-${push}px)`;
    };
    const onScroll = () => { rafId = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // sync on mount in case page loads near footer
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarW}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleBrandClick = useCallback(() => {
    closeMenu();
    if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [closeMenu, pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-[background-color,opacity,box-shadow] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "bg-parchment shadow-sm opacity-100"
            : "lg:opacity-0 lg:pointer-events-none pointer-events-auto"
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-brand-teal text-white px-4 py-2 font-sans text-sm"
        >
          {tl.nav.skipToContent}
        </a>

        <nav className="relative max-w-7xl mx-auto flex items-center justify-center lg:justify-between px-8 lg:px-6 py-3">
          {/* Logo — absolute on mobile, static on desktop, fades independently */}
          <div className={cn(
            "transition-opacity duration-500 lg:hidden",
            scrolled && heroPassed ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <BrandLogo onClick={handleBrandClick} />
          </div>
          {/* Brand text + logo on desktop */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-2 transition-all duration-500",
              scrolled && heroPassed
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <BrandLogo onClick={handleBrandClick} />
            <BrandText onClick={handleBrandClick} />
          </div>
          {/* Brand text mobile — fades with slide */}
          <div
            className={cn(
              "lg:hidden transition-all duration-500",
              scrolled && heroPassed
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2 pointer-events-none"
            )}
          >
            <BrandText onClick={handleBrandClick} />
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
              <SecondaryButton href="https://secure.guestpro.net/odch" external className="whitespace-nowrap shrink-0">
                {tl.nav.bookNow}
              </SecondaryButton>
            </li>
          </ul>

          {/* Mobile right side — hamburger absolute so brand stays centered */}
          <div className="lg:hidden absolute right-8 top-1/2 -translate-y-1/2">
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
          <m.div
            className="fixed inset-0 z-[60] flex flex-col bg-parchment lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Header row — identical to navbar */}
            <div className="relative flex items-center justify-center px-8 py-3 border-b border-charcoal/10 shrink-0">
              <BrandLogo onClick={handleBrandClick} />
              <BrandText onClick={handleBrandClick} />
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="absolute right-8 top-1/2 -translate-y-1/2 p-2 -mr-2 text-charcoal/60 hover:text-charcoal transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav links — centered in full remaining space */}
            <nav className="flex-1 flex flex-col justify-center px-8 text-center">
              {links.map((link, i) => (
                <m.div
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
                      "flex items-center justify-center py-4 font-serif text-2xl font-semibold tracking-wide transition-colors duration-200",
                      isActive(link.href) ? "text-black" : "text-charcoal/70 hover:text-black"
                    )}
                  >
                    <span className="relative inline-flex items-center">
                      <link.icon size={20} strokeWidth={1.5} className="text-brand-teal shrink-0 absolute -left-7 top-1/2 -translate-y-1/2" />
                      {link.label}
                    </span>
                  </Link>
                  <div className="h-px bg-charcoal/10" />
                </m.div>
              ))}
            </nav>

            {/* Bottom actions — pinned to bottom */}
            <div className="shrink-0 flex flex-col items-center gap-5 px-8 pb-8 pt-4">
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.45 }}
              >
                <SecondaryButton
                  href="https://secure.guestpro.net/odch"
                  external
                  className="px-8 py-3 text-sm tracking-widest"
                >
                  {tl.nav.bookNow}
                </SecondaryButton>
              </m.div>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.55 }}
                className="mt-3"
              >
                <LanguageSelector variant="dark" />
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
