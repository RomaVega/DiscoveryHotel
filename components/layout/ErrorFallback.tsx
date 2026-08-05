"use client"; // Rendered only on the client, by an error boundary

import { buildWhatsAppUrl, getWhatsAppNumber } from "@/lib/whatsapp";
import type { Locale } from "@/lib/types";

/**
 * Last-resort UI for a client-side crash.
 *
 * Deliberately styled with inline CSS and raw hex instead of Tailwind tokens —
 * the usual "never raw hex in components" rule assumes the stylesheet loaded,
 * and a failed CSS/JS chunk is one of the things this page exists to survive.
 * Same reason there is no next/image, no framer-motion, and no context here:
 * every dependency is one more thing that can be broken at the moment we need
 * to render. Keep it that way.
 */

const COPY = {
  en: {
    eyebrow: "Orlowsky Discovery",
    heading: "This page didn't load properly",
    body: "Something went wrong in your browser while opening the page. Reloading usually fixes it. If it keeps happening, message us directly — we'll help you straight away.",
    reload: "Reload Page",
    whatsapp: "Chat on WhatsApp",
    call: "Call the Hotel",
    email: "Email Us",
    greeting: "Hello! The website didn't load for me — could you help?",
  },
  ru: {
    eyebrow: "Orlowsky Discovery",
    heading: "Страница не загрузилась",
    body: "При открытии страницы в браузере произошла ошибка. Обычно помогает перезагрузка. Если проблема повторяется, напишите нам напрямую — мы сразу поможем.",
    reload: "Перезагрузить Страницу",
    whatsapp: "Написать в WhatsApp",
    call: "Позвонить в отель",
    email: "Написать на почту",
    greeting: "Здравствуйте! У меня не загружается сайт — можете помочь?",
  },
} as const;

const EMAIL = "info@orlowsky.co.id";

/** Display form of the international number: +62 822 3665 5582 */
function formatPhone(raw: string): string {
  const m = /^(\d{2})(\d{3})(\d{4})(\d{4})$/.exec(raw);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]}` : `+${raw}`;
}

export function ErrorFallback({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const number = getWhatsAppNumber();

  return (
    <div className="odh-err">
      {/* Scoped so hover/focus states survive without the Tailwind bundle */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.odh-err{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 24px;background:#f5f0e8;color:#1a1a1a;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
.odh-err__card{width:100%;max-width:560px;text-align:center}
.odh-err__eyebrow{margin:0 0 24px;font-size:11px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:#0abab5}
.odh-err__h1{margin:0 0 20px;font-family:"Cormorant Garamond",Georgia,"Times New Roman",serif;font-weight:300;font-size:38px;line-height:1.2}
.odh-err__p{margin:0 0 40px;font-size:16px;line-height:1.7;color:#1a1a1a}
.odh-err__btn{display:inline-block;border:0;cursor:pointer;background:#4ca8b5;color:#fff;font:600 13px/1 Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase;padding:16px 32px;border-radius:999px;transition:background-color .3s}
.odh-err__btn:hover{background:#2a6b74}
.odh-err__links{margin:40px 0 0;padding:28px 0 0;border-top:1px solid rgba(26,26,26,.1);display:flex;flex-direction:column;gap:14px}
.odh-err__link{color:#2a6b74;font-size:15px;text-decoration:none;border-bottom:1px solid rgba(42,107,116,.3);padding-bottom:2px;align-self:center}
.odh-err__link:hover{color:#0abab5;border-bottom-color:#0abab5}
.odh-err *:focus-visible{outline:2px solid #0abab5;outline-offset:2px}
@media (min-width:640px){.odh-err__h1{font-size:46px}}
`,
        }}
      />

      <div className="odh-err__card">
        <p className="odh-err__eyebrow">{copy.eyebrow}</p>
        <h1 className="odh-err__h1">{copy.heading}</h1>
        <p className="odh-err__p">{copy.body}</p>

        {/* A hard reload, not the boundary's reset(): the crashes this page
            catches (corrupted DOM from a translator or extension, a chunk that
            failed to load) re-throw immediately if we only re-render. */}
        <button
          type="button"
          className="odh-err__btn"
          onClick={() => window.location.reload()}
        >
          {copy.reload}
        </button>

        <div className="odh-err__links">
          <a
            className="odh-err__link"
            href={buildWhatsAppUrl(copy.greeting)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.whatsapp}
          </a>
          <a className="odh-err__link" href={`tel:+${number}`}>
            {copy.call} — {formatPhone(number)}
          </a>
          <a className="odh-err__link" href={`mailto:${EMAIL}`}>
            {copy.email} — {EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}

/** Locale from the URL — context is unavailable on the global-error path. */
export function localeFromPath(): Locale {
  if (typeof window === "undefined") return "en";
  const path = window.location.pathname;
  return path === "/ru" || path.startsWith("/ru/") ? "ru" : "en";
}
