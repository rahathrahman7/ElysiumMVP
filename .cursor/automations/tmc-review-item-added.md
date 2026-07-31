# Cursor Automation — TMC Review — item added

Create this at https://cursor.com/automations/new (cloud agents cannot create Automations via API).

## Settings

| Field | Value |
|-------|--------|
| **Name** | `TMC Review — item added` |
| **Trigger** | Incoming HTTP webhook |
| **Repository** | No repository (notify-only) — or `rahathrahman7/ElysiumMVP` if required |
| **Tools** | Defaults fine. Do **not** require PR creation for this notify-only run. |

## Prompt (paste into the automation)

```text
A client just added a piece in the TMC review configurator.

Read the webhook JSON body. Only act if event is "tmc_review.added". Otherwise stop briefly noting the ignored event.

Summarize the added piece in 3–5 lines using these fields when present:
- title / displayName — ELYSIUM name
- tmcName — original TMC product name
- category — e.g. Engagement, Fine Jewellery — Earrings
- preferredMetal, priceGbp, notes
- handle
- reviewUrl — link to the configurator

Remind me to open reviewUrl if I need to review their options.
Keep it concise.
Optionally include a short email-style summary block at the end.
Do not modify the repository or open a pull request.
```

## After save

1. Copy the **webhook URL** (and API key if shown).
2. In Vercel → Project **elysium-mvp** → Settings → Environment Variables, set:
   - `TMC_REVIEW_WEBHOOK_URL` = the webhook URL
   - `TMC_REVIEW_WEBHOOK_API_KEY` = the API key (if Cursor shows one)
   - Confirm also set: `DATABASE_URL`, `RESEND_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`
3. Redeploy production.

## Payload the app sends (`POST /api/tmc-review` → webhook)

```json
{
  "event": "tmc_review.added",
  "title": "Arabella",
  "displayName": "Arabella",
  "tmcName": "The Emilia Ring - Radiant and Pear Trilogy",
  "category": "Engagement",
  "preferredMetal": "yellow",
  "priceGbp": "Check Spreadsheet",
  "notes": "...",
  "handle": "the-emilia-ring-radiant-and-pear-trilogy",
  "reviewUrl": "https://elysium-mvp.vercel.app/tmc-review"
}
```
