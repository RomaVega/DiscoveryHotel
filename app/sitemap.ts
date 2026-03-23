import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

type Route = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

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

// Russian versions — same pages under /ru/ prefix (for Google RU indexing)
const ruPaths = [
  "/", "/rooms", "/dining", "/spa",
  "/experiences", "/experiences/diving", "/experiences/excursions",
  "/experiences/events", "/experiences/car-rental",
  "/offers", "/gallery", "/transfer", "/weddings",
  "/location", "/about", "/contact", "/faq",
];

const ruRoutes: Route[] = ruPaths.map((path) => ({
  path: `/ru${path === "/" ? "" : path}`,
  priority: path === "/" ? 0.9 : (enRoutes.find((r) => r.path === path)?.priority ?? 0.5) - 0.1,
  changeFrequency: enRoutes.find((r) => r.path === path)?.changeFrequency ?? "monthly",
}));

const routes = [...enRoutes, ...ruRoutes];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
