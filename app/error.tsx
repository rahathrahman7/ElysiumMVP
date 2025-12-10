"use client";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="font-heading text-3xl md:text-4xl mb-4">Something went wrong</h1>
          <p className="text-charcoal/80 mb-6">{error.message}</p>
          <button className="px-4 py-2 bg-charcoal text-ivory rounded" onClick={() => reset()}>Try again</button>
        </div>
      </body>
    </html>
  );
}
