import { describe, expect, it } from "vitest";
import {
  assertSafeDatabaseTargetFromEnv,
  assertSafeDatabaseUrl,
  isLocalOrAllowedDatabaseHost,
  UnsafeDatabaseTargetError,
} from "./database-url";

describe("database allowlist", () => {
  it("allows localhost, 127.0.0.1, and docker hosts", () => {
    expect(isLocalOrAllowedDatabaseHost("localhost")).toBe(true);
    expect(isLocalOrAllowedDatabaseHost("127.0.0.1")).toBe(true);
    expect(isLocalOrAllowedDatabaseHost("postgres")).toBe(true);
    expect(isLocalOrAllowedDatabaseHost("host.docker.internal")).toBe(true);
    expect(
      assertSafeDatabaseUrl("postgresql://postgres:postgres@127.0.0.1:5432/elysium")
    ).toContain("127.0.0.1");
  });

  it("allows an explicit test host", () => {
    const env = { ALLOWED_TEST_DB_HOSTS: "pg.test.internal" };
    expect(isLocalOrAllowedDatabaseHost("pg.test.internal", env)).toBe(true);
    expect(
      assertSafeDatabaseUrl("postgresql://u:p@pg.test.internal:5432/elysium_test", env)
    ).toContain("pg.test.internal");
  });

  it("never allows Supabase hosts, even if listed", () => {
    const env = { ALLOWED_TEST_DB_HOSTS: "db.abcd.supabase.co,aws-1-eu-west-1.pooler.supabase.com" };
    expect(() =>
      assertSafeDatabaseUrl(
        "postgresql://postgres:x@db.abcd.supabase.co:5432/postgres",
        env
      )
    ).toThrow(UnsafeDatabaseTargetError);
    expect(() =>
      assertSafeDatabaseUrl(
        "postgresql://postgres:x@aws-1-eu-west-1.pooler.supabase.com:6543/postgres",
        env
      )
    ).toThrow(/Supabase/);
  });

  it("refuses unknown remote hosts", () => {
    expect(() =>
      assertSafeDatabaseUrl("postgresql://u:p@prod.example.com:5432/elysium")
    ).toThrow(/prod.example.com/);
  });

  it("reads DATABASE_URL from env and refuses when unset", () => {
    expect(() =>
      assertSafeDatabaseTargetFromEnv({
        DATABASE_URL: "",
        POSTGRES_PRISMA_URL: "",
        POSTGRES_URL: "",
        POSTGRES_URL_NON_POOLING: "",
      })
    ).toThrow(/No DATABASE_URL/);

    expect(
      assertSafeDatabaseTargetFromEnv({
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/elysium",
      })
    ).toContain("localhost");
  });
});
