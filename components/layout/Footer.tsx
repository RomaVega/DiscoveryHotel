"use client"; // Uses useLanguage for labels, plus state/effects for the offers form and the link separators

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { LocalizedLink as Link } from "@/components/common/LocalizedLink";
import { TelegramOutlineIcon, WhatsAppOutlineIcon } from "@/components/common/OutlineBrandIcons";
import { BugReport } from "@/components/layout/BugReport";
import type { ContactData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { BOOKING_URL } from "@/lib/booking";
import { trackBookNowClick } from "@/lib/track";
import { cn, fill } from "@/lib/utils";

/*
 * The footer is the last calm room of the hotel, not a second menu. Four bands
 * — brand, stay in touch, explore, follow + legal — stacked and centred on a
 * phone, three columns from `lg`. Icons appear only where they make an action
 * faster to recognise: contact, location, the social row. Page links are words.
 *
 * Contrast on espresso (#2a1f17), measured:
 *   parchment/75  7.62:1  body text, links and icons at rest
 *   parchment/65  6.07:1  section labels
 *   parchment/60  5.41:1  legal line and microcopy — the floor. /50 is 4.18:1
 *   brand-teal    6.66:1  actions at rest (maps, book) and every hover
 * The previous footer set its labels at /50 and the legal line at /30 (2.38:1).
 */

/** One stroke weight for every icon here, so the contact and social marks read as one set. */
const ICON_STROKE = 1.75;

const FOCUS_RING =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-espresso";

const QUIET_LINK = "text-parchment/75 hover:text-brand-teal transition-colors duration-200";

/** Contact rows are phone targets: 44px tall, icon and words in one hit area.
    From lg they drop to the nav links' 36px, so every column shares one rhythm. */
const CONTACT_ROW = "inline-flex min-h-11 items-center gap-2.5 text-sm lg:min-h-9";

/** Guest-likely order. Profiles missing from contact.json simply don't render. */
const SOCIAL_ORDER = ["Instagram", "Facebook", "Youtube", "Telegram"];

type IconProps = { size?: number; strokeWidth?: number; className?: string; "aria-hidden"?: "true" };

const SOCIAL_ICONS: Record<string, React.ComponentType<IconProps>> = {
  Instagram,
  Facebook,
  Youtube,
  // Outline, not the shared filled TelegramIcon — a solid plane in a row of
  // stroked lucide marks is the two-visual-systems problem the brief rules out.
  Telegram: TelegramOutlineIcon,
};

interface FooterProps {
  contact: ContactData;
}

interface NavItem {
  label: string;
  href: string;
}

export function Footer({ contact }: FooterProps) {
  const { locale, tl } = useLanguage();
  const f = tl.footer;
  const isRu = locale === "ru";

  const ruContacts = contact.whatsappContacts.filter((c) => c.locale === "ru");
  const hotelContacts = contact.whatsappContacts.filter((c) => c.locale !== "ru");
  // Captions only earn their place when there are two numbers to tell apart.
  const phoneGroups =
    isRu && ruContacts.length > 0
      ? [
          { caption: f.phoneRu, list: ruContacts },
          { caption: f.phoneHotel, list: hotelContacts },
        ]
      : [{ caption: null, list: hotelContacts }];

  // Same resolution as the floating WhatsAppButton: this locale's line, else the hotel's.
  const waContact =
    contact.whatsappContacts.find((c) => c.locale === locale) ??
    contact.whatsappContacts.find((c) => c.locale === "en");
  const waUrl = `https://wa.me/${waContact?.number ?? contact.whatsapp}?text=${encodeURIComponent(
    waContact?.greeting ?? contact.whatsappGreeting
  )}`;

  const socials = contact.socials
    .filter((s) => Boolean(s.url) && s.icon in SOCIAL_ICONS)
    .sort((a, b) => rank(a.icon) - rank(b.icon));

  const explore: NavItem[] = [
    { label: f.links.rooms,       href: "/rooms" },
    { label: f.links.dining,      href: "/dining" },
    { label: f.links.experiences, href: "/experiences" },
    { label: f.links.offers,      href: "/offers" },
    { label: f.links.gallery,     href: "/gallery" },
    { label: f.links.about,       href: "/about" },
  ];

  // Hotel products only. Car & bike rental and the partner tours live on
  // /experiences; the footer is not the place for every page.
  const grounds: NavItem[] = [
    { label: f.experienceLinks.spa,        href: "/spa" },
    { label: f.experienceLinks.diving,     href: "/experiences/diving" },
    { label: f.experienceLinks.events,     href: "/experiences/events" },
    { label: f.experienceLinks.excursions, href: "/experiences/excursions" },
  ];

  return (
    <footer id="contact" className="bg-espresso font-sans text-parchment/75">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 lg:px-8 lg:pt-24 lg:pb-20">
        {/* DOM order is the phone's reading order: brand, then the practical
            things (call, write, find us), then the rest. From lg the same
            blocks are placed on a four-column grid without reordering the DOM:
              row 1  brand, centred across all four
              row 2  contact | location | explore | on the grounds
              row 3  hairline
              row 4  offers (cols 1–2) | follow us (cols 3–4)
            Every row-2 label sits on one line and every column steps in 36px,
            so the columns read across as well as down. Each track is floored
            at its content's width, so nothing wraps at 1024 (the address needs
            271px, RU "book a room" 187px); spare width is shared by the fr
            weights, Location's larger because the address is the longest line. */}
        <div className="flex flex-col items-center gap-12 text-center lg:grid lg:grid-cols-[minmax(max-content,1fr)_minmax(max-content,1.3fr)_minmax(max-content,1fr)_minmax(max-content,1fr)] lg:items-start lg:gap-x-12 lg:gap-y-14 lg:text-left">
          {/* 1 · Brand */}
          <div className="flex flex-col items-center lg:col-span-4 lg:row-start-1 lg:text-center">
            {/* Logo, stacked name and stars are the pre-rebuild lockup, kept as
                it was. */}
            <div className="flex flex-col items-center">
              <Link
                href="/"
                // The hotel's name is a proper noun; keep translators off it.
                translate="no"
                className={cn(
                  "flex flex-col items-center text-center hover:opacity-80 transition-opacity duration-200",
                  FOCUS_RING
                )}
              >
                <Image
                  src="/images/logo/logo-dark.webp"
                  alt="Orlowsky Discovery Hotel"
                  width={80}
                  height={80}
                  unoptimized
                  className="mb-4 object-contain"
                />
                <span className="flex flex-col items-center font-serif text-xl font-semibold uppercase tracking-[0.15em] text-parchment sm:text-2xl">
                  <span>Orlowsky</span>
                  <span>Discovery Candidasa</span>
                  <span className="mt-3">Hotel</span>
                </span>
              </Link>
              {/* h-6 keeps the 24px line box the ★ glyph used to set. */}
              <div aria-hidden="true" className="mt-4 flex h-6 items-center gap-2.5 text-logo-gold">
                <span className="block h-px w-6 bg-parchment/15 sm:w-8" />
                {Array.from({ length: contact.stars }).map((_, i) => (
                  <StarMark key={i} />
                ))}
                <span className="block h-px w-6 bg-parchment/15 sm:w-8" />
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-balance">{f.tagline}</p>
            <span aria-hidden="true" className="mt-10 block h-px w-16 bg-parchment/15" />
          </div>

          {/* 2a · Contact */}
          <div className="flex flex-col items-center lg:col-start-1 lg:row-start-2 lg:items-start">
            <Label id="footer-contact">{f.contact}</Label>
            <ul aria-labelledby="footer-contact" className="flex flex-col items-center lg:items-start">
              {phoneGroups.map(({ caption, list }) =>
                list.map((c, i) => (
                  <li key={`${caption ?? "hotel"}-${c.number}`} className="flex flex-col items-center lg:items-start">
                    {caption && i === 0 && (
                      <span className="mt-2 text-[11px] uppercase tracking-[0.15em] text-parchment/60">
                        {caption}
                      </span>
                    )}
                    <a href={`tel:+${c.number}`} className={cn(CONTACT_ROW, QUIET_LINK, FOCUS_RING)}>
                      <Phone size={16} strokeWidth={ICON_STROKE} aria-hidden="true" className="shrink-0" />
                      <span className="tabular-nums">{c.label}</span>
                    </a>
                  </li>
                ))
              )}
              <li>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(CONTACT_ROW, QUIET_LINK, FOCUS_RING)}
                >
                  <WhatsAppOutlineIcon size={16} strokeWidth={ICON_STROKE} className="shrink-0" />
                  {f.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className={cn(CONTACT_ROW, QUIET_LINK, FOCUS_RING)}>
                  <Mail size={16} strokeWidth={ICON_STROKE} aria-hidden="true" className="shrink-0" />
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* 2b · Location */}
          <div className="flex flex-col items-center lg:col-start-2 lg:row-start-2 lg:items-start">
            <Label id="footer-location">{f.location}</Label>
            {/* lg:mt-1.5 drops the address's first line onto the same line as
                the first row of the columns beside it, whose 36px rows centre
                their text lower than this paragraph's own leading does. */}
            <div className="flex items-start gap-2.5 lg:mt-1.5">
              <MapPin size={16} strokeWidth={ICON_STROKE} aria-hidden="true" className="mt-0.5 shrink-0" />
              <address className="text-left text-sm not-italic leading-relaxed">
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
              // contrast-ok: brand-teal is 6.66:1 on espresso, parchment on hover 12.53:1.
              className={cn("mt-1 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brand-teal lg:min-h-9 hover:text-parchment transition-colors duration-200", FOCUS_RING)}
            >
              {f.getDirections}
              <span aria-hidden="true">→</span>
            </a>

            {/* Under Location rather than Contact: on a phone it follows the
                address it qualifies, and on desktop it lengthens only the
                column with room to spare. */}
            {isRu && f.paymentNote && (
              <div className="mt-6">
                <Label id="footer-payment">{f.paymentInRussia}</Label>
                {/* contrast-ok: brand-teal is 6.66:1 on espresso. The polarity
                    flips on the dark footer — deep-teal would be 2.64:1 here. */}
                <p className="whitespace-pre-line text-[13px] font-medium leading-relaxed text-brand-teal">
                  {f.paymentNote}
                </p>
              </div>
            )}
          </div>

          {/* Desktop only: closes the link rows off from the offers/follow row. */}
          <span aria-hidden="true" className="hidden h-px bg-parchment/10 lg:col-span-4 lg:row-start-3 lg:block" />

          {/* 2c · Offers */}
          <div className="w-full max-w-sm lg:col-span-2 lg:col-start-1 lg:row-start-4">
            <OffersSignup email={contact.email} />
          </div>

          {/* 3 · Explore + on the grounds — words, no icons. From lg the nav
              spans columns 3–4 as a subgrid, so both lists sit on the parent's
              tracks and size them. gap-x-12 restates the parent's gap, which
              the phone's gap-10 would otherwise override. Explore spans both
              nav rows, so "book" follows On the grounds directly instead of
              waiting for the longer Explore list to end. */}
          <nav
            aria-label={f.navAria}
            className="flex flex-col items-center gap-10 lg:col-span-2 lg:col-start-3 lg:row-start-2 lg:grid lg:grid-cols-subgrid lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-12 lg:gap-y-2"
          >
            <div className="flex flex-col items-center lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:items-start">
              <Label id="footer-explore">{f.explore}</Label>
              <LinkList labelId="footer-explore" items={explore} />
            </div>

            {/* Under Explore on a phone; under On the grounds on desktop. */}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-location="footer"
              // Capture, not bubble: GTM's Link Click must see this push first.
              onClickCapture={() => trackBookNowClick("footer", BOOKING_URL)}
              // contrast-ok: brand-teal is 6.66:1 on espresso, parchment on hover 12.53:1.
              className={cn("-mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold tracking-wide text-brand-teal hover:text-parchment transition-colors duration-200 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:min-h-9 lg:justify-self-start", FOCUS_RING)}
            >
              {f.bookStay}
              <span aria-hidden="true">→</span>
            </a>

            <div className="flex flex-col items-center lg:col-start-2 lg:row-start-1 lg:items-start">
              <Label id="footer-grounds">{f.onTheGrounds}</Label>
              <LinkList labelId="footer-grounds" items={grounds} />
            </div>
          </nav>

          {/* 4a · Follow us */}
          {socials.length > 0 && (
            <div className="flex flex-col items-center lg:col-span-2 lg:col-start-3 lg:row-start-4 lg:items-start">
              <Label id="footer-follow">{f.followUs}</Label>
              {/* Text rows carry air inside their 44px hit area; the circles
                  fill theirs edge to edge, so the label needs a little more. */}
              <ul aria-labelledby="footer-follow" className="mt-2 flex gap-3">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.icon];
                  return (
                    <li key={social.platform}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={fill(f.socialAria, { platform: social.platform })}
                        className="flex size-11 items-center justify-center rounded-full border border-parchment/15 bg-parchment/[0.06] text-parchment/75 transition-[color,border-color] duration-200 hover:border-brand-teal hover:text-brand-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-espresso"
                      >
                        <Icon size={20} strokeWidth={ICON_STROKE} aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 4b · Legal. The id is a scroll sentinel, not styling: the floating
          Book Now and WhatsApp buttons watch it so they get out of the way of
          the privacy and terms links rather than sitting on top of them. */}
      <div id="footer-legal" className="border-t border-parchment/10">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-1 px-6 py-6 text-xs text-parchment/60 lg:px-8">
          {/* Absolute so the legal text stays optically centred in the bar; the
              centred stack carries matching side padding to reserve this gutter. */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 lg:left-8">
            <BugReport />
          </div>
          {/* Stacked on a phone: the Russian pair does not fit one line at
              360–414px, and letting it wrap broke each link mid-phrase with
              the dot left floating between them. */}
          <p className="flex flex-col items-center px-8 sm:flex-row sm:gap-2">
            <Link href="/privacy" className={cn("inline-flex min-h-8 items-center whitespace-nowrap tracking-wide text-parchment/60 hover:text-brand-teal transition-colors duration-200", FOCUS_RING)}>
              {f.privacy}
            </Link>
            <span aria-hidden="true" className="hidden text-parchment/35 sm:inline">·</span>
            <Link href="/terms" className={cn("inline-flex min-h-8 items-center whitespace-nowrap tracking-wide text-parchment/60 hover:text-brand-teal transition-colors duration-200", FOCUS_RING)}>
              {f.terms}
            </Link>
          </p>
          {/* Two unbreakable halves: on a phone the line breaks between them,
              never inside the hotel's name. */}
          <p className="px-8 text-center tracking-wide">
            <span className="whitespace-nowrap">
              &copy; {new Date().getFullYear()} {contact.hotelName}.
            </span>{" "}
            <span className="whitespace-nowrap">{f.allRightsReserved}.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * A drawn star, not the ★ character. Inter has no ★, so each browser falls
 * back to its own symbol font: Chrome and Safari draw it 16px wide, Firefox
 * 10.6px. This is the same sharp five-point shape at Chrome's size.
 */
function StarMark() {
  return (
    <svg viewBox="0.59 1.15 22.82 21.7" width={16} height={15.2} fill="currentColor" className="shrink-0">
      <path d="M12 1.15L14.69 9.44L23.41 9.44L16.36 14.56L19.05 22.85L12 17.73L4.95 22.85L7.64 14.56L0.59 9.44L9.31 9.44Z" />
    </svg>
  );
}

function rank(icon: string): number {
  const i = SOCIAL_ORDER.indexOf(icon);
  return i === -1 ? SOCIAL_ORDER.length : i;
}

/** Orientation, not decoration: small, spaced, uppercase. A <p>, not a heading —
    six h2s in a footer would outshout the page's own outline. */
function Label({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-parchment/65">
      {children}
    </p>
  );
}

/**
 * Text links with a thin separator, wrapping on a phone and stacking from lg.
 *
 * The dots sit in the margin between items, absolutely positioned, so they
 * take no space of their own: a dot that took space could decide whether its
 * item fits on a line, and hiding it would then pull the item back up — it
 * oscillated at 820px. Every item carries equal margin on both sides, so each
 * wrapped line stays centred, but an item that starts a line has only margin
 * to its left and its dot would float there. CSS cannot tell which item
 * wrapped in a centred row, so an effect measures it — an item lower than its
 * predecessor starts a line — and hides that dot. Without JS every dot shows,
 * which is only cosmetic.
 */
function LinkList({ labelId, items }: { labelId: string; items: NavItem[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const signature = items.map((i) => i.label).join("|");

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

    // Toggling an absolutely positioned dot never moves an item, so one
    // measurement pass is final.
    const sync = () => {
      const rows = Array.from(list.children) as HTMLElement[];
      rows.forEach((row, i) => {
        const dot = row.querySelector<HTMLElement>("[data-separator]");
        if (dot) dot.hidden = i === 0 || row.offsetTop > rows[i - 1].offsetTop;
      });
    };

    sync();
    void document.fonts?.ready.then(sync);
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    return () => observer.disconnect();
  }, [signature]);

  return (
    <ul
      ref={ref}
      aria-labelledby={labelId}
      // Inline flow rather than flex on a phone, so `text-wrap: balance` can
      // split six links 3 + 3 instead of 5 + an orphaned "About".
      className="max-w-sm text-balance lg:flex lg:flex-col lg:items-start"
    >
      {items.map((item, i) => (
        <li key={item.href} className="relative mx-2.5 inline-block lg:mx-0 lg:flex">
          {i > 0 && (
            <span
              data-separator
              aria-hidden="true"
              // Centred in the 20px of margin between this item and the last.
              className="pointer-events-none absolute -left-2.5 top-1/2 -translate-x-1/2 -translate-y-1/2 text-parchment/35 lg:hidden"
            >
              ·
            </span>
          )}
          <Link
            href={item.href}
            className={cn("inline-flex min-h-9 items-center whitespace-nowrap text-sm", QUIET_LINK, FOCUS_RING)}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The prefilled request reception receives. Exported for tests: jsdom cannot
 * follow a mailto navigation, so the component test cannot read it back.
 */
export function offersMailto(inbox: string, subject: string, template: string, guestEmail: string): string {
  const body = fill(template, { email: guestEmail });
  return `mailto:${inbox}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The offers list, XDA's subscribe pattern in the hotel's colours.
 *
 * There is no mailing backend: `output: "export"` leaves nothing to POST to,
 * and CSP `form-action` allows only 'self' and GuestPro. So the form hands off
 * to the one channel that does work — reception's inbox — by opening a
 * prefilled email. It never claims the address was saved; the status line says
 * what actually happens next. TODO: point `submit` at a real list endpoint
 * (Netlify Forms, Mailchimp) once one exists, and swap the handoff copy for a
 * true confirmation then.
 *
 * The button stays disabled until hydration: before it, a native submit would
 * GET the current page with `?email=` in the URL, and GTM's page view would
 * carry a guest's address into analytics.
 */
function OffersSignup({ email: inbox }: { email: string }) {
  const { tl } = useLanguage();
  const o = tl.footer.offers;
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<"idle" | "invalid" | "handoff">("idle");

  useEffect(() => setHydrated(true), []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = event.currentTarget.elements.namedItem("email") as HTMLInputElement;
    const value = input.value.trim();
    if (!value || !input.checkValidity()) {
      setStatus("invalid");
      input.focus();
      return;
    }
    setStatus("handoff");
    window.location.href = offersMailto(inbox, o.mailSubject, o.mailBody, value);
  }

  const invalid = status === "invalid";

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby="footer-offers"
      className="flex flex-col items-center text-center lg:items-start lg:text-left"
    >
      <Label id="footer-offers">{o.label}</Label>
      <p className="mb-4 text-sm leading-relaxed">{o.line}</p>

      <div
        className={cn(
          "flex h-11 w-full overflow-hidden rounded-sm border bg-parchment/[0.04] transition-colors duration-200",
          // 3.17:1 against espresso — the 3:1 floor for a field boundary. The
          // fill alone is 1.1:1 and would not mark the field at all.
          invalid ? "border-parchment" : "border-parchment/40",
          "has-[input:focus-visible]:border-brand-teal has-[input:focus-visible]:ring-1 has-[input:focus-visible]:ring-brand-teal"
        )}
      >
        <label htmlFor="footer-offers-email" className="sr-only">
          {o.inputLabel}
        </label>
        <input
          id="footer-offers-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder={o.placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? "footer-offers-error footer-offers-note" : "footer-offers-note"}
          onChange={() => invalid && setStatus("idle")}
          // Email fields are what disposable-mail and autofill extensions
          // decorate before hydration (Temp Mail adds a style and a data-*
          // attribute). Scoped to this element's own attributes only.
          suppressHydrationWarning
          // Placeholder at /60 on the field's fill is 5.03:1.
          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-parchment placeholder:text-parchment/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!hydrated}
          // charcoal on brand-teal is 7.21:1 — the PrimaryButton pairing.
          className="shrink-0 bg-brand-teal px-5 text-sm font-semibold tracking-wide text-charcoal transition-colors duration-200 hover:bg-cta-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-charcoal"
        >
          {o.submit}
        </button>
      </div>

      {invalid && (
        <p id="footer-offers-error" className="mt-2 text-xs font-medium text-parchment">
          {o.invalid}
        </p>
      )}

      <p id="footer-offers-note" className="mt-3 text-xs leading-relaxed text-balance text-parchment/60">
        {o.consent}{" "}
        <Link href="/privacy" className={cn("whitespace-nowrap underline decoration-parchment/30 underline-offset-2 hover:text-brand-teal transition-colors duration-200", FOCUS_RING)}>
          {o.consentLink}
        </Link>
        . {o.unsubscribe}
      </p>

      {/* Always rendered, so screen readers already know the region when it fills. */}
      <p role="status" className="mt-3 text-xs leading-relaxed text-parchment/75 empty:mt-0">
        {status === "handoff" && (
          <>
            {o.handoff} {o.fallback}{" "}
            <a href={`mailto:${inbox}`} className={cn("underline decoration-parchment/30 underline-offset-2", QUIET_LINK, FOCUS_RING)}>
              {inbox}
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
