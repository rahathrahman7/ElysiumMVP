"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

interface TmcLoginFormProps {
  callbackUrl: string;
  passcodeEnabled: boolean;
  error?: string;
  forbidden?: boolean;
}

export default function TmcLoginForm({
  callbackUrl,
  passcodeEnabled,
  error,
  forbidden,
}: TmcLoginFormProps) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | undefined>(
    forbidden
      ? "This account does not have TMC review access."
      : error
  );

  const handlePasscode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(undefined);
    try {
      const res = await fetch("/api/tmc-review/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMessage(typeof body.error === "string" ? body.error : "Invalid passcode");
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCredentials = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(undefined);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    setSubmitting(false);
    if (result?.error) {
      setMessage("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {message && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      {passcodeEnabled && (
        <form className="space-y-4" onSubmit={handlePasscode}>
          <div className="space-y-2">
            <label htmlFor="passcode" className="block text-sm font-medium text-neutral-700">
              Client passcode
            </label>
            <input
              id="passcode"
              name="passcode"
              type="password"
              autoComplete="current-password"
              required
              value={passcode}
              onChange={(event) => setPasscode(event.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-base focus:border-elysium-brown focus:outline-none focus:ring-2 focus:ring-elysium-gold/30"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-elysium-brown px-4 py-3 text-white font-medium tracking-wide transition hover:bg-elysium-brown/90 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Continue"}
          </button>
        </form>
      )}

      <form className="space-y-4" onSubmit={handleCredentials}>
        {passcodeEnabled && (
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 text-center">
            or admin email
          </p>
        )}
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
          className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-700 font-medium transition hover:border-elysium-brown hover:text-elysium-brown disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in with email"}
        </button>
      </form>
    </div>
  );
}
