import { describe, expect, it } from "vitest";
import { authorizeCronRequest } from "./cron-auth";

function requestWithAuth(header?: string) {
  const headers = new Headers();
  if (header !== undefined) headers.set("authorization", header);
  return new Request("http://localhost/api/cron/example", { headers });
}

describe("cron auth", () => {
  it("fails closed when CRON_SECRET is unset", () => {
    const result = authorizeCronRequest(requestWithAuth("Bearer undefined"), {
      CRON_SECRET: "",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(401);
      expect(result.message).toMatch(/CRON_SECRET is not configured/);
    }
  });

  it("rejects a missing or wrong bearer token", () => {
    const env = { CRON_SECRET: "correct-secret" };
    expect(authorizeCronRequest(requestWithAuth(), env).ok).toBe(false);
    expect(authorizeCronRequest(requestWithAuth("Bearer wrong"), env).ok).toBe(false);
    expect(authorizeCronRequest(requestWithAuth("Bearer undefined"), env).ok).toBe(false);
  });

  it("accepts Authorization: Bearer ${CRON_SECRET}", () => {
    const env = { CRON_SECRET: "correct-secret" };
    expect(authorizeCronRequest(requestWithAuth("Bearer correct-secret"), env)).toEqual({
      ok: true,
    });
  });
});
