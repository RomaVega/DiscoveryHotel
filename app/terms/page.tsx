import { SITE_URL } from "@/lib/site";
import { getContactData, getTermsPageData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = {
  title: "Terms & Conditions | Orlowsky Discovery Hotel",
  description: "Terms and conditions for booking at Orlowsky Discovery Hotel.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
    languages: {
      "en": `${SITE_URL}/terms`,
      "ru": `${SITE_URL}/ru/terms`,
      "x-default": `${SITE_URL}/terms`,
    },
  },
};

export default function TermsPage() {
  const contact = getContactData();
  const data = getTermsPageData();

  return (
    <InnerPageLayout contact={contact}>
      <LegalPage data={data} />
    </InnerPageLayout>
  );
}
