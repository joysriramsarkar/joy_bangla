import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { ideas, ideaVotes } from "@/db/schema";
import { ensureSeeds } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await ensureSeeds();
    const { id: idParam } = await params;
    const id = Number.parseInt(idParam, 10);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }
    const body = raw as Record<string, unknown>;
    const voterKey = String(body.voterKey ?? "")
      .trim()
      .slice(0, 120);
    if (!voterKey) {
      return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    const existing = await db
      .select({ id: ideaVotes.id })
      .from(ideaVotes)
      .where(eq(ideaVotes.ideaId, id) && eq(ideaVotes.voterKey, voterKey))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(ideaVotes).values({ ideaId: id, voterKey });
      await db.update(ideas).set({ votes: sql${ideas.votes} + 1 }).where(eq(ideas.id, id));
    }

    const [row] = await db
      .select({ votes: ideas.votes })
      .from(ideas)
      .where(eq(ideas.id, id))
      .limit(1);

    return NextResponse.json({ ok: true, votes: row?.votes ?? 0 });
  } catch (e) {
    console.error("ideas vote failed", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
