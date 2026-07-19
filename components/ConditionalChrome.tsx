"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const STANDALONE_PREFIXES = ["/tmc-review"];

/** Hides its children on standalone tool routes (no footer/concierge). */
export function ConditionalChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname && STANDALONE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }
  return <>{children}</>;
}
