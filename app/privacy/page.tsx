import { SITE_URL } from "@/lib/site";
import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = {
  title: "Privacy Policy | Orlowsky Discovery Hotel",
  description: "Privacy policy for Orlowsky Discovery Hotel website.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
    languages: {
      "en": `${SITE_URL}/privacy`,
      "ru": `${SITE_URL}/ru/privacy`,
      "x-default": `${SITE_URL}/privacy`,
    },
  },
};

export default function PrivacyPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/privacy.json");

  return (
    <InnerPageLayout contact={contact}>
      <LegalPage data={data} />
    </InnerPageLayout>
  );
}
