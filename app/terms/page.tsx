import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — ELYSIUM",
  description: "ELYSIUM terms of service and conditions of purchase.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl">
      <h1 className="font-serif text-3xl md:text-4xl text-elysium-charcoal mb-8">Terms of Service</h1>
      <p className="text-elysium-charcoal/80 leading-relaxed mb-6">
        <em>Client to provide final copy. This is a placeholder.</em>
      </p>
      <p className="text-elysium-charcoal/80 leading-relaxed">
        By using our website and placing an order, you agree to these terms. 
        All purchases are subject to our acceptance and availability. 
        Prices are in GBP and include VAT where applicable.
      </p>
    </div>
  );
}
