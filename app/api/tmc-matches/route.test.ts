import { beforeEach, describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "@/lib/auth/adminAuth";

const { requireTmcReviewAccess, findMany, upsert } = vi.hoisted(() => ({
  requireTmcReviewAccess: vi.fn(),
  findMany: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("@/lib/auth/tmcReviewAuth", () => ({
  requireTmcReviewAccess,
}));

vi.mock("@/lib/database/prisma", () => ({
  resolveDatabaseUrl: () => "postgresql://postgres:postgres@127.0.0.1:5432/elysium_test",
  prisma: {
    tmcRingMatch: { findMany, upsert },
  },
}));

vi.mock("@/lib/tmc/review-fallback", () => ({
  dbErrorMessage: (error: unknown) =>
    error instanceof Error ? error.message : "error",
  loadMatchFallback: () => ({ bySlug: {}, ownedByHandle: {} }),
}));

describe("/api/tmc-matches", () => {
  beforeEach(() => {
    requireTmcReviewAccess.mockReset();
    findMany.mockReset();
    upsert.mockReset();
  });

  it("rejects unauthenticated GET and POST", async () => {
    requireTmcReviewAccess.mockRejectedValue(new UnauthorizedError());
    const { GET, POST } = await import("./route");

    const getRes = await GET(new Request("http://localhost/api/tmc-matches"));
    expect(getRes.status).toBe(401);

    const postRes = await POST(
      new Request("http://localhost/api/tmc-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elysiumSlug: "celeste", tmcHandle: "ring-1" }),
      })
    );
    expect(postRes.status).toBe(401);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("allows an authorised GET and POST", async () => {
    requireTmcReviewAccess.mockResolvedValue({ via: "passcode" });
    findMany.mockResolvedValue([]);
    upsert.mockResolvedValue({});
    const { GET, POST } = await import("./route");

    const getRes = await GET(new Request("http://localhost/api/tmc-matches"));
    expect(getRes.status).toBe(200);

    const postRes = await POST(
      new Request("http://localhost/api/tmc-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elysiumSlug: "celeste", tmcHandle: "ring-1" }),
      })
    );
    expect(postRes.status).toBe(200);
    expect(upsert).toHaveBeenCalled();
  });
});
