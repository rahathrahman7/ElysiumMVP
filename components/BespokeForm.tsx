"use client";
import { useState } from "react";

export function BespokeForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  if (sent) return <div className="p-6 border rounded">Thank you — we’ll be in touch shortly.</div>;
  return (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault();
      setLoading(true);
      const form = e.currentTarget as HTMLFormElement;
      const data = new FormData(form);
      const res = await fetch("/api/bespoke", { method: "POST", body: data });
      setLoading(false);
      if (res.ok) setSent(true);
    }}>
      <input name="name" className="w-full px-3 py-2 rounded border" placeholder="Name" required />
      <input type="email" name="email" className="w-full px-3 py-2 rounded border" placeholder="Email" required />
      <input name="phone" className="w-full px-3 py-2 rounded border" placeholder="Phone" />
      <input name="budget" className="w-full px-3 py-2 rounded border" placeholder="Budget (GBP)" />
      <textarea name="notes" className="w-full px-3 py-2 rounded border" placeholder="Notes" rows={5} />
      <input type="file" name="file" className="w-full" />
      <button className="px-4 py-2 bg-charcoal text-ivory rounded" disabled={loading}>{loading ? "Sending…" : "Send"}</button>
    </form>
  );
}


