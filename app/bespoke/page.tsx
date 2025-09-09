import { BespokeForm } from "@/components/BespokeForm";

export default function BespokePage() {
  return (
    <div className="container mx-auto px-6 py-8 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl mb-4">Bespoke</h1>
        <p className="text-charcoal/80 mb-6">Tell us about your vision. We’ll be in touch within 24 hours.</p>
        <BespokeForm />
      </div>
      <div>
        <div className="aspect-video w-full bg-beige/50 border rounded flex items-center justify-center">Cal.com widget</div>
      </div>
    </div>
  );
}


