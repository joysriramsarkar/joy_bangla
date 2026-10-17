"use client";

import { ArrowBigUp, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { timeAgoBn, toBn } from "@/lib/bn";
import { COUNTRIES } from "@/lib/constants";

type Idea = {
  id: number;
  author: string;
  country: string;
  body: string;
  votes: number;
  createdAt: string;
};

const inputCls =
  "w-full rounded-xl border border-cream/15 bg-ink/60 px-4 py-3 text-cream placeholder:text-muted/60 outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

const VOTED_KEY = "bd_world_voted_ids";
const VOTER_KEY = "bd_world_voter_key";

export function IdeasBoard() {
  const [list, setList] = useState<Idea[] | null>(null);
  const [author, setAuthor] = useState("");
  const [country, setCountry] = useState<string>(COUNTRIES[0]);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [voted, setVoted] = useState<Record<number, boolean>>({});
  const voterRef = useRef<string>("");

  useEffect(() => {
    try {
      let k = localStorage.getItem(VOTER_KEY);
      if (!k) {
        k =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `v_${Math.random().toString(36).slice(2)}${Date.now()}`;
        localStorage.setItem(VOTER_KEY, k);
      }
      voterRef.current = k;
      const saved = JSON.parse(localStorage.getItem(VOTED_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        setVoted(
          saved.reduce<Record<number, boolean>>((acc, id) => {
            acc[Number(id)] = true;
            return acc;
          }, {}),
        );
      }
    } catch {
      /* storage blocked */
    }

    fetch("/api/ideas")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad"))))
      .then((d) => setList(Array.isArray(d.ideas) ? d.ideas : []))
      .catch(() => setList([]));
  }, []);

  const markVoted = (id: number) => {
    setVoted((prev) => {
      const next = { ...prev, [id]: true };
      try {
        localStorage.setItem(VOTED_KEY, JSON.stringify(Object.keys(next)));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const vote = async (id: number) => {
    if (voted[id] || !voterRef.current) return;
    const prev = list;
    setList((l) =>
      l
        ? l
            .map((it) => (it.id === id ? { ...it, votes: it.votes + 1 } : it))
            .sort((a, b) => b.votes - a.votes || b.id - a.id)
        : l,
    );
    markVoted(id);
    try {
      const r = await fetch(`/api/ideas/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterKey: voterRef.current }),
      });
      if (!r.ok) throw new Error("bad");
    } catch {
      setList(prev);
      setVoted((v) => {
        const clone = { ...v };
        delete clone[id];
        return clone;
      });
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (posting) return;
    if (author.trim().length < 2) {
      setError("নামটি একটু বড় করে লেখো।");
      return;
    }
    if (body.trim().length < 8) {
      setError("আইডিয়াটি একটু বিস্তারিত লেখো (অন্তত ৮ অক্ষর)।");
      return;
    }
    setError("");
    setPosting(true);
    try {
      const r = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          country,
          body: body.trim(),
        }),
      });
      if (!r.ok) throw new Error("bad");
      const d = await r.json();
      if (d.idea) setList((l) => [d.idea, ...(l ?? [])]);
      setBody("");
      setAuthor("");
    } catch {
      setError("সংরক্ষণ করা গেল না — একটু পরে আবার চেষ্টা করো।");
    } finally {
      setPosting(false);
    }
  };

  return (
    <section
      id="idea"
      className="relative scroll-mt-24 border-t border-cream/5 bg-deep/30 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHead
          no="০৭"
          kicker="The Idea Wall"
          title="বিশ্বজয়ের পরের বড় আইডিয়াটি হতে পারে তোমার"
          desc="কমিউনিটির এই দেওয়াল জমা হোক সাহসী পরিকল্পনায় — যেটি সবচেয়ে বেশি সমর্থন পাবে, সেটিই আগামীর অভিযান। তোমার পছন্দের আইডিয়ায় ভোট দাও, নিজেরটা যুক্ত করো।"
        />

        <div className="grid gap-10 lg:grid-cols-3">
          <Reveal>
            <form
              onSubmit={submit}
              className="rounded-3xl border border-cream/10 bg-panel/50 p-7"
            >
              <h3 className="font-display text-xl font-bold text-cream">
                তোমার আইডিয়া যুক্ত করো
              </h3>
              <div className="mt-5 space-y-4">
                <input
                  aria-label="তোমার নাম"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={80}
                  placeholder="তোমার নাম"
                  className={inputCls}
                />
                <select
                  aria-label="দেশ"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputCls}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <div>
                  <textarea
                    aria-label="আইডিয়া"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="বাংলাকে বিশ্বমঞ্চে তোলার তোমার আইডিয়াটি লেখো..."
                    className={`${inputCls} resize-none`}
                  />
                  <p className="mt-1 text-right text-[11px] text-muted/70">
                    {toBn(body.length, false)}/৫০০
                  </p>
                </div>

                {error ? <p className="text-sm text-flame">{error}</p> : null}

                <button
                  type="submit"
                  disabled={posting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-ink transition hover:bg-goldsoft disabled:opacity-60"
                >
                  {posting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      জমা হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      আইডিয়া জমা দিন
                    </>
                  )}
                </button>
              </div>
            </form>
          </Reveal>

          <div className="lg:col-span-2">
            <div className="space-y-4">
              {list === null ? (
                [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-2xl bg-cream/5"
                  />
                ))
              ) : list.length ? (
                list.map((idea, idx) => (
                  <Reveal key={idea.id} delay={Math.min(idx, 6) * 50}>
                    <div className="flex gap-4 rounded-2xl border border-cream/10 bg-panel/40 p-5 transition duration-300 hover:border-gold/25">
                      <button
                        type="button"
                        onClick={() => vote(idea.id)}
                        disabled={!!voted[idea.id]}
                        aria-label="সমর্থন করুন"
                        className={`flex flex-col items-center gap-0.5 self-start rounded-xl border px-3 py-2 transition ${
                          voted[idea.id]
                            ? "border-gold/60 bg-gold/15 text-gold"
                            : "border-cream/15 text-sand hover:border-gold/40 hover:text-goldsoft"
                        }`}
                      >
                        <ArrowBigUp className="size-5" />
                        <span className="text-sm font-bold">
                          {toBn(idea.votes)}
                        </span>
                      </button>
                      <div className="min-w-0">
                        <p className="leading-relaxed text-cream/95">
                          {idea.body}
                        </p>
                        <p className="mt-2.5 text-xs text-muted">
                          <span className="font-medium text-sand/85">
                            {idea.author}
                          </span>{" "}
                          — {idea.country} · {timeAgoBn(idea.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))
              ) : (
                <p className="rounded-2xl border border-dashed border-cream/15 p-8 text-center text-muted">
                  দেওয়াল এখন ফাঁকা — প্রথম আইডিয়াটি লেখার সম্মান তোমার।
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
