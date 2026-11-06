import { describe, expect, it } from "vitest";
import { assertNotProductionSeed, isProductionRuntime } from "./production";

describe("production runtime", () => {
  it("treats NODE_ENV=production or VERCEL_ENV=production as production", () => {
    expect(isProductionRuntime({ NODE_ENV: "production" })).toBe(true);
    expect(isProductionRuntime({ VERCEL_ENV: "production" })).toBe(true);
    expect(isProductionRuntime({ NODE_ENV: "development", VERCEL_ENV: "preview" })).toBe(
      false
    );
    expect(isProductionRuntime({ NODE_ENV: "test" })).toBe(false);
  });

  it("refuses seed in production unless explicitly allowed", () => {
    expect(() => assertNotProductionSeed({ NODE_ENV: "production" })).toThrow(
      /Refusing to seed/
    );
    expect(() =>
      assertNotProductionSeed({ NODE_ENV: "production", ALLOW_PRODUCTION_SEED: "true" })
    ).not.toThrow();
    expect(() => assertNotProductionSeed({ NODE_ENV: "development" })).not.toThrow();
  });
});
