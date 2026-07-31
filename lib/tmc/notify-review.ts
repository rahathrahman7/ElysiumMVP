import catalogSnapshot from "../../public/data/tmc-review-catalog.json";
import { sendAdminNotificationEmail } from "@/lib/services/email";
import { env } from "@/lib/env";

export type TmcReviewNotifyPayload = {
  handle: string;
  displayName?: string;
  priceGbp?: string;
  notes?: string;
  preferredMetal?: string;
  options?: unknown;
};

type CatalogRow = {
  handle: string;
  tmcName?: string;
  suggested?: string;
  category?: string;
  tmcPriceAud?: string;
};

function webhookUrl(): string | undefined {
  const url =
    process.env.TMC_REVIEW_WEBHOOK_URL ||
    process.env.CURSOR_AUTOMATION_WEBHOOK_URL ||
    "";
  return url.trim() || undefined;
}

function lookupCatalog(handle: string): CatalogRow | null {
  const rows = catalogSnapshot as CatalogRow[];
  return rows.find((r) => r.handle === handle) ?? null;
}

function buildText(payload: TmcReviewNotifyPayload, catalog: CatalogRow | null): string {
  const title =
    payload.displayName?.trim() ||
    catalog?.suggested ||
    catalog?.tmcName ||
    payload.handle;
  const reviewUrl = `${env.NEXT_PUBLIC_SITE_URL}/tmc-review`;

  return [
    "TMC Review — item added to ELYSIUM",
    "",
    `Display name: ${title}`,
    `TMC name: ${catalog?.tmcName || "—"}`,
    `Handle: ${payload.handle}`,
    `Category: ${catalog?.category || "—"}`,
    `Preferred metal: ${payload.preferredMetal || "—"}`,
    `Price (GBP): ${payload.priceGbp || "—"}`,
    `TMC ref (AUD): ${catalog?.tmcPriceAud ? `A$${catalog.tmcPriceAud}` : "—"}`,
    "",
    "Notes:",
    payload.notes?.trim() || "(none)",
    "",
    `Open configurator: ${reviewUrl}`,
  ].join("\n");
}

/** Fire-and-forget: email admin + ping Cursor automation webhook. */
export async function notifyTmcReviewAdded(payload: TmcReviewNotifyPayload): Promise<{
  email: boolean;
  webhook: boolean;
}> {
  const catalog = lookupCatalog(payload.handle);
  const title =
    payload.displayName?.trim() ||
    catalog?.suggested ||
    catalog?.tmcName ||
    payload.handle;
  const text = buildText(payload, catalog);

  let email = false;
  let webhook = false;

  try {
    email = await sendAdminNotificationEmail({
      subject: `TMC Review — added “${title}”`,
      text,
    });
  } catch (err) {
    console.error("[tmc-review] email notify failed:", err);
  }

  const url = webhookUrl();
  if (url) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "tmc_review.added",
          at: new Date().toISOString(),
          handle: payload.handle,
          displayName: payload.displayName || "",
          title,
          tmcName: catalog?.tmcName || "",
          category: catalog?.category || "",
          preferredMetal: payload.preferredMetal || "",
          priceGbp: payload.priceGbp || "",
          notes: payload.notes || "",
          options: payload.options ?? null,
          reviewUrl: `${env.NEXT_PUBLIC_SITE_URL}/tmc-review`,
        }),
      });
      webhook = res.ok;
      if (!res.ok) {
        console.error(
          "[tmc-review] webhook notify failed:",
          res.status,
          await res.text().catch(() => "")
        );
      }
    } catch (err) {
      console.error("[tmc-review] webhook notify failed:", err);
    }
  } else {
    console.warn(
      "[tmc-review] webhook skipped: set TMC_REVIEW_WEBHOOK_URL (Cursor Automations webhook)"
    );
  }

  return { email, webhook };
}
