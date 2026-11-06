import { describe, expect, it } from "vitest";
import { resolveTmcReviewAccess } from "./tmcReviewAuth";
import { signTmcReviewCookie } from "./tmcReviewPasscode";

const env = {
  NEXTAUTH_SECRET: "unit-test-nextauth-secret",
  TMC_REVIEW_ALLOWED_EMAILS: "client@example.com",
};

describe("resolveTmcReviewAccess", () => {
  it("is unauthenticated with no session and no cookie", () => {
    expect(resolveTmcReviewAccess({ session: null, env })).toEqual({
      status: "unauthenticated",
    });
  });

  it("allows an ADMIN NextAuth session", () => {
    const access = resolveTmcReviewAccess({
      session: { user: { id: "u1", email: "owner@example.com", role: "ADMIN" } },
      env,
    });
    expect(access).toEqual({
      status: "ok",
      principal: { via: "admin", email: "owner@example.com" },
    });
  });

  it("allows an allowlisted client email", () => {
    const access = resolveTmcReviewAccess({
      session: { user: { id: "u2", email: "Client@Example.com", role: "CUSTOMER" } },
      env,
    });
    expect(access.status).toBe("ok");
    if (access.status === "ok") {
      expect(access.principal.via).toBe("allowlist");
    }
  });

  it("forbids a signed-in customer who is not allowlisted", () => {
    expect(
      resolveTmcReviewAccess({
        session: { user: { id: "u3", email: "shopper@example.com", role: "CUSTOMER" } },
        env,
      })
    ).toEqual({ status: "forbidden" });
  });

  it("allows a valid passcode cookie", () => {
    const cookie = signTmcReviewCookie(5_000, env);
    const access = resolveTmcReviewAccess({
      session: null,
      cookie,
      env,
      now: 5_000,
    });
    expect(access).toEqual({ status: "ok", principal: { via: "passcode" } });
  });
});
