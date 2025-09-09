import Link from "next/link";
import Image from "next/image";

export function EditorialTeasers() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Collection */}
        <Link href="/collection" className="group relative overflow-hidden rounded-xl bg-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <Image
            src="/images/newhero.jpg"
            alt="New Collection"
            width={600}
            height={360}
            className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 flex items-end p-6">
            <div className="text-[12px] tracking-[0.22em] text-neutral-900 uppercase relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-current after:transition-all group-hover:after:w-full">
              New Collection
            </div>
          </div>
        </Link>

        {/* Build Your Ring */}
        <Link href="/products?builder=1" className="group relative overflow-hidden rounded-xl bg-neutral-100 shadow-sm hover:shadow-lg transition-all duration-300">
          <Image
            src="/images/herov3.png"
            alt="Build Your Ring"
            width={600}
            height={360}
            className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 flex items-end p-6">
            <div className="text-[12px] tracking-[0.22em] text-neutral-900 uppercase relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 after:bg-current after:transition-all group-hover:after:w-full">
              Build Your Ring
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
