import Link from "next/link";

export function ValueBar() {
  return (
    <section className="bg-elysium-ivory border-y border-elysium-whisper">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-elysium-gold/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-elysium-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-lg uppercase tracking-wide text-elysium-brown mb-1 leading-tight">Hallmarked in London</h2>
              <p className="text-sm text-elysium-smoke leading-normal">Assay Office certified</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-elysium-gold/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-elysium-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-lg uppercase tracking-wide text-elysium-brown mb-1 leading-tight">Free 30-day Returns</h2>
              <p className="text-sm text-elysium-smoke leading-normal">No questions asked</p>
            </div>
          </div>
          <Link href="/resizing" className="flex flex-col items-center gap-4 transition-transform duration-300 hover:scale-105">
            <div className="w-12 h-12 bg-elysium-gold/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-elysium-brown" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-heading text-lg uppercase tracking-wide text-elysium-brown mb-1 leading-tight">Complimentary Resizing</h2>
              <p className="text-sm text-elysium-smoke leading-normal">Lifetime service</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
