import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTmcReviewAccess } from "@/lib/auth/tmcReviewAuth";
import { passcodeLoginConfigured } from "@/lib/auth/tmcReviewPasscode";
import { safeTmcCallbackUrl } from "@/lib/auth/callbackUrl";
import TmcLoginForm from "./TmcLoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TMC Review login",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function TmcReviewLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = safeTmcCallbackUrl(params.callbackUrl);
  const access = await getTmcReviewAccess();
  if (access.status === "ok") {
    redirect(callbackUrl);
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            ELYSIUM
          </p>
          <h1 className="font-serif text-3xl text-elysium-brown tracking-[0.12em]">
            TMC Review
          </h1>
          <p className="text-sm text-neutral-600">
            Sign in to continue. This tool is private to the client and admin.
          </p>
        </header>
        <TmcLoginForm
          callbackUrl={callbackUrl}
          passcodeEnabled={passcodeLoginConfigured()}
          error={params.error}
          forbidden={access.status === "forbidden"}
        />
      </div>
    </main>
  );
}
