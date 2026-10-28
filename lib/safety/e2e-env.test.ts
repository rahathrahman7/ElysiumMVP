import { describe, expect, it } from "vitest";
import { assertSafeE2EEnv, UnsafeE2EEnvError } from "./e2e-env";

describe("e2e env guard", () => {
  it("allows test keys and local database URLs", () => {
    expect(() =>
      assertSafeE2EEnv({
        STRIPE_SECRET_KEY: "sk_test_123",
        STRIPE_PUBLISHABLE_KEY: "pk_test_123",
        DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/elysium_e2e",
      })
    ).not.toThrow();
  });

  it("refuses live Stripe keys", () => {
    expect(() =>
      assertSafeE2EEnv({
        STRIPE_SECRET_KEY: "sk_live_not_a_real_key",
        DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/elysium_e2e",
      })
    ).toThrow(UnsafeE2EEnvError);
  });

  it("refuses prod / Supabase database hosts", () => {
    expect(() =>
      assertSafeE2EEnv({
        STRIPE_SECRET_KEY: "sk_test_123",
        DATABASE_URL:
          "postgresql://postgres:x@aws-1-eu-west-1.pooler.supabase.com:6543/postgres",
      })
    ).toThrow(/Supabase/);
  });
});
