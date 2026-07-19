import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — ELYSIUM",
  description: "ELYSIUM privacy policy and data protection.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl">
      <h1 className="font-serif text-3xl md:text-4xl text-elysium-charcoal mb-8">Privacy Policy</h1>
      <p className="text-elysium-charcoal/80 leading-relaxed mb-6">
        <em>Client to provide final copy. This is a placeholder.</em>
      </p>
      <p className="text-elysium-charcoal/80 leading-relaxed">
        ELYSIUM collects and processes your personal data in accordance with applicable data protection laws. 
        We use your information to process orders, manage your account, and improve our services. 
        We do not sell your data to third parties.
      </p>
    </div>
  );
}
