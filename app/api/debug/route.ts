import { NextResponse } from "next/server";

export async function GET() {
  // Check which env vars are present (don't expose values, just keys)
  const envCheck = {
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    UPSTASH_REDIS_KV_REST_API_URL: !!process.env.UPSTASH_REDIS_KV_REST_API_URL,
    UPSTASH_REDIS_KV_REST_API_TOKEN: !!process.env.UPSTASH_REDIS_KV_REST_API_TOKEN,
    UPSTASH_REDIS_KV_URL: !!process.env.UPSTASH_REDIS_KV_URL,
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
  };

  // Try Redis connection
  let redisTest = "not attempted";
  try {
    const { Redis } = await import("@upstash/redis");
    const kv = Redis.fromEnv();
    await kv.set("debug_test", "ok");
    const val = await kv.get("debug_test");
    await kv.del("debug_test");
    redisTest = val === "ok" ? "✅ connected and working" : "⚠️ connected but unexpected value";
  } catch (err: any) {
    redisTest = `❌ failed: ${err.message}`;
  }

  return NextResponse.json({ envCheck, redisTest }, { status: 200 });
}