"use client"; // Uses useLanguage for content translation

import Image from "next/image";
import { FadeIn } from "@/components/common/FadeIn";
import { SecondaryButton } from "@/components/common/SecondaryButton";
import { StatsStrip } from "@/components/common/StatsStrip";
import type { ContactData, DiningPageData } from "@/lib/types";
import { useLanguage } from "@/lib/language-context";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// Atmospheric hotel images cycled across feature sections
const FEATURE_IMAGES = [
  "/images/dining/seaside-dining.webp",
  "/images/dining/international-cuisine.webp",
  "/images/restaurant-bar/orlowsky-hotel-fresh-seafood-appetizer-candidasa.webp",
  "/images/dining/bar-drinks-and-cocktails.webp",
  "/images/dining/room-service.webp",
  "/images/dining/chef-specials.webp",
  "/images/dining/cultural-performance.webp",
  "/images/dining/celebration-menu.webp",
];

interface DiningDetailProps {
  data: DiningPageData;
  contact: ContactData;
}

export function DiningDetail({ data, contact }: DiningDetailProps) {
  const { t, locale } = useLanguage();
  const isRu = locale === "ru";

  const tableUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу забронировать столик в ресторане."
    : "Hello! I'd like to book a table at the restaurant.");
  // Opens the conversation as a non-guest, which is the barrier the closing CTA removes.
  const visitUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Я не проживаю в отеле — хочу поужинать у вас в ресторане."
    : "Hello! I'm not staying at the hotel — I'd like to eat at your restaurant.");
  // Menu browsing, room service, and delivery orders all go through one GuestPro page.
  const menuUrl = "https://secure.guestpro.net/odch/concierge/room-dining";
  // Performance nights rotate, so the schedule can't be hardcoded here — ask instead.
  const showsUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Подскажите, когда ближайшее выступление балийских танцоров?"
    : "Hello! When is the next Balinese dance performance?");
  // Catering is quoted per event, so it needs a conversation rather than a booking form.
  const cateringUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу обсудить кейтеринг и меню для мероприятия."
    : "Hello! I'd like to discuss catering and a custom menu for an event.");

  /* Only the features a guest can act on carry a button — keyed by their index in
     dining.json, so reordering the features there means revisiting these keys. */
  const featureCtas: Record<number, { href: string; label: string }> = {
    5: { href: menuUrl,      label: isRu ? "Заказать Доставку"    : "Order Delivery" },
    6: { href: showsUrl,     label: isRu ? "Узнать Расписание"    : "Get Schedule" },
    7: { href: cateringUrl,  label: isRu ? "Обсудить Мероприятие" : "Plan Your Event" },
  };

  return (
    <div>
      {/* ── Stats strip ── */}
      <StatsStrip items={[
        { label: t({ en: "Hours", ru: "Часы работы" }), value: data.hours },
        { label: t({ en: "Capacity", ru: "Вместимость" }), value: data.capacity },
        { label: t({ en: "Location", ru: "Расположение" }), value: "Candidasa, Bali" },
      ]} />

      {/* ── CTAs ── */}
      <FadeIn>
        <div className="bg-ivory py-20 px-6 text-center border-t border-charcoal/8">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-stone mb-6">
            {isRu ? "Ресторан" : "Dining"}
          </p>
          <h2 className="font-serif font-light text-3xl md:text-4xl text-charcoal mb-3">
            {isRu ? "Как Вы Хотите Отужинать?" : "How Would You Like to Dine?"}
          </h2>
          <p className="text-stone text-sm leading-relaxed mb-8 max-w-md mx-auto">
            {isRu
              ? "Откройте полное меню — в ресторане, в номер или бесплатной доставкой по Чандидасе."
              : "Explore the full menu — dine in, room service, or free delivery within Candidasa."}
          </p>
          {/* Menu is the primary action — it covers dining in, room service and delivery.
              Reserving stays available underneath as a quiet link: the restaurant is never
              at capacity, so it is a convenience for guests who want one, not a CTA to
              push. That is also why the closing CTA does not repeat it. */}
          <div className="flex flex-col items-center gap-4">
            <SecondaryButton href={menuUrl} external>
              {isRu ? "Смотреть Меню" : "View Menu"}
            </SecondaryButton>
            <a
              href={tableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs font-medium text-deep-teal underline underline-offset-4 decoration-deep-teal/40 hover:decoration-deep-teal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 rounded-sm transition-colors"
            >
              {isRu ? "Забронировать Столик" : "Book a Table"}
            </a>
          </div>
        </div>
      </FadeIn>

      {/* ── Alternating image + text features (Option 1) ── */}
      <div>
        <div className="space-y-0">
          {data.features.map((feature, i) => {
            const bg = i % 2 === 0 ? "bg-sand" : "bg-ivory";
            return (
              <FadeIn key={i}>
                <div className={`${bg} flex flex-col lg:flex-row items-stretch ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Image */}
                  <div className="relative aspect-[4/3] lg:w-1/2 lg:aspect-auto lg:min-h-[420px] overflow-hidden">
                    <Image
                      src={FEATURE_IMAGES[i % FEATURE_IMAGES.length]}
                      alt={t(feature.title)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {/* Text */}
                  <div className="lg:w-1/2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-14">
                    <h3 className="font-serif text-3xl md:text-4xl font-light text-charcoal leading-tight">
                      {t(feature.title)}
                    </h3>
                    <div className="w-8 h-px bg-brand-teal my-7" />
                    <p className="text-stone leading-relaxed text-[15px]">
                      {t(feature.description)}
                    </p>
                    {featureCtas[i] && (
                      <div className="mt-8 flex justify-center">
                        <SecondaryButton href={featureCtas[i].href} external>
                          {featureCtas[i].label}
                        </SecondaryButton>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* ── Menu highlights — printed menu typography (Option 2) ── */}
      {data.menuHighlights && data.menuHighlights.length > 0 && (
        <FadeIn>
          <div className="bg-ivory py-16 md:py-20 px-6 border-t border-charcoal/8">
            {/* Section title */}
            <div className="flex items-center justify-center gap-6 mb-16">
              <span className="flex-1 max-w-[120px] h-px bg-charcoal/15" />
              <h2 className="font-serif text-sm tracking-[0.35em] uppercase text-stone">
                {isRu ? "Меню" : "Menu"}
              </h2>
              <span className="flex-1 max-w-[120px] h-px bg-charcoal/15" />
            </div>

            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
              {data.menuHighlights.map((section, i) => (
                <div key={i}>
                  <h3 className="font-serif text-xs tracking-[0.3em] uppercase text-charcoal/50 mb-4 pb-3 border-b border-charcoal/10">
                    {t(section.title)}
                  </h3>
                  <ul className="space-y-2.5">
                    {section.items.map((item, j) => (
                      <li key={j} className="font-serif text-[15px] text-charcoal/80 leading-snug">
                        {t(item)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      )}

      {/* ── Closing CTA ──
          Not a reservation prompt: the restaurant is never at capacity, so asking
          people to secure a table invents a scarcity they can feel isn't real. The
          barrier that actually costs covers is the assumption that the restaurant is
          for hotel guests only, so this says otherwise and ends the page on it. */}
      <section className="py-16 md:py-24 bg-cta-teal">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-serif text-2xl md:text-4xl font-light text-white">
              {t(data.visitCta.heading)}
            </h2>
            <p className="mt-4 text-white/80 text-base md:text-lg leading-relaxed">
              {t(data.visitCta.subtext)}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4">
              <SecondaryButton
                href={visitUrl}
                external
                className="border-white text-white hover:bg-white/10 hover:border-white/80"
              >
                {t(data.visitCta.button)}
              </SecondaryButton>
              {/* Walking in is the point, so give them the way here — to the restaurant's own
                  Maps listing rather than the hotel's, since a walk-in is looking for the
                  restaurant. Falls back to the hotel pin if dining.json has no listing. */}
              <a
                href={data.googleMapsUrl ?? contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs font-medium text-white/70 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cta-teal rounded-sm transition-colors"
              >
                {isRu ? "Как Нас Найти" : "See Location"}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
