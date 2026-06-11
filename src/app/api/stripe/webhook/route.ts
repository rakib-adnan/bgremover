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
    const { userId, credits } = session.metadata!;

    // Add credits via custom admin endpoint
    await fetch(`${process.env.WORDPRESS_API_URL}/bgremover/v1/credits/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BG-Admin-Key": process.env.WORDPRESS_JWT_SECRET!,
      },
      body: JSON.stringify({ user_id: userId, credits: parseInt(credits) }),
    });
  }

  return NextResponse.json({ received: true });
}
