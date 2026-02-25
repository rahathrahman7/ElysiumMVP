import { Metadata } from "next";
import { Suspense } from "react";
import CategoryHero from "@/components/fine-jewellery/CategoryHero";
import FineJewelleryGrid from "@/components/fine-jewellery/FineJewelleryGrid";

export const metadata: Metadata = {
  title: "Bracelets | Fine Jewellery | Elysium",
  description: "A refined finishing touch to any ensemble. Our tennis bracelets are thoughtfully crafted with an unwavering focus on detail. Perfect for gifting, they offer enduring beauty for every special moment.",
  openGraph: {
    title: "Bracelets | Fine Jewellery | Elysium",
    description: "A refined finishing touch to any ensemble. Our tennis bracelets are thoughtfully crafted with an unwavering focus on detail.",
    type: "website",
  },
};

export default function BraceletsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <CategoryHero
        title="Bracelets"
        description="A refined finishing touch to any ensemble. Our tennis bracelets are thoughtfully crafted with an unwavering focus on detail. Perfect for gifting, they offer enduring beauty for every special moment."
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
            <FineJewelleryGrid category="bracelets" />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
