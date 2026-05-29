import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = {
  title: "Политика Конфиденциальности | Orlowsky Discovery Hotel",
  description: "Политика конфиденциальности сайта Orlowsky Discovery Hotel.",
  alternates: {
    canonical: `${SITE_URL}/ru/privacy`,
    languages: {
      "en": `${SITE_URL}/privacy`,
      "ru": `${SITE_URL}/ru/privacy`,
      "x-default": `${SITE_URL}/privacy`,
    },
  },
};

export default function PrivacyRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/privacy.json");

  return (
    <InnerPageLayout contact={contact}>
      <LegalPage data={data} />
    </InnerPageLayout>
  );
}
