import Link from "next/link";

export const metadata = { 
  title: "Elysium for Heroes — 40% Off" 
};

export default function HeroesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1 className="font-heading uppercase tracking-[0.12em] text-4xl text-black">
        Elysium for Heroes — 40% Off
      </h1>
      
      <p className="mt-4 text-gray-700 leading-7 font-body">
        At Elysium London, we believe heroes deserve something truly special. We offer <strong>40% off</strong> engagement rings* and wedding bands* for members of the emergency services — <strong>NHS, Police, Fire &amp; Rescue</strong>, and <strong>Paramedics</strong>. 
        Your commitment to protecting our communities inspires us. This is our way of saying <strong>thank you</strong>.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link 
          href="/bespoke" 
          className="luxury-button"
        >
          Book Appointment
        </Link>
        <Link 
          href="/shop" 
          className="luxury-button secondary"
        >
          Shop the Collection
        </Link>
      </div>

      <div className="mt-10 rounded-lg p-4 text-sm text-gray-700 bg-gray-100 border border-gray-200">
        <p>*Accepted proof of service includes (but isn't limited to) Blue Light Card, service ID or badge.</p>
        <p className="mt-2">*We reserve the right to refuse the discount if reasonable proof cannot be provided.</p>
      </div>
    </main>
  );
}








