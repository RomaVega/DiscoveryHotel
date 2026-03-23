import { getSpaPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { SpaDetail } from "@/components/sections/SpaDetail";

export const metadata = {
  title: "Ayurvedic Spa & Balinese Massage — Candidasa, Bali | Orlowsky Discovery",
  description: "Authentic Panchakarma, Shirodhara, and traditional Balinese massage by Kerala-trained therapists. Open daily 09:00–21:00 at Orlowsky Discovery Hotel, Candidasa.",
};

export default function SpaPage() {
  const data = getSpaPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image={data.image}
        imageAlt={data.imageAlt}
        heading={data.heading}
        subtext={data.subtext}
      />
      <SpaDetail data={data} />
    </InnerPageLayout>
  );
}
