interface ErrorPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

const errorMessages: Record<string, string> = {
  OAuthSignin: "There was a problem signing in with your provider.",
  OAuthCallback: "Unable to complete OAuth callback.",
  EmailCreateAccount: "We could not send a sign-in link to that email.",
  Callback: "Unable to sign you in right now. Please try again.",
  CredentialsSignin: "Invalid credentials provided.",
};

export default async function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const params = await searchParams;
  const errorKey = params?.error ?? "Callback";
  const message = errorMessages[errorKey] ?? "An unexpected error occurred.";

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 py-16">
      <div className="max-w-lg text-center space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-elysium-gold">Sign in error</p>
        <h1 className="font-serif text-4xl text-elysium-brown">We couldn&apos;t sign you in</h1>
        <p className="text-neutral-600">{message}</p>
        <a
          href="/auth/signin"
          className="inline-flex items-center justify-center rounded-xl border border-elysium-brown px-6 py-3 text-elysium-brown font-medium hover:bg-elysium-brown hover:text-white transition"
        >
          Try again
        </a>
      </div>
    </main>
  );
}
