export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-8 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="font-heading text-3xl md:text-4xl mb-4">Contact</h1>
        <p className="mb-4">Atelier: 12 Brook Street, London</p>
        <p className="mb-4">Email: hello@elysium.example</p>
        <p className="mb-4">Phone: +44 20 1234 5678</p>
      </div>
      <div>
        <div className="aspect-video w-full bg-beige/50 border rounded flex items-center justify-center">Map embed</div>
      </div>
    </div>
  );
}
















