import { Metadata } from "next";
import { Suspense } from "react";
import CategoryHero from "@/components/fine-jewellery/CategoryHero";
import FineJewelleryGrid from "@/components/fine-jewellery/FineJewelleryGrid";

export const metadata: Metadata = {
  title: "Earrings | Fine Jewellery | Elysium",
  description: "Elegance that frames the face. Our earring collection features exquisite designs from refined studs to statement pieces, each crafted with precision and care.",
  openGraph: {
    title: "Earrings | Fine Jewellery | Elysium",
    description: "Elegance that frames the face. Our earring collection features exquisite designs from refined studs to statement pieces.",
    type: "website",
  },
};

export default function EarringsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <CategoryHero
        title="Earrings"
        description="Elegance that frames the face. Our earring collection features exquisite designs from refined studs to statement pieces, each crafted with precision and care."
        breadcrumbs={[
          { label: "Fine Jewellery", href: "/fine-jewellery" },
        ]}
        compact
      />

      {/* Product Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Suspense fallback={
            <div className="text-center py-20 text-[#6D3D0D]/60">
              Loading collection...
            </div>
          }>
            <FineJewelleryGrid category="earrings" />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
