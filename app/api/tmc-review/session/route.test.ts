import { afterEach, describe, expect, it, vi } from "vitest";
import { POST, DELETE } from "./route";

describe("/api/tmc-review/session", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails closed when TMC_REVIEW_PASSCODE is unset", async () => {
    vi.stubEnv("TMC_REVIEW_PASSCODE", "");
    const res = await POST(
      new Request("http://localhost/api/tmc-review/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: "guess" }),
      })
    );
    expect(res.status).toBe(401);
  });

  it("rejects the wrong passcode and accepts the right one", async () => {
    vi.stubEnv("TMC_REVIEW_PASSCODE", "client-pass");
    vi.stubEnv("NEXTAUTH_SECRET", "unit-test-nextauth-secret");

    const bad = await POST(
      new Request("http://localhost/api/tmc-review/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: "nope" }),
      })
    );
    expect(bad.status).toBe(401);

    const good = await POST(
      new Request("http://localhost/api/tmc-review/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: "client-pass" }),
      })
    );
    expect(good.status).toBe(200);
    expect(good.headers.get("set-cookie")).toMatch(/elysium_tmc_review=/);
  });

  it("clears the cookie on logout", async () => {
    const res = await DELETE();
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toMatch(/Max-Age=0/);
  });
});
