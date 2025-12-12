import Link from "next/link";

export function QuickShopChips() {
  const chips = ["Solitaire", "Hidden Halo", "Three-Stone", "Round", "Oval", "Marquise"];

  return (
    <section className="mx-auto max-w-5xl px-6 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
        {chips.map((chip) => (
          <Link
            key={chip}
            href={`/shop?style=${chip.toLowerCase().replace(/\s+/g, '-')}`}
            className="px-4 py-2 border rounded-full text-[12px] tracking-[0.16em] uppercase transition-all duration-300 hover:scale-105 luxury-chip"
          >
            {chip}
          </Link>
        ))}
      </div>
    </section>
  );
}
