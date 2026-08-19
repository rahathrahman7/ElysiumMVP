export type ClientActionType = "price" | "note" | "confirm";

export type ClientAction = {
  handle: string;
  type: ClientActionType;
  reason: string;
  label?: string;
};

export type ClientReview = {
  keep?: boolean;
  displayName?: string;
  priceGbp?: string;
  notes?: string;
};

/** @deprecated Legacy prefix — still parsed for older saved replies. */
export const CLIENT_REPLY_PREFIX = "Client reply:";
export const SPREADSHEET_UPDATED_LABEL = "Spreadsheet updated";

const PLACEHOLDER_PRICES = new Set(["check spreadsheet", "tbc", "tba", "n/a", "na"]);

function actionLabel(action: ClientAction) {
  return (action.label || action.handle).trim();
}

function followUpHeader(action: ClientAction) {
  return `[Client follow-up — ${actionLabel(action)}]`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function formatClientFollowUp(action: ClientAction, answer: string) {
  const trimmed = answer.trim();
  return `${followUpHeader(action)}\nQuestion: ${action.reason.trim()}\nAnswer: ${trimmed}`;
}

export function stripClientFollowUp(notes: string, action: ClientAction) {
  const header = escapeRegExp(followUpHeader(action));
  const block = new RegExp(`\\n\\n${header}[\\s\\S]*$`);
  const legacy = /(\n\nClient reply:[\s\S]*$|^Client reply:[\s\S]*$)/;
  return (notes || "").replace(block, "").replace(legacy, "").trim();
}

export function getClientFollowUpAnswer(notes: string, action: ClientAction) {
  const header = followUpHeader(action);
  const structured = (notes || "").match(
    new RegExp(`${escapeRegExp(header)}[\\s\\S]*?Answer:\\s*([\\s\\S]*)$`)
  );
  if (structured?.[1]) return structured[1].trim();

  const legacy = (notes || "").match(/Client reply:\s*([\s\S]*)$/);
  return legacy?.[1]?.trim() || "";
}

export function appendClientFollowUp(notes: string, action: ClientAction, answer: string) {
  const base = stripClientFollowUp(notes, action);
  const block = formatClientFollowUp(action, answer);
  return base ? `${base}\n\n${block}` : block;
}

export function isPlaceholderPrice(priceGbp: string) {
  const p = (priceGbp || "").trim().toLowerCase();
  return !p || PLACEHOLDER_PRICES.has(p);
}

export function isSpreadsheetUpdated(priceGbp: string) {
  return (priceGbp || "").trim().toLowerCase() === SPREADSHEET_UPDATED_LABEL.toLowerCase();
}

/** @deprecated Use getClientFollowUpAnswer */
export function getClientReply(notes: string) {
  const legacy = (notes || "").match(/Client reply:\s*([\s\S]*)$/);
  return legacy?.[1]?.trim() || "";
}

/** @deprecated Use appendClientFollowUp */
export function appendClientReply(notes: string, reply: string) {
  const trimmed = reply.trim();
  const base = (notes || "")
    .replace(/\n\nClient reply:[\s\S]*$/, "")
    .replace(/Client reply:[\s\S]*$/, "")
    .trim();
  const block = `${CLIENT_REPLY_PREFIX} ${trimmed}`;
  return base ? `${base}\n\n${block}` : block;
}

export function hasClientFollowUp(notes: string, action: ClientAction) {
  return getClientFollowUpAnswer(notes, action).length > 0;
}

export function isResolvedClientAction(action: ClientAction, review: ClientReview) {
  if (!review.keep) return true;

  switch (action.type) {
    case "price": {
      const raw = (review.priceGbp || "").trim();
      if (isSpreadsheetUpdated(raw)) return true;
      if (hasClientFollowUp(review.notes || "", action)) return true;
      if (isPlaceholderPrice(raw)) return false;
      return /^\d/.test(raw.replace(/[£,\s]/g, ""));
    }
    case "note":
    case "confirm":
      return hasClientFollowUp(review.notes || "", action);
    default:
      return true;
  }
}

export function unresolvedClientActions(
  actions: ClientAction[],
  reviews: Record<string, ClientReview>
) {
  return actions.filter((action) => {
    const review = reviews[action.handle];
    if (!review?.keep) return false;
    return !isResolvedClientAction(action, review);
  });
}
