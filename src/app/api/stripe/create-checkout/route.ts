import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Login required" }, { status: 401 });

  const { credits, amount } = await req.json();
  if (!credits || !amount)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${credits} HD Credits — BG Remover`,
            description: `Remove background from ${credits} images in full HD quality`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success&credits=${credits}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      userId: session.user.id,
      credits: String(credits),
      wpToken: session.user.wpToken,
    },
    customer_email: session.user.email!,
  });

  return NextResponse.json({ url: checkout.url });
}
