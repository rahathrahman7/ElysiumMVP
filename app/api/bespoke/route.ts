import { NextResponse } from "next/server";
import { Resend } from "resend";
import { env, requireEnv } from "@/lib/env";
// import { createClient } from "sanity";

export async function POST(request: Request) {
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const form = await request.formData();
  const name = String(form.get("name") || "");
  const email = String(form.get("email") || "");
  const phone = String(form.get("phone") || "");
  const budget = String(form.get("budget") || "");
  const notes = String(form.get("notes") || "");

  // Send email
  await resend.emails.send({
    from: "studio@elysium.example",
    to: ["hello@elysium.example"],
    subject: "New Bespoke Enquiry",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nBudget: ${budget}\nNotes: ${notes}`,
  });

  // Create Lead in Sanity - commented out until Sanity is installed
  // const client = createClient({ projectId: env.SANITY_PROJECT_ID, dataset: env.SANITY_DATASET, apiVersion: "2024-07-01", token: env.SANITY_API_TOKEN });
  // await client.create({ _type: "lead", name, email, phone, budget, notes });

  return NextResponse.json({ ok: true });
}


