"use client"; // Uses useLanguage for locale-aware text

import Link from "next/link";
import { FadeIn } from "@/components/common/FadeIn";
import { SectionHeading } from "@/components/common/SectionHeading";
import { useLanguage } from "@/lib/language-context";
import { UtensilsCrossed, ShoppingBag } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function DiningPreview() {
  const { locale } = useLanguage();
  const isRu = locale === "ru";

  const tableUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу забронировать столик в ресторане."
    : "Hello! I'd like to book a table at the restaurant.");
  const roomUrl = buildWhatsAppUrl(isRu
    ? "Здравствуйте! Хочу заказать доставку еды в номер."
    : "Hello! I'd like to order room dining.");

  return (
    <FadeIn>
      <section className="bg-sand py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Heading */}
          <SectionHeading
            label={isRu ? "Ресторан" : "Restaurant & Bar"}
            heading={isRu ? "Ресторан на берегу океана" : "Oceanfront Dining"}
          />

          {/* Two cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-charcoal/10 border border-charcoal/10">

            {/* Book a Table */}
            <div className="p-10 md:p-12 flex flex-col gap-6">
              <UtensilsCrossed size={20} className="text-brand-teal" />
              <div>
                <h3 className="font-serif text-2xl font-light text-charcoal">
                  {isRu ? "Забронировать столик" : "Book a Table"}
                </h3>
                <p className="text-stone text-sm mt-2 leading-relaxed">
                  {isRu
                    ? "Свежие морепродукты и балийская кухня у моря. Открыто ежедневно 07:00–22:00."
                    : "Fresh seafood and Balinese cuisine by the sea. Open daily 07:00–22:00."}
                </p>
              </div>
              <a
                href={tableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-teal hover:text-deep-teal transition-colors duration-200 self-center"
              >
                {isRu ? "Написать в WhatsApp →" : "Message on WhatsApp →"}
              </a>
            </div>

            {/* Room Dining */}
            <div className="p-10 md:p-12 flex flex-col gap-6">
              <ShoppingBag size={20} className="text-brand-teal" />
              <div>
                <h3 className="font-serif text-2xl font-light text-charcoal">
                  {isRu ? "Доставка в номер" : "Room Dining"}
                </h3>
                <p className="text-stone text-sm mt-2 leading-relaxed">
                  {isRu
                    ? "Закажите еду прямо в номер. Онлайн-заказ доступен в любое время."
                    : "Order food directly to your room. Available online at any time."}
                </p>
              </div>
              <a
                href={roomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-teal hover:text-deep-teal transition-colors duration-200 self-center"
              >
                {isRu ? "Заказать онлайн →" : "Order Online →"}
              </a>
            </div>

          </div>

          {/* Link to full dining page */}
          <div className="text-center mt-10">
            <Link
              href="/dining"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-stone hover:text-charcoal transition-colors duration-200"
            >
              {isRu ? "Подробнее о ресторане →" : "View Full Menu & Restaurant →"}
            </Link>
          </div>

        </div>
      </section>
    </FadeIn>
  );
}
