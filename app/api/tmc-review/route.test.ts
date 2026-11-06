import { beforeEach, describe, expect, it, vi } from "vitest";
import { ForbiddenError, UnauthorizedError } from "@/lib/auth/adminAuth";

const { requireTmcReviewAccess, findMany, findUnique, upsert } = vi.hoisted(() => ({
  requireTmcReviewAccess: vi.fn(),
  findMany: vi.fn(),
  findUnique: vi.fn(),
  upsert: vi.fn(),
}));

vi.mock("@/lib/auth/tmcReviewAuth", () => ({
  requireTmcReviewAccess,
}));

vi.mock("@/lib/database/prisma", () => ({
  resolveDatabaseUrl: () => "postgresql://postgres:postgres@127.0.0.1:5432/elysium_test",
  prisma: {
    tmcRingReview: { findMany, findUnique, upsert },
  },
}));

vi.mock("@/lib/tmc/notify-review", () => ({
  notifyTmcReviewAdded: vi.fn(async () => ({ email: false, webhook: false })),
}));

vi.mock("@/lib/tmc/review-fallback", () => ({
  dbErrorMessage: (error: unknown) =>
    error instanceof Error ? error.message : "error",
  loadReviewFallback: () => ({ "demo-ring": { keep: true } }),
}));

describe("/api/tmc-review", () => {
  beforeEach(() => {
    requireTmcReviewAccess.mockReset();
    findMany.mockReset();
    findUnique.mockReset();
    upsert.mockReset();
  });

  it("rejects unauthenticated GET and POST", async () => {
    requireTmcReviewAccess.mockRejectedValue(new UnauthorizedError());
    const { GET, POST } = await import("./route");

    const getRes = await GET(new Request("http://localhost/api/tmc-review"));
    expect(getRes.status).toBe(401);
    expect(findMany).not.toHaveBeenCalled();

    const postRes = await POST(
      new Request("http://localhost/api/tmc-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: "ring-1", keep: true }),
      })
    );
    expect(postRes.status).toBe(401);
    expect(upsert).not.toHaveBeenCalled();
  });

  it("rejects a signed-in user without TMC access", async () => {
    requireTmcReviewAccess.mockRejectedValue(new ForbiddenError());
    const { GET } = await import("./route");
    const res = await GET(new Request("http://localhost/api/tmc-review"));
    expect(res.status).toBe(403);
  });

  it("allows an authorised GET and POST", async () => {
    requireTmcReviewAccess.mockResolvedValue({ via: "admin", email: "a@b.c" });
    findMany.mockResolvedValue([
      {
        handle: "ring-1",
        keep: true,
        displayName: "Ring",
        priceGbp: "1000",
        notes: null,
        preferredMetal: null,
        options: null,
      },
    ]);
    findUnique.mockResolvedValue({ keep: false });
    upsert.mockResolvedValue({
      handle: "ring-1",
      keep: true,
      displayName: "Ring",
      priceGbp: "1000",
      notes: null,
      preferredMetal: null,
      options: null,
    });

    const { GET, POST } = await import("./route");
    const getRes = await GET(new Request("http://localhost/api/tmc-review"));
    expect(getRes.status).toBe(200);
    const getBody = await getRes.json();
    expect(getBody.ok).toBe(true);
    expect(getBody.reviews["ring-1"].keep).toBe(true);

    const postRes = await POST(
      new Request("http://localhost/api/tmc-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: "ring-1", keep: true }),
      })
    );
    expect(postRes.status).toBe(200);
    expect(upsert).toHaveBeenCalled();
  });
});
