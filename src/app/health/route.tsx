import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  const now = new Date();
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return NextResponse.json({
    status: "ok",
    uptime: `${uptimeSeconds}s`,
    timestamp: now.toISOString(),
    unix: Math.floor(now.getTime() / 1000),
  });
}
