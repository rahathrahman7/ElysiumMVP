import { Metadata } from "next";
import { Suspense } from "react";
import CategoryHero from "@/components/fine-jewellery/CategoryHero";
import FineJewelleryGrid from "@/components/fine-jewellery/FineJewelleryGrid";

export const metadata: Metadata = {
  title: "Necklaces | Fine Jewellery | Elysium",
  description:
    "Exquisite pendants and chains in 18ct gold. Choose your metal, carat, and 16\" or 18\" chain length — crafted with the same attention to detail as our signature pieces.",
  openGraph: {
    title: "Necklaces | Fine Jewellery | Elysium",
    description:
      "Exquisite pendants and chains in 18ct gold. Choose your metal, carat, and chain length.",
    type: "website",
  },
};

export default function NecklacesPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <CategoryHero
        title="Necklaces"
        description={`Timeless elegance that adorns the neckline. Our pendant and chain collection features refined silhouettes in 18ct gold, available in 16" and 18" lengths.`}
        breadcrumbs={[{ label: "Fine Jewellery", href: "/fine-jewellery" }]}
        compact
      />

      <section className="py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Suspense
            fallback={
              <div className="text-center py-20 text-[#6D3D0D]/60">
                Loading collection...
              </div>
            }
          >
            <FineJewelleryGrid category="necklaces" />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
