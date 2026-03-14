import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
const kv = Redis.fromEnv();

const GOLDEN_KEY = "golden_qr_claimed";

export async function POST(req: NextRequest) {
  try {
    // Check if already claimed
    const existing = await kv.get<{ claimedAt: string }>(GOLDEN_KEY);

    if (existing) {
      return NextResponse.json(
        { claimed: true, claimedAt: existing.claimedAt },
        { status: 200 }
      );
    }

    // First person — mark as claimed
    const claimedAt = new Date().toISOString();
    await kv.set(GOLDEN_KEY, { claimedAt });

    return NextResponse.json({ claimed: false, claimedAt }, { status: 200 });
  } catch (err) {
    console.error("KV error:", err);
    // On KV failure, allow through — don't block the event
    return NextResponse.json({ claimed: false, claimedAt: null }, { status: 200 });
  }
}