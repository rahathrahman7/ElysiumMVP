import type { Metadata } from "next";
import ReviewMatch from "./ReviewMatch";

export const metadata: Metadata = {
  title: "TMC Ring Matcher (internal)",
  robots: { index: false, follow: false },
};

export default function TmcMatchPage() {
  return <ReviewMatch />;
}
