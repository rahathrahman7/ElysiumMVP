import { describe, expect, it } from "vitest";
import { safeTmcCallbackUrl } from "./callbackUrl";

describe("safeTmcCallbackUrl", () => {
  it("allows TMC review relative paths only", () => {
    expect(safeTmcCallbackUrl("/tmc-review")).toBe("/tmc-review");
    expect(safeTmcCallbackUrl("/tmc-review/match")).toBe("/tmc-review/match");
    expect(safeTmcCallbackUrl("https://evil.test")).toBe("/tmc-review");
    expect(safeTmcCallbackUrl("//evil.test")).toBe("/tmc-review");
    expect(safeTmcCallbackUrl("/admin")).toBe("/tmc-review");
  });
});
