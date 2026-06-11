import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/wordpress";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });

  const user = await registerUser(name, email, password);
  if (user.code)
    return NextResponse.json({ error: user.message }, { status: 400 });

  // Give 3 free credits on signup
  try {
    await fetch(`${process.env.WORDPRESS_API_URL}/wp/v2/users/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`bgremove:BgRemove@2026!`).toString("base64")}`,
      },
      body: JSON.stringify({ meta: { bg_credits: "3", bg_total_used: "0" } }),
    });
  } catch {}

  return NextResponse.json({ success: true, id: user.id });
}
