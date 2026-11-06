import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";
import { requireTmcReviewPage } from "@/lib/auth/requireTmcReviewPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TMC Ring Review",
  robots: { index: false, follow: false },
};

export default async function TmcReviewPage() {
  await requireTmcReviewPage("/tmc-review");
  return <ReviewClient />;
}
