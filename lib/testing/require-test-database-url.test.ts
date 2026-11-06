import { describe, expect, it } from "vitest";
import { requireTestDatabaseUrl } from "./require-test-database-url";

describe("requireTestDatabaseUrl", () => {
  it("fails loudly when TEST_DATABASE_URL is unset even if DATABASE_URL is set", () => {
    expect(() =>
      requireTestDatabaseUrl({
        DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/elysium",
      })
    ).toThrow(/TEST_DATABASE_URL is required/);
  });

  it("does not fall back to DATABASE_URL", () => {
    try {
      requireTestDatabaseUrl({
        DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/elysium",
      });
      throw new Error("expected throw");
    } catch (error) {
      expect(String(error)).not.toMatch(/elysium$/);
      expect(String(error)).toMatch(/Refusing to fall back to DATABASE_URL/);
    }
  });

  it("returns the allowlisted TEST_DATABASE_URL", () => {
    expect(
      requireTestDatabaseUrl({
        TEST_DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/elysium_test",
        DATABASE_URL: "postgresql://postgres:postgres@prod.example.com:5432/elysium",
      })
    ).toContain("elysium_test");
  });

  it("still refuses a Supabase TEST_DATABASE_URL", () => {
    expect(() =>
      requireTestDatabaseUrl({
        TEST_DATABASE_URL:
          "postgresql://postgres:x@db.abcd.supabase.co:5432/postgres",
      })
    ).toThrow(/Supabase/);
  });
});
