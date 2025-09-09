"use client";
export default function SelectionSummary({
  items,
  onClear,
}: {
  items: { key: string; value?: string }[];
  onClear?: () => void;
}) {
  const has = items.some(i => i.value);
  if (!has) return null;

  return (
    <div className="filter-summary flex flex-wrap items-center gap-2 rounded-2xl border border-neutral-200 bg-white/80 px-3 py-2">
      {items.map(i =>
        i.value ? (
          <span
            key={i.key}
            className="filter-tag rounded-full border border-neutral-200 bg-[var(--ivory)] px-3 py-1 text-xs text-neutral-700"
          >
            {i.key}: <strong className="ml-1">{i.value}</strong>
          </span>
        ) : null
      )}
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="clear-button ml-2 text-xs text-neutral-600 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-800"
        >
          Clear all
        </button>
      ) : null}
    </div>
  );
}
