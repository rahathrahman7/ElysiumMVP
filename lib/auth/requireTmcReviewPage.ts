import { redirect } from "next/navigation";
import { getTmcReviewAccess } from "@/lib/auth/tmcReviewAuth";

export async function requireTmcReviewPage(callbackUrl: string): Promise<void> {
  const access = await getTmcReviewAccess();
  if (access.status === "ok") return;
  const params = new URLSearchParams({ callbackUrl });
  if (access.status === "forbidden") params.set("error", "forbidden");
  redirect(`/tmc-review/login?${params.toString()}`);
}
