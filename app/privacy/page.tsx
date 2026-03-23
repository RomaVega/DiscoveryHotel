import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = {
  title: "Privacy Policy | Orlowsky Discovery Hotel",
  description: "Privacy policy for Orlowsky Discovery Hotel website.",
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
