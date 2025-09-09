import Link from "next/link";

export function QuickShopChips() {
  const chips = ["Solitaire", "Hidden Halo", "Three-Stone", "Round", "Oval", "Marquise"];

  return (
    <section className="mx-auto max-w-5xl px-6 pt-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {chips.map((chip) => (
          <Link
            key={chip}
            href={`/products?style=${chip.toLowerCase().replace(/\s+/g, '-')}`}
            className="px-4 py-2 border border-neutral-300 text-neutral-800 hover:text-neutral-900 hover:border-neutral-500 transition rounded-full text-[12px] tracking-[0.16em] uppercase bg-white"
          >
            {chip}
          </Link>
        ))}
      </div>
    </section>
  );
}
