import { sendAdminNotificationEmail } from "@/lib/services/email";
import { env } from "@/lib/env";
import { getTmcCatalogEntry } from "@/lib/tmc/catalog-lookup";
import {
  classifyTmcSelection,
  slugifyDisplayName,
  type TmcReviewFields,
} from "@/lib/tmc/selection-kind";

export type TmcNotifyTrigger =
  | "keep_enabled"
  | "named_while_kept"
  | "manual";

export type PreviousReviewSnapshot = {
  keep: boolean;
  displayName: string | null;
} | null;

export type TmcNotifyInput = {
  handle: string;
  review: TmcReviewFields & { keep: boolean };
  previous: PreviousReviewSnapshot;
  trigger?: TmcNotifyTrigger;
};

function shouldNotify(input: TmcNotifyInput): boolean {
  if (input.trigger === "manual") return true;
  if (!input.review.keep) return false;

  const kind = classifyTmcSelection(input.review);
  if (kind === "incomplete") return false;

  const wasKept = Boolean(input.previous?.keep);
  const prevName = (input.previous?.displayName ?? "").trim();
  const nextName = (input.review.displayName ?? "").trim();

  // Client just tapped "Add to ELYSIUM" on a row that already has a usable name.
  if (!wasKept && nextName) return true;

  // Client named a ring that was already kept (common: keep first, name later).
  if (wasKept && !prevName && nextName) return true;

  return false;
}

export function buildTmcSelectionExecutionPlan(input: {
  handle: string;
  review: TmcReviewFields & { keep: boolean };
}): {
  kind: ReturnType<typeof classifyTmcSelection>;
  slug: string;
  steps: string[];
  approveHint: string;
} {
  const kind = classifyTmcSelection(input.review);
  const name = (input.review.displayName ?? "").trim();
  const slug = name && kind === "new_product" ? slugifyDisplayName(name) : "";
  const price = (input.review.priceGbp ?? "").trim() || "(none)";
  const notes = (input.review.notes ?? "").trim();

  if (kind === "image_replacement") {
    return {
      kind,
      slug,
      steps: [
        `Classify as IMAGE REPLACEMENT for instruction: "${name}".`,
        `Source TMC handle: ${input.handle}`,
        "Identify the target existing ELYSIUM product from the instruction text.",
        "Dry-run / review: scripts/apply-tmc-image-replacements.py (or replace-ring-images-from-tmc.mjs for hard-coded targets).",
        "Confirm scrape renders exist under exports/tmc-ring-catalog/images/{handle}/.",
        "Apply replacement, commit products.json + image assets, open PR, deploy after merge.",
      ],
      approveHint:
        "Reply to the Cursor Plan automation (or react ✅ in Slack / comment `approve import` on the plan) to execute the image replacement.",
    };
  }

  return {
    kind,
    slug,
    steps: [
      `Classify as NEW PRODUCT: "${name}" → slug ${slug || "(pending name)"}.`,
      `Source TMC handle: ${input.handle}`,
      `Review priceGbp: ${price}${/\d/.test(price) ? "" : " — expect provisional AUD×1.86 until confirmed."}`,
      notes ? `Client notes: ${notes.slice(0, 280)}${notes.length > 280 ? "…" : ""}` : "No client notes yet.",
      "Diff vs catalog: node scripts/plan-tmc-import.mjs",
      "Dry-run import: node scripts/import-selected-rings.mjs --dry-run --update",
      "On approval: node scripts/import-selected-rings.mjs --update",
      "Commit public/data/products.json + public/products/tmc-import/**, open PR, deploy after merge.",
      "Spot-check PDP /products/" + (slug || "<slug>") + " in production.",
    ],
    approveHint:
      "To execute: open the Cursor agent run from the Plan automation and reply `execute the plan`, or react ✅ on the Slack plan message / comment `approve import`.",
  };
}

