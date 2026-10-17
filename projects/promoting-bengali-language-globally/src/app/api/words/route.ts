import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { words } from "@/db/schema";
import { ensureSeeds } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSeeds();
    const all = await db.select().from(words).orderBy(asc(words.id));
    if (!all.length) {
      return NextResponse.json({ today: null, next: [] });
    }
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    const today = all[dayIndex % all.length];
    const next = [1, 2, 3, 4].map((o) => all[(dayIndex + o) % all.length]);
    return NextResponse.json({ today, next });
  } catch (e) {
    console.error("words GET failed", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
