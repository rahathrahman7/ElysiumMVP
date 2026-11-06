import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { authOptions } from "@/lib/auth/config";
import { ForbiddenError, UnauthorizedError } from "@/lib/auth/adminAuth";
import { tmcReviewAllowedEmails } from "@/lib/auth/productionGuards";
import {
  TMC_REVIEW_COOKIE,
  readCookieFromRequest,
  verifyTmcReviewCookie,
} from "@/lib/auth/tmcReviewPasscode";

export type TmcReviewPrincipal = {
  via: "admin" | "allowlist" | "passcode";
  email?: string | null;
};

export type TmcReviewAccess =
  | { status: "ok"; principal: TmcReviewPrincipal }
  | { status: "unauthenticated" }
  | { status: "forbidden" };

export type TmcReviewAuthInput = {
  session: {
    user?: { id?: string; email?: string | null; role?: string | null };
  } | null;
  cookie?: string;
  env?: import("@/lib/safety/production").EnvBag;
  now?: number;
};

export function resolveTmcReviewAccess(input: TmcReviewAuthInput): TmcReviewAccess {
  const env = input.env ?? process.env;
  const now = input.now ?? Date.now();

  if (verifyTmcReviewCookie(input.cookie, now, env)) {
    return { status: "ok", principal: { via: "passcode" } };
  }

  const email = input.session?.user?.email?.trim().toLowerCase();
  const role = input.session?.user?.role;
  const allowlist = tmcReviewAllowedEmails(env);

  if (role === "ADMIN" && input.session?.user?.id) {
    return {
      status: "ok",
      principal: { via: "admin", email: email ?? null },
    };
  }

  if (email && allowlist.includes(email) && input.session?.user?.id) {
    return {
      status: "ok",
      principal: { via: "allowlist", email },
    };
  }

  if (input.session?.user?.id) {
    return { status: "forbidden" };
  }

  return { status: "unauthenticated" };
}

async function sessionAndCookie(request?: Request): Promise<{
  session: TmcReviewAuthInput["session"];
  cookie?: string;
}> {
  const session = await getServerSession(authOptions);
  if (request) {
    return {
      session,
      cookie: readCookieFromRequest(request, TMC_REVIEW_COOKIE),
    };
  }
  const jar = await cookies();
  return {
    session,
    cookie: jar.get(TMC_REVIEW_COOKIE)?.value,
  };
}

export async function getTmcReviewAccess(
  request?: Request
): Promise<TmcReviewAccess> {
  const { session, cookie } = await sessionAndCookie(request);
  return resolveTmcReviewAccess({ session, cookie });
}

export async function requireTmcReviewAccess(
  request?: Request
): Promise<TmcReviewPrincipal> {
  const access = await getTmcReviewAccess(request);
  if (access.status === "unauthenticated") {
    throw new UnauthorizedError("TMC review login required");
  }
  if (access.status === "forbidden") {
    throw new ForbiddenError("TMC review access denied");
  }
  return access.principal;
}
