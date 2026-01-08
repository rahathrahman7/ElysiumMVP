import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireEnv } from "@/lib/env";
import { prisma } from "@/lib/database/prisma";
import { z } from "zod";

const bespokeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  // New structured fields
  budgetTier: z.enum(["3k-5k", "5k-10k", "10k-25k", "25k-50k", "50k+"]).optional(),
  briefVision: z.string().max(150).optional(),
  stylePreferences: z.string().optional(), // JSON string
  metalPreferences: z.string().optional(), // JSON string
  stonePreference: z.enum(["natural", "lab-grown", "both"]).optional(),
  detailedNotes: z.string().max(500).optional(),
  // Legacy fields for backward compatibility
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
      budgetTier: String(form.get("budgetTier") || ""),
      briefVision: String(form.get("briefVision") || ""),
      stylePreferences: String(form.get("stylePreferences") || ""),
      metalPreferences: String(form.get("metalPreferences") || ""),
      stonePreference: String(form.get("stonePreference") || ""),
      detailedNotes: String(form.get("detailedNotes") || ""),
      budget: String(form.get("budget") || ""),
      notes: String(form.get("notes") || ""),
    });

    // Parse JSON strings for style and metal preferences
    let stylePrefs: string[] = [];
    let metalPrefs: string[] = [];
    try {
      if (data.stylePreferences) stylePrefs = JSON.parse(data.stylePreferences);
      if (data.metalPreferences) metalPrefs = JSON.parse(data.metalPreferences);
    } catch (e) {
      console.error("Failed to parse preferences:", e);
    }

    // Collect file information
    const files = form.getAll("files") as File[];
    const fileInfo = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    // Create notes object with all structured data
    const structuredNotes = {
      briefVision: data.briefVision || "",
      stylePreferences: stylePrefs,
      metalPreferences: metalPrefs,
      stonePreference: data.stonePreference || "",
      detailedNotes: data.detailedNotes || "",
      files: fileInfo,
      legacyNotes: data.notes || "",
    };

    // Save lead to database
    const lead = await prisma.bespokeLead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        budget: data.budgetTier || data.budget || "",
        notes: JSON.stringify(structuredNotes),
      }
    });

    // Build email content
    const emailText = `
New Bespoke Enquiry - Lead ID: ${lead.id}

CONTACT INFORMATION
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

BUDGET & VISION
Budget Range: ${data.budgetTier || data.budget || 'Not specified'}
Brief Vision: ${data.briefVision || 'Not provided'}

STYLE PREFERENCES
Style Categories: ${stylePrefs.length > 0 ? stylePrefs.join(', ') : 'Not selected'}
Preferred Metals: ${metalPrefs.length > 0 ? metalPrefs.join(', ') : 'Not selected'}
Stone Preference: ${data.stonePreference || 'Not specified'}

ADDITIONAL DETAILS
${data.detailedNotes || 'No additional notes provided'}

INSPIRATION FILES
${fileInfo.length > 0 ? fileInfo.map(f => `- ${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join('\n') : 'No files uploaded'}

${data.notes ? `\nLegacy Notes: ${data.notes}` : ''}
`.trim();

    // Send email
    await resend.emails.send({
      from: "studio@elysium.example",
      to: ["hello@elysium.example"],
      subject: `New Bespoke Enquiry from ${data.name}`,
      text: emailText,
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


