import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireEnv } from "@/lib/env";
import { prisma } from "@/lib/database/prisma";
import { z } from "zod";

const bespokeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const resend = new Resend(requireEnv("RESEND_API_KEY"));
    const form = await request.formData();

    const data = bespokeSchema.parse({
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      budget: String(form.get("budget") || ""),
      notes: String(form.get("notes") || ""),
    });

    // Save lead to database
    const lead = await prisma.bespokeLead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        budget: data.budget,
        notes: data.notes,
      }
    });

    // Send email
    await resend.emails.send({
      from: "studio@elysium.example",
      to: ["hello@elysium.example"],
      subject: "New Bespoke Enquiry",
      text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nBudget: ${data.budget || 'N/A'}\nNotes: ${data.notes || 'N/A'}\n\nLead ID: ${lead.id}`,
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Bespoke enquiry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


