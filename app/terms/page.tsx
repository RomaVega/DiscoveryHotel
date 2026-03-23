import { getContactData } from "@/lib/content";
import { InnerPageLayout } from "@/components/layout/InnerPageLayout";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = {
  title: "Terms & Conditions | Orlowsky Discovery Hotel",
  description: "Terms and conditions for booking at Orlowsky Discovery Hotel.",
};

export default function TermsPage() {
  const contact = getContactData();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const data = require("@/content/terms.json");

  return (
    <InnerPageLayout contact={contact}>
      <LegalPage data={data} />
    </InnerPageLayout>
  );
}
