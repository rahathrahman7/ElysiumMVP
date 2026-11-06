import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/nivoda", () => ({
  nivodaAPI: {
    setCredentials: vi.fn(),
    searchDiamonds: vi.fn(),
  },
}));

describe("/api/test-nivoda", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 404 in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();
    const { GET, POST } = await import("./route");
    expect((await GET()).status).toBe(404);
    expect(
      (
        await POST(
          new Request("http://localhost/api/test-nivoda", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "u", password: "p" }),
          }) as never
        )
      ).status
    ).toBe(404);
  });

  it("stays available outside production", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "test");
    vi.resetModules();
    const { GET } = await import("./route");
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/Nivoda API test endpoint/);
  });
});
