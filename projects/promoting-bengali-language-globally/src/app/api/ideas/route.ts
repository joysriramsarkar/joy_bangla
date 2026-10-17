import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { ideas } from "@/db/schema";
import { ensureSeeds } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeds();
    const rows = await db
      .select()
      .from(ideas)
      .orderBy(desc(ideas.votes), desc(ideas.id))
      .limit(40);
    return NextResponse.json({ ideas: rows });
  } catch (e) {
    console.error("ideas GET failed", e);
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
    const author = String(body.author ?? "")
      .trim()
      .slice(0, 80);
    const country =
      String(body.country ?? "")
        .trim()
        .slice(0, 60) || "অন্যান্য";
    const text = String(body.body ?? "")
      .trim()
      .slice(0, 500);

    if (author.length < 2 || text.length < 8) {
      return NextResponse.json({ error: "validation" }, { status: 422 });
    }

    const [idea] = await db
      .insert(ideas)
      .values({ author, country, body: text })
      .returning();
    return NextResponse.json({ ok: true, idea });
  } catch (e) {
    console.error("ideas POST failed", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
