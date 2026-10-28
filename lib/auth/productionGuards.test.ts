import { describe, expect, it } from "vitest";
import {
  isAdminAuthDisabled,
  isDemoAdminBypassEnabled,
  tmcReviewAllowedEmails,
} from "./productionGuards";

describe("admin bypasses fail closed in production", () => {
  it("ignores DISABLE_ADMIN_AUTH when NODE_ENV is production", () => {
    expect(
      isAdminAuthDisabled({ NODE_ENV: "production", DISABLE_ADMIN_AUTH: "true" })
    ).toBe(false);
    expect(
      isAdminAuthDisabled({ VERCEL_ENV: "production", DISABLE_ADMIN_AUTH: "true" })
    ).toBe(false);
  });

  it("allows DISABLE_ADMIN_AUTH only outside production", () => {
    expect(
      isAdminAuthDisabled({ NODE_ENV: "development", DISABLE_ADMIN_AUTH: "true" })
    ).toBe(true);
    expect(
      isAdminAuthDisabled({ NODE_ENV: "development", DISABLE_ADMIN_AUTH: "false" })
    ).toBe(false);
  });

  it("ignores DEMO_ADMIN_* in production", () => {
    expect(
      isDemoAdminBypassEnabled({
        NODE_ENV: "production",
        DEMO_ADMIN_EMAIL: "demo@example.com",
        DEMO_ADMIN_PASSWORD: "secret",
      })
    ).toBe(false);
    expect(
      isDemoAdminBypassEnabled({
        NODE_ENV: "development",
        DEMO_ADMIN_EMAIL: "demo@example.com",
        DEMO_ADMIN_PASSWORD: "secret",
      })
    ).toBe(true);
  });

  it("parses TMC_REVIEW_ALLOWED_EMAILS", () => {
    expect(
      tmcReviewAllowedEmails({
        TMC_REVIEW_ALLOWED_EMAILS: " Client@Example.com, other@x.test ",
      })
    ).toEqual(["client@example.com", "other@x.test"]);
  });
});
