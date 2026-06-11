import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, credits, wpToken } = session.metadata!;

    // Get current credits
    const userRes = await fetch(
      `${process.env.WORDPRESS_API_URL}/wp/v2/users/${userId}?context=edit`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`bgremove:BgRemove@2026!`).toString("base64")}`,
        },
      }
    );
    const user = await userRes.json();
    const current = parseInt(user.meta?.bg_credits ?? "0");
    const newCredits = current + parseInt(credits);

    // Update credits
    await fetch(`${process.env.WORDPRESS_API_URL}/wp/v2/users/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`bgremove:BgRemove@2026!`).toString("base64")}`,
      },
      body: JSON.stringify({ meta: { bg_credits: String(newCredits) } }),
    });
  }

  return NextResponse.json({ received: true });
}
