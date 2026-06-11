import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Login required for HD download" }, { status: 401 });

  // Check credits via custom endpoint
  const creditsRes = await fetch(`${process.env.WORDPRESS_API_URL}/bgremover/v1/credits`, {
    headers: { Authorization: `Bearer ${session.user.wpToken}` },
  });
  const creditsData = await creditsRes.json();
  const credits = creditsData.credits ?? 0;

  if (credits < 1)
    return NextResponse.json({ error: "No credits. Please purchase credits." }, { status: 402 });

  // Get image from request
  const formData = await req.formData();
  const imageFile = formData.get("image") as File;
  if (!imageFile)
    return NextResponse.json({ error: "No image provided" }, { status: 400 });

  // Call remove.bg API
  const bgFormData = new FormData();
  bgFormData.append("image_file", imageFile);
  bgFormData.append("size", "auto");

  const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": process.env.REMOVE_BG_API_KEY! },
    body: bgFormData,
  });

  if (!bgRes.ok) {
    const err = await bgRes.json();
    return NextResponse.json({ error: err.errors?.[0]?.title ?? "Processing failed" }, { status: 500 });
  }

  // Deduct 1 credit via custom endpoint
  await fetch(`${process.env.WORDPRESS_API_URL}/bgremover/v1/credits/deduct`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.user.wpToken}` },
  });

  const imageBuffer = await bgRes.arrayBuffer();
  return new NextResponse(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": "attachment; filename=removed-bg.png",
      "X-Credits-Remaining": String(credits - 1),
    },
  });
}
