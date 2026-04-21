import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    const buildIdPath = path.join(process.cwd(), ".next", "BUILD_ID");
    const buildId = fs.readFileSync(buildIdPath, "utf8").trim();
    return NextResponse.json({ buildId });
  } catch {
    return NextResponse.json({ buildId: "development" });
  }
}
