import { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Admin Sign In — ELYSIUM",
  description: "Secure access for the ELYSIUM admin dashboard.",
};

interface SignInPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const resolvedParams = await searchParams;
  const rawCallback = resolvedParams?.callbackUrl;
  let callbackUrl = "/admin";

  if (rawCallback) {
    try {
      callbackUrl = decodeURIComponent(rawCallback);
    } catch {
      callbackUrl = rawCallback;
    }
  }
  const error = resolvedParams?.error;

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.4em] text-elysium-gold">
            Elysium Atelier
          </p>
          <h1 className="font-serif text-4xl text-elysium-brown leading-tight">
            Welcome back.
          </h1>
          <p className="text-neutral-600">
            Sign in to review performance, inquiries, and orders from the dashboard.
          </p>
        </div>

        <SignInForm callbackUrl={callbackUrl} error={error} />
      </div>
    </main>
  );
}
