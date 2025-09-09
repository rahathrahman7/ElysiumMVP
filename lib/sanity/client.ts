import { createClient } from "@sanity/client";
import { env } from "@/lib/env";

export function getSanityClient() {
  if (!env.SANITY_PROJECT_ID) return null;
  return createClient({
    projectId: env.SANITY_PROJECT_ID,
    dataset: env.SANITY_DATASET,
    apiVersion: "2024-07-01",
    useCdn: true,
    token: env.SANITY_API_TOKEN || undefined,
  });
}


