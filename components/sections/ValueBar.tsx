export function ValueBar() {
  return (
    <section className="bg-gray-100 border-y border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <h2 className="font-heading text-lg uppercase tracking-wide text-black mb-1 leading-tight">Hallmarked in London</h2>
              <p className="text-sm text-gray-600 leading-normal">Assay Office certified</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <h2 className="font-heading text-lg uppercase tracking-wide text-black mb-1 leading-tight">Free 30-day Returns</h2>
              <p className="text-sm text-gray-600 leading-normal">No questions asked</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
            <div>
              <h2 className="font-heading text-lg uppercase tracking-wide text-black mb-1 leading-tight">Complimentary Resizing</h2>
              <p className="text-sm text-gray-600 leading-normal">Lifetime service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
