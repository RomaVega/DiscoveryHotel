import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Stable date reflecting the last meaningful content update. Bump this when
// site content changes — do NOT use new Date(), which marks every page as
// "modified" on every deploy and erodes Google's trust in the lastmod signal.
const LAST_CONTENT_UPDATE = new Date("2026-06-10");

type Route = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

// Every public route. Each gets an EN entry (/path) and a RU entry (/ru/path),
// and both entries carry reciprocal hreflang alternates so Google understands
// the language pairing at the sitemap level (in addition to the <head> tags).
const enRoutes: Route[] = [
  { path: "/",                          priority: 1.0, changeFrequency: "weekly"  },
  { path: "/rooms",                     priority: 0.9, changeFrequency: "monthly" },
  { path: "/dining",                    priority: 0.8, changeFrequency: "monthly" },
  { path: "/spa",                       priority: 0.8, changeFrequency: "monthly" },
  { path: "/experiences",               priority: 0.8, changeFrequency: "monthly" },
  { path: "/experiences/diving",        priority: 0.8, changeFrequency: "monthly" },
  { path: "/experiences/excursions",    priority: 0.7, changeFrequency: "monthly" },
  { path: "/experiences/events",        priority: 0.7, changeFrequency: "monthly" },
  { path: "/experiences/car-rental",    priority: 0.6, changeFrequency: "monthly" },
  { path: "/offers",                    priority: 0.8, changeFrequency: "weekly"  },
  { path: "/gallery",                   priority: 0.7, changeFrequency: "monthly" },
  { path: "/transfer",                  priority: 0.7, changeFrequency: "monthly" },
  { path: "/weddings",                  priority: 0.7, changeFrequency: "monthly" },
  { path: "/location",                  priority: 0.6, changeFrequency: "yearly"  },
  { path: "/about",                     priority: 0.6, changeFrequency: "yearly"  },
  { path: "/contact",                   priority: 0.6, changeFrequency: "yearly"  },
  { path: "/faq",                       priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy",                   priority: 0.2, changeFrequency: "yearly"  },
  { path: "/terms",                     priority: 0.2, changeFrequency: "yearly"  },
];

const enUrl = (path: string) => `${SITE_URL}${path}`;
const ruUrl = (path: string) => `${SITE_URL}/ru${path === "/" ? "" : path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of enRoutes) {
    const languages = {
      en: enUrl(path),
      ru: ruUrl(path),
      "x-default": enUrl(path),
    };

    // English entry
    entries.push({
      url: enUrl(path),
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency,
      priority,
      alternates: { languages },
    });

    // Russian counterpart — slightly lower priority, same hreflang set
    entries.push({
      url: ruUrl(path),
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency,
      priority: path === "/" ? 0.9 : Math.max(0.1, priority - 0.1),
      alternates: { languages },
    });
  }

  return entries;
}
