import Link from "next/link";

export function QuickShopChips() {
  // Define chips with their filter types
  const styleChips = [
    { label: "Solitaire", filter: "solitaire" },
    { label: "Hidden Halo", filter: "hidden-halo" },
    { label: "Trilogy", filter: "three-stone" },
    { label: "Traditional Halo", filter: "halo" },
    { label: "Half Eternity", filter: "half-eternity" },
  ];

  const shapeChips = [
    { label: "Round", filter: "round" },
    { label: "Oval", filter: "oval" },
    { label: "Marquise", filter: "marquise" },
    { label: "Radiant", filter: "radiant" },
    { label: "Emerald", filter: "emerald" },
    { label: "Pear", filter: "pear" },
    { label: "Princess", filter: "princess" },
    { label: "Cushion", filter: "cushion" },
    { label: "Asscher", filter: "asscher" },
    { label: "Heart", filter: "heart" },
  ];

  const allChips = [...styleChips, ...shapeChips];

  return (
    <section id="quick-shop-chips" className="mx-auto max-w-5xl px-6 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
        {allChips.map((chip) => {
          const isStyle = styleChips.some(s => s.label === chip.label);
          const href = isStyle 
            ? `/shop?style=${chip.filter}`
            : `/shop?shape=${chip.filter}`;
          
          return (
            <Link
              key={chip.label}
              href={href}
              className="px-4 py-2 border rounded-full text-[12px] tracking-[0.16em] uppercase transition-all duration-300 hover:scale-105 luxury-chip"
            >
              {chip.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
