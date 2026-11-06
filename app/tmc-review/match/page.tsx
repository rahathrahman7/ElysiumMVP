import type { Metadata } from "next";
import ReviewMatch from "./ReviewMatch";
import { requireTmcReviewPage } from "@/lib/auth/requireTmcReviewPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TMC Ring Matcher (internal)",
  robots: { index: false, follow: false },
};

export default async function TmcMatchPage() {
  await requireTmcReviewPage("/tmc-review/match");
  return <ReviewMatch />;
}
