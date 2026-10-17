import { desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { pledges } from "@/db/schema";
import { ensureSeeds } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeds();
    const [byCountry, recent, total] = await Promise.all([
      db
        .select({ country: pledges.country, count: sql<number>`count(*)::int` })
        .from(pledges)
        .groupBy(pledges.country)
        .orderBy(desc(sql`count(*)`), pledges.country)
        .limit(6),
      db.select().from(pledges).orderBy(desc(pledges.id)).limit(6),
      db.$count(pledges),
    ]);
    return NextResponse.json({ total, byCountry, recent });
  } catch (e) {
    console.error("pledges GET failed", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureSeeds();
    const raw: unknown = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    const body = raw as Record<string, unknown>;
    const name = String(body.name ?? "")
      .trim()
      .slice(0, 80);
    const country =
      String(body.country ?? "")
        .trim()
        .slice(0, 60) || "অন্যান্য";
    const commitment = String(body.commitment ?? "")
      .trim()
      .slice(0, 160);

    if (name.length < 2 || commitment.length < 4) {
      return NextResponse.json({ error: "validation" }, { status: 422 });
    }

    await db.insert(pledges).values({ name, country, commitment });
    const total = await db.$count(pledges);
    return NextResponse.json({ ok: true, total });
  } catch (e) {
    console.error("pledges POST failed", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
