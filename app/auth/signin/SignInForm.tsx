"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface SignInFormProps {
  callbackUrl: string;
  error?: string;
}

export default function SignInForm({ callbackUrl, error: initialError }: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>(initialError);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(undefined);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (result?.url) {
      router.push(result.url);
      router.refresh();
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <header className="text-center space-y-2">
        <h1 className="font-serif text-3xl text-elysium-brown tracking-[0.15em]">Admin Access</h1>
        <p className="text-sm text-neutral-600">
          Sign in with your ELYSIUM credentials to continue.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-base focus:border-elysium-brown focus:outline-none focus:ring-2 focus:ring-elysium-gold/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-base focus:border-elysium-brown focus:outline-none focus:ring-2 focus:ring-elysium-gold/30"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-elysium-brown px-4 py-3 text-white font-medium tracking-wide transition hover:bg-elysium-brown/90 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4">or</p>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={submitting}
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-700 font-medium transition hover:border-elysium-brown hover:text-elysium-brown disabled:opacity-60"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
