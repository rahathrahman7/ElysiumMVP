import { describe, expect, it } from "vitest";
import {
  passcodeMatches,
  signTmcReviewCookie,
  verifyTmcReviewCookie,
} from "./tmcReviewPasscode";

const env = {
  NEXTAUTH_SECRET: "unit-test-nextauth-secret",
  TMC_REVIEW_PASSCODE: "client-pass",
};

describe("TMC review passcode cookie", () => {
  it("signs and verifies a cookie", () => {
    const token = signTmcReviewCookie(1_000, env);
    expect(verifyTmcReviewCookie(token, 1_000, env)).toBe(true);
  });

  it("rejects a tampered cookie and an expired cookie", () => {
    const token = signTmcReviewCookie(1_000, env);
    expect(verifyTmcReviewCookie(token + "x", 1_000, env)).toBe(false);
    expect(verifyTmcReviewCookie(token, 1_000 + 8 * 24 * 60 * 60 * 1000, env)).toBe(
      false
    );
  });

  it("compares passcodes without accepting empty values", () => {
    expect(passcodeMatches("client-pass", env)).toBe(true);
    expect(passcodeMatches("wrong", env)).toBe(false);
    expect(passcodeMatches("", env)).toBe(false);
    expect(passcodeMatches("client-pass", { TMC_REVIEW_PASSCODE: "" })).toBe(false);
  });
});
