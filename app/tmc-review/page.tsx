import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";

export const metadata: Metadata = {
  title: "TMC Ring Review",
  robots: { index: false, follow: false },
};

export default function TmcReviewPage() {
  return <ReviewClient />;
}