function buildEmailText(input: TmcNotifyInput): string {
  const plan = buildTmcSelectionExecutionPlan(input);
  const name = (input.review.displayName ?? "").trim();
  const site = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const catalog = getTmcCatalogEntry(input.handle);
  const kindLabel =
    plan.kind === "image_replacement" ? "Image replacement" : "New product";

  return `
TMC Review — client selection ready for execution

Kind: ${kindLabel}
Handle: ${input.handle}
Display name: ${name || "(unnamed)"}
TMC name: ${catalog?.tmcName || "(unknown)"}
Category: ${catalog?.category || "(unknown)"}
Price (GBP field): ${(input.review.priceGbp ?? "").trim() || "(empty)"}
Preferred metal: ${(input.review.preferredMetal ?? "").trim() || "(none)"}
Trigger: ${input.trigger ?? "keep_enabled"}

Review UI: ${site}/tmc-review
Review API: ${site}/api/tmc-review

PROPOSED EXECUTION PLAN
${plan.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

NEXT STEP (human gate)
${plan.approveHint}

This notification does NOT mutate the live catalog. Import only after you approve.
`.trim();
}

/** Payload for Cursor Automation "TMC Review — item added". */
export function buildTmcReviewAddedWebhookPayload(input: TmcNotifyInput): Record<string, unknown> {
  const plan = buildTmcSelectionExecutionPlan(input);
  const name = (input.review.displayName ?? "").trim();
  const site = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const catalog = getTmcCatalogEntry(input.handle);

  return {
    event: "tmc_review.added",
    source: "elysium-tmc-review",
    title: name,
    displayName: name,
    tmcName: catalog?.tmcName ?? "",
    category: catalog?.category ?? "",
    preferredMetal: (input.review.preferredMetal ?? "").trim(),
    priceGbp: (input.review.priceGbp ?? "").trim(),
    notes: (input.review.notes ?? "").trim(),
    handle: input.handle,
    reviewUrl: `${site}/tmc-review`,
    kind: plan.kind,
    slug: plan.slug,
    tmcPriceAud: catalog?.tmcPriceAud ?? "",
    reviewApi: `${site}/api/tmc-review`,
    triggeredAt: new Date().toISOString(),
  };
}

async function fireCursorAutomationWebhook(payload: Record<string, unknown>): Promise<boolean> {
  // Prefer the dedicated env the user asked for; keep legacy names as fallback.
  const url = (
    env.TMC_REVIEW_WEBHOOK_URL ||
    env.CURSOR_TMC_AUTOMATION_WEBHOOK_URL ||
    ""
  ).trim();
  const apiKey = (
    env.TMC_REVIEW_WEBHOOK_API_KEY ||
    env.CURSOR_TMC_AUTOMATION_WEBHOOK_API_KEY ||
    ""
  ).trim();

  if (!url) {
    console.info(
      "[tmc-notify] Cursor webhook skipped: TMC_REVIEW_WEBHOOK_URL not set"
    );
    return false;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[tmc-notify] Cursor webhook failed: ${res.status} ${body.slice(0, 500)}`);
    return false;
  }

  return true;
}

/**
 * Email admin + fire the Cursor "TMC Review — item added" webhook when the
 * client newly keeps (or names) a TMC review row. Never throws to callers.
 */
export async function notifyTmcSelectionIfNeeded(input: TmcNotifyInput): Promise<{
  notified: boolean;
  emailed: boolean;
  webhooked: boolean;
  reason?: string;
}> {
  try {
    if (!shouldNotify(input)) {
      return { notified: false, emailed: false, webhooked: false, reason: "not_actionable" };
    }

    const plan = buildTmcSelectionExecutionPlan(input);
    const name = (input.review.displayName ?? "").trim();
    const subject =
      plan.kind === "image_replacement"
        ? `TMC review: image replacement — ${name}`
        : `TMC review: new product — ${name}`;

    const emailed = await sendAdminNotificationEmail({
      subject,
      text: buildEmailText(input),
    });

    const webhooked = await fireCursorAutomationWebhook(
      buildTmcReviewAddedWebhookPayload(input)
    );

    return { notified: emailed || webhooked, emailed, webhooked };
  } catch (error) {
    console.error("[tmc-notify] notification failed:", error);
    return { notified: false, emailed: false, webhooked: false, reason: "error" };
  }
}
