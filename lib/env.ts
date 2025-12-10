export const env = {
  SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export function requireEnv(key: keyof typeof env): string {
  const value = env[key];
  if (!value) throw new Error(`Missing env: ${key}`);
  return value;
}
