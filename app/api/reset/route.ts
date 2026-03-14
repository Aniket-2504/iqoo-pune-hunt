import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
const kv = Redis.fromEnv();
const GOLDEN_KEY = "golden_qr_claimed";

// Secret reset token — change this to something only you know
const RESET_SECRET = "pune-clan-reset-2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.secret !== RESET_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await kv.del(GOLDEN_KEY);
    return NextResponse.json({ reset: true, message: "Golden QR has been reset. Ready for testing!" }, { status: 200 });
  } catch (err) {
    console.error("Reset error:", err);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}