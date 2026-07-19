import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns — ELYSIUM",
  description: "ELYSIUM shipping policy and returns information.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl">
      <h1 className="font-serif text-3xl md:text-4xl text-elysium-charcoal mb-8">Shipping & Returns</h1>
      <p className="text-elysium-charcoal/80 leading-relaxed mb-6">
        <em>Client to provide final copy. This is a placeholder.</em>
      </p>
      <p className="text-elysium-charcoal/80 leading-relaxed">
        We offer complimentary insured shipping within the UK. International shipping is available. 
        Free 30-day returns on unworn items. Full details to be provided by client.
      </p>
    </div>
  );
}
