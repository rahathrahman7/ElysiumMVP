import { Resend } from "resend";
import type { Order, OrderItem } from "@prisma/client";
import { env, requireEnv } from "@/lib/env";

type OrderWithItems = Order & { items: OrderItem[] };

function getResendClient(): Resend | null {
  if (!env.RESEND_API_KEY) return null;
  return new Resend(env.RESEND_API_KEY);
}

function formatGbp(amount: { toString(): string } | number): string {
  const value = typeof amount === "number" ? amount : Number(amount.toString());
  return `£${value.toFixed(2)}`;
}

function formatConfiguration(configuration: unknown): string {
  if (!configuration || typeof configuration !== "object") {
    return "None";
  }

  return Object.entries(configuration as Record<string, unknown>)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
    .join("\n    ");
}

function formatOrderItems(items: OrderItem[]): string {
  return items
    .map((item, index) => {
      const config = formatConfiguration(item.configuration);
      return [
        `${index + 1}. ${item.productSlug}`,
        `   Quantity: ${item.quantity}`,
        `   Unit price: ${formatGbp(item.unitPriceGbp)}`,
        `   Line total: ${formatGbp(item.totalPriceGbp)}`,
        `   Configuration:`,
        `    ${config}`,
      ].join("\n");
    })
    .join("\n\n");
}

export function buildAdminOrderNotificationText(order: OrderWithItems): string {
  const adminUrl = `${env.NEXT_PUBLIC_SITE_URL}/admin/orders`;

  return `
New Order Received — ${order.orderNumber}

ORDER DETAILS
Order number: ${order.orderNumber}
Status: ${order.status}
Date: ${order.createdAt.toISOString()}
Total: ${formatGbp(order.totalAmountGbp)}

CUSTOMER
Name: ${order.customerName || "Not provided"}
Email: ${order.customerEmail}

ITEMS
${formatOrderItems(order.items)}

View in admin: ${adminUrl}
`.trim();
}

export async function sendAdminOrderNotification(order: OrderWithItems): Promise<boolean> {
  const resend = getResendClient();
  const to = env.ADMIN_NOTIFICATION_EMAIL;

  if (!resend || !to) {
    console.warn("Order notification skipped: RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not configured");
    return false;
  }

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: `New order ${order.orderNumber} — ${formatGbp(order.totalAmountGbp)}`,
    text: buildAdminOrderNotificationText(order),
  });

  return true;
}

export async function sendAdminNotificationEmail(params: {
  subject: string;
  text: string;
  to?: string;
}): Promise<boolean> {
  const resend = getResendClient();
  const to = params.to || env.ADMIN_NOTIFICATION_EMAIL;

  if (!resend || !to) {
    console.warn("Admin notification skipped: RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not configured");
    return false;
  }

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: params.subject,
    text: params.text,
  });

  return true;
}

export async function sendWaitlistSignupNotification(email: string, source: string): Promise<boolean> {
  const resend = getResendClient();
  const to = env.ADMIN_NOTIFICATION_EMAIL;

  if (!resend || !to) {
    return false;
  }

  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject: `New waitlist signup — ${source}`,
    text: `A new waitlist signup was received.\n\nEmail: ${email}\nSource: ${source}`,
  });

  return true;
}

export function requireResendApiKey(): string {
  return requireEnv("RESEND_API_KEY");
}
