import { getSpaPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpaDetail } from "@/components/sections/SpaDetail";
import { SITE_URL, OG_IMAGE } from "@/lib/site";
import { JsonLd, breadcrumbs, service } from "@/lib/jsonld";

export const metadata = {
  title: "Ayurvedic Spa & Balinese Massage — Candidasa, Bali | Orlowsky Discovery",
  description: "Authentic Panchakarma, Shirodhara, and traditional Balinese massage by Kerala-trained therapists. Open daily 09:00–21:00 at Orlowsky Discovery Hotel, Candidasa.",
  alternates: {
    canonical: `${SITE_URL}/spa`,
    languages: {
      "en": `${SITE_URL}/spa`,
      "ru": `${SITE_URL}/ru/spa`,
      "x-default": `${SITE_URL}/spa`,
    },
  },
  openGraph: {
    title: "Ayurvedic Spa & Balinese Massage — Candidasa, Bali | Orlowsky Discovery",
    description: "Authentic Panchakarma, Shirodhara, and traditional Balinese massage by Kerala-trained therapists. Open daily 09:00–21:00 at Orlowsky Discovery Hotel, Candidasa.",
    url: `${SITE_URL}/spa`,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
};

export default function SpaPage() {
  const data = getSpaPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <JsonLd data={[
        service({
          path: "/spa",
          name: "Ayurvedic Spa & Balinese Massage — Orlowsky Discovery",
          description: "Authentic Panchakarma, Shirodhara, and traditional Balinese massage by Kerala-trained therapists, open daily 09:00–21:00.",
          image: OG_IMAGE,
          serviceType: "Spa",
          category: "Health & Beauty",
          locale: "en",
        }),
        breadcrumbs([
          { name: "Home", path: "/" },
          { name: "Spa", path: "/spa" },
        ]),
      ]} />
      <PageHero
        image={data.image}
        imageAlt={data.imageAlt}
        heading={data.heading}
        subtext={data.subtext}
        noOverlay
      />
      <SpaDetail data={data} />
    </InnerPageLayout>
  );
}
