import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = {
  title: "Условия Обслуживания | Orlowsky Discovery Hotel",
  description: "Условия бронирования и проживания в Orlowsky Discovery Hotel, Кандидаса, Бали.",
  alternates: {
    canonical: `${SITE_URL}/ru/terms`,
    languages: {
      "en": `${SITE_URL}/terms`,
      "ru": `${SITE_URL}/ru/terms`,
      "x-default": `${SITE_URL}/terms`,
    },
  },
};

export default function TermsRuPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/terms.json");

  return (
    <InnerPageLayout contact={contact}>
      <LegalPage data={data} />
    </InnerPageLayout>
  );
}
