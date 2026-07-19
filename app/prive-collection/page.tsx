import type { Metadata } from "next";
import { PriveCollectionContent } from "@/components/prive/PriveCollectionContent";

export const metadata: Metadata = {
  title: "Privé Collection | Elysium",
  description: "An exclusive curation of exceptional pieces. Coming soon.",
  openGraph: {
    title: "Privé Collection | Elysium",
    description: "An exclusive curation of exceptional pieces. Coming soon.",
    type: "website",
  },
};

export default function PriveCollectionPage() {
  return <PriveCollectionContent />;
}
