import { describe, expect, it, vi } from "vitest";
import {
  assertSafeIdent,
  withEphemeralLoginRole,
  withRenamedTable,
  withTemporaryTableGrant,
} from "./db-helpers";

function mockClient() {
  return {
    query: vi.fn<(sql: string, params?: unknown[]) => Promise<unknown>>(
      async () => undefined
    ),
  };
}

describe("db test helpers restore state", () => {
  it("rejects unsafe identifiers", () => {
    expect(() => assertSafeIdent("users; drop table users", "table")).toThrow(/Unsafe/);
  });

  it("renames a table back in finally when the test throws", async () => {
    const client = mockClient();
    await expect(
      withRenamedTable(client, { from: "users", to: "users_bak" }, async () => {
        throw new Error("boom");
      })
    ).rejects.toThrow("boom");

    expect(client.query.mock.calls.map((call) => call[0])).toEqual([
      "ALTER TABLE users RENAME TO users_bak",
      "ALTER TABLE users_bak RENAME TO users",
    ]);
  });

  it("revokes a temporary grant in finally", async () => {
    const client = mockClient();
    await withTemporaryTableGrant(
      client,
      { table: "orders", role: "anon", privilege: "SELECT" },
      async () => "ok"
    );
    expect(client.query.mock.calls.map((call) => call[0])).toEqual([
      "GRANT SELECT ON TABLE orders TO anon",
      "REVOKE SELECT ON TABLE orders FROM anon",
    ]);
  });

  it("drops a role created with a known password in finally", async () => {
    const client = mockClient();
    await expect(
      withEphemeralLoginRole(
        client,
        { name: "elysium_test_role", password: "test-password-only" },
        async () => {
          throw new Error("still boom");
        }
      )
    ).rejects.toThrow("still boom");

    expect(client.query.mock.calls[0]?.[0]).toMatch(/CREATE ROLE elysium_test_role LOGIN PASSWORD/);
    expect(client.query.mock.calls[1]?.[0]).toBe("DROP ROLE IF EXISTS elysium_test_role");
  });
});
