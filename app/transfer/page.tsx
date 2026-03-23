import { getTransferPageData, getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { PageHero } from "@/components/sections/PageHero";
import { TransferDetail } from "@/components/sections/TransferDetail";

export const metadata = {
  title: "Airport Transfer Bali to Candidasa — Orlowsky Discovery Hotel",
  description: "Private transfer from Ngurah Rai International Airport (DPS) to Candidasa, East Bali. Fixed rates, AC vehicle, English-speaking driver. Available 24/7.",
};

export default function TransferPage() {
  const data = getTransferPageData();
  const contact = getContactData();

  return (
    <InnerPageLayout contact={contact}>
      <PageHero
        image={data.image}
        imageAlt={data.imageAlt}
        heading={data.heading}
        subtext={data.subtext}
      />
      <TransferDetail data={data} />
    </InnerPageLayout>
  );
}
