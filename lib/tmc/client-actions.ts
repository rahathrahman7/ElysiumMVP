export type ClientActionType = "price" | "note" | "confirm";

export type ClientAction = {
  handle: string;
  type: ClientActionType;
  reason: string;
};

export type ClientReview = {
  keep?: boolean;
  displayName?: string;
  priceGbp?: string;
  notes?: string;
};

const PLACEHOLDER_PRICES = new Set(["check spreadsheet", "tbc", "tba", "n/a", "na"]);

export function isPlaceholderPrice(priceGbp: string) {
  const p = (priceGbp || "").trim().toLowerCase();
  return !p || PLACEHOLDER_PRICES.has(p);
}

export function isResolvedClientAction(action: ClientAction, review: ClientReview) {
  if (!review.keep) return true;

  switch (action.type) {
    case "price": {
      const raw = (review.priceGbp || "").trim();
      if (isPlaceholderPrice(raw)) return false;
      return /^\d/.test(raw.replace(/[£,\s]/g, ""));
    }
    case "note":
      return Boolean((review.notes || "").trim());
    case "confirm":
      return false;
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
