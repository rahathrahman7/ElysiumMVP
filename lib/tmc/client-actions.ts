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

export const CLIENT_REPLY_PREFIX = "Client reply:";
export const SPREADSHEET_UPDATED_LABEL = "Spreadsheet updated";

const PLACEHOLDER_PRICES = new Set(["check spreadsheet", "tbc", "tba", "n/a", "na"]);

export function isPlaceholderPrice(priceGbp: string) {
  const p = (priceGbp || "").trim().toLowerCase();
  return !p || PLACEHOLDER_PRICES.has(p);
}

export function isSpreadsheetUpdated(priceGbp: string) {
  return (priceGbp || "").trim().toLowerCase() === SPREADSHEET_UPDATED_LABEL.toLowerCase();
}

export function getClientReply(notes: string) {
  const match = (notes || "").match(/Client reply:\s*([\s\S]*)$/);
  return match ? match[1].trim() : "";
}

export function hasClientReply(notes: string) {
  return getClientReply(notes).length > 0;
}

export function appendClientReply(notes: string, reply: string) {
  const trimmed = reply.trim();
  const base = (notes || "")
    .replace(/\n\nClient reply:[\s\S]*$/, "")
    .replace(/Client reply:[\s\S]*$/, "")
    .trim();
  const block = `${CLIENT_REPLY_PREFIX} ${trimmed}`;
  return base ? `${base}\n\n${block}` : block;
}

export function isResolvedClientAction(action: ClientAction, review: ClientReview) {
  if (!review.keep) return true;

  switch (action.type) {
    case "price": {
      const raw = (review.priceGbp || "").trim();
      if (isSpreadsheetUpdated(raw)) return true;
      if (isPlaceholderPrice(raw)) return false;
      return /^\d/.test(raw.replace(/[£,\s]/g, ""));
    }
    case "note":
    case "confirm":
      return hasClientReply(review.notes || "");
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
