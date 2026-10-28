/** Only allow in-app TMC review redirects. */
export function safeTmcCallbackUrl(raw?: string | null): string {
  if (!raw) return "/tmc-review";
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    decoded = raw;
  }
  if (!decoded.startsWith("/tmc-review")) return "/tmc-review";
  if (decoded.startsWith("//") || decoded.includes("://")) return "/tmc-review";
  if (decoded.includes("\\")) return "/tmc-review";
  return decoded;
}
