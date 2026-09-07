"use client"; // Dialog state, and reads location/viewport to compose the report

import { useState, useCallback } from "react";
import { Bug, X, Mail } from "lucide-react";
import {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import { PRIMARY_BUTTON_BASE } from "@/components/common/PrimaryButton";
import { cn } from "@/lib/utils";

/**
 * The site maintainer's address — deliberately NOT in content/contact.json.
 * `contact` is passed as a prop to the client Footer, so React serialises the
 * whole object into every page's RSC payload, where a plain-text address is
 * harvestable from all 39 pages at once. Held here it reaches only the JS
 * chunk. This is a speed bump, not protection: the real fix is a forwarding
 * alias that can be rotated without losing an inbox.
 */
const MAINTAINER_EMAIL = "admin.orlowsky@gmail.com";

/**
 * Footer bug reporter: a quiet icon that opens a note from the maintainer and
 * hands the visitor a pre-composed email.
 *
 * Why mailto and not a form: the site is `output: "export"` with no backend, so
 * there is nothing to POST to. The cost of mailto is that the visitor still has
 * to press send in their own client; the fix for that is to leave them nothing
 * to type but the complaint itself. The page URL, viewport and user agent are
 * the three things that make a report reproducible and the three a visitor is
 * least likely to supply, so they are filled in on open.
 */
export function BugReport() {
  const { tl } = useLanguage();
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState(`mailto:${MAINTAINER_EMAIL}`);

  const s = tl.footer.bugReport;

  // Composed when the dialog opens rather than at render: on a static page the
  // markup is shared by every visitor, so there is no location to read at build
  // time — and a stale href would report whichever page was prerendered first.
  const onOpenChange = useCallback(
    (next: boolean) => {
      if (next) {
        const context = [
          `Page: ${window.location.href}`,
          `Screen: ${window.innerWidth}×${window.innerHeight}`,
          `Browser: ${navigator.userAgent}`,
        ].join("\n");
        const subject = `${s.subject} — ${window.location.pathname}`;
        const body = `${s.prompt}\n\n\n\n---\n${context}`;
        setHref(
          `mailto:${MAINTAINER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        );
      }
      setOpen(next);
    },
    [s.subject, s.prompt]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        aria-label={s.aria}
        title={s.aria}
        // contrast-ok: brand-teal is 6.66:1 on espresso. The polarity flips on
        // the dark footer, so the accent that fails on light grounds is the one
        // that carries here — and at parchment/40 (3.17:1) this sat on the 3:1
        // floor for a control, which is another way of saying nobody found it.
        // Hover goes to parchment, matching the footer's other teal controls.
        className="p-2 -m-2 text-brand-teal hover:text-parchment transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-espresso rounded-full"
      >
        <Bug size={15} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogBackdrop className="bg-black/60" />
          <DialogPopup className="items-center justify-center p-6">
            <div className="relative w-full max-w-md bg-ivory rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.18)] p-6 sm:p-8">
              <DialogClose
                aria-label={s.close}
                className="absolute top-3 right-3 p-1.5 rounded-full text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
              >
                <X size={18} aria-hidden="true" />
              </DialogClose>

              <div className="flex items-start gap-3 pr-6">
                <Bug
                  size={20}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="shrink-0 mt-1 text-brand-teal"
                />
                <div>
                  <DialogTitle className="font-serif font-medium text-2xl sm:text-3xl text-charcoal leading-snug">
                    {s.title}
                  </DialogTitle>
                  <p className="mt-3 font-sans text-sm text-charcoal/80 leading-relaxed">
                    {s.message}
                  </p>
                </div>
              </div>

              <a
                href={href}
                className={cn(PRIMARY_BUTTON_BASE, "mt-6 w-full inline-flex items-center justify-center gap-2 focus-visible:outline-none")}
                onClick={() => setOpen(false)}
              >
                <Mail size={16} strokeWidth={2} aria-hidden="true" />
                {s.cta}
              </a>

              <p className="mt-3 font-sans text-xs text-stone leading-relaxed text-center">
                {s.included}
              </p>
            </div>
          </DialogPopup>
        </DialogPortal>
      </Dialog>
    </>
  );
}
