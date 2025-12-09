interface KVProps {
  rows: Array<{ k: string; v: string }>;
}

export function KV({ rows }: KVProps) {
  return (
    <div className="card p-6">
      <div className="space-y-4">
        {rows.map((row, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
            <dt className="font-serif uppercase tracking-wide text-sm text-charcoal font-medium min-w-[120px] flex-shrink-0">
              {row.k}
            </dt>
            <dd className="font-sans text-charcoal/80 text-sm leading-relaxed">
              {row.v}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}














