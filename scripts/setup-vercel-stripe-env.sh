#!/usr/bin/env bash
# Push Stripe test env vars to Vercel. Run after: vercel login
set -euo pipefail

cd "$(dirname "$0")/.."

if ! vercel whoami >/dev/null 2>&1; then
  echo "Run 'vercel login' first, then re-run this script."
  exit 1
fi

# Load from .env.local if present
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

: "${STRIPE_SECRET_KEY:?STRIPE_SECRET_KEY not set in .env.local}"
: "${STRIPE_PUBLISHABLE_KEY:?STRIPE_PUBLISHABLE_KEY not set in .env.local}"
: "${STRIPE_WEBHOOK_SECRET:?STRIPE_WEBHOOK_SECRET not set in .env.local}"

add_env() {
  local name="$1"
  local value="$2"
  for env in production preview development; do
    printf '%s' "$value" | vercel env add "$name" "$env" --force
    echo "Set $name for $env"
  done
}

add_env STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY"
add_env STRIPE_PUBLISHABLE_KEY "$STRIPE_PUBLISHABLE_KEY"
add_env STRIPE_WEBHOOK_SECRET "$STRIPE_WEBHOOK_SECRET"
add_env NEXT_PUBLIC_SITE_URL "${NEXT_PUBLIC_SITE_URL:-https://elysium-mvp.vercel.app}"
add_env RESEND_FROM_EMAIL "${RESEND_FROM_EMAIL:-onboarding@resend.dev}"

if [[ -n "${ADMIN_NOTIFICATION_EMAIL:-}" ]]; then
  add_env ADMIN_NOTIFICATION_EMAIL "$ADMIN_NOTIFICATION_EMAIL"
fi

if [[ -n "${RESEND_API_KEY:-}" ]]; then
  add_env RESEND_API_KEY "$RESEND_API_KEY"
fi

echo "Done. Redeploy with: vercel --prod"
