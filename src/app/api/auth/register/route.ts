import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });

  const res = await fetch(`${process.env.WORDPRESS_API_URL}/bgremover/v1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json({ error: data.message ?? "Registration failed" }, { status: 400 });

  return NextResponse.json({ success: true, id: data.id });
}
