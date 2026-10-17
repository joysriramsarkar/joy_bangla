"use client";

import {
  CircleCheck,
  Loader2,
  Send,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { timeAgoBn, toBn } from "@/lib/bn";
import { COMMITMENTS, COUNTRIES } from "@/lib/constants";

type Recent = {
  id: number;
  name: string;
  country: string;
  commitment: string;
  createdAt: string;
};

type Payload = {
  total: number;
  byCountry: { country: string; count: number }[];
  recent: Recent[];
};

const inputCls =
  "w-full rounded-xl border border-cream/15 bg-ink/60 px-4 py-3 text-cream placeholder:text-muted/60 outline-none transition focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export function PledgeSection() {
  const [data, setData] = useState<Payload | null>(null);
  const [name, setName] = useState("");
  const [country, setCountry] = useState<string>(COUNTRIES[0]);
  const [commitment, setCommitment] = useState<string>(COMMITMENTS[0]);
  const [posting, setPosting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const load = () =>
    fetch("/api/pledges")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad"))))
      .then((d: Payload) => setData(d))
      .catch(() => setData({ total: 0, byCountry: [], recent: [] }));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (posting) return;
    if (name.trim().length < 2) {
      setError("অনুগ্রহ করে তোমার নাম লেখো।");
      return;
    }
    setError("");
    setPosting(true);
    try {
      const r = await fetch("/api/pledges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), country, commitment }),
      });
      if (!r.ok) throw new Error("failed");
      setDone(true);
      setName("");
      await load();
      window.setTimeout(() => setDone(false), 6000);
    } catch {
      setError("একটু পরে আবার চেষ্টা করো — সংযোগে সমস্যা হচ্ছে।");
    } finally {
      setPosting(false);
    }
  };

  const maxCount = Math.max(1, ...(data?.byCountry.map((c) => c.count) ?? [1]));

  return (
    <section
      id="protigga"
      className="relative scroll-mt-24 overflow-hidden border-t border-cream/5 py-24 md:py-32"
    >
      <span
        aria-hidden="true"
        className="text-stroke-faint pointer-events-none absolute -top-8 right-0 hidden select-none font-display text-[15rem] font-black leading-none lg:block"
      >
        অঙ্গীকার
      </span>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <SectionHead
          no="০৬"
          kicker="Take the Pledge"
          title="একটি প্রতিজ্ঞাই শুরু হোক বিপ্লব"
          desc="বড় আন্দোলনের শুরু বড় পরিকল্পনা দিয়ে নয়, একজন মানুষের ছোট্ট অঙ্গীকার দিয়ে। তোমার প্রতিজ্ঞাটি লিপিবদ্ধ হোক এই দেওয়ালে — পৃথিবীর কোন কোণ থেকে কতজন যুক্ত হচ্ছে, দেখো নিজের চোখে।"
        />

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <form
              onSubmit={submit}
              className="rounded-3xl border border-gold/20 bg-gradient-to-b from-panel to-deep p-7 md:p-9"
            >
              <h3 className="font-display text-2xl font-bold text-cream">
                আমি প্রতিজ্ঞা করছি
              </h3>
              <p className="mt-1.5 text-sm text-muted">
                একজনকে হলেও বাংলা শেখানোর অঙ্গীকার — সেটাই বিশ্বজয়ের প্রথম ইট।
              </p>

              <div className="mt-7 space-y-5">
                <div>
                  <label
                    htmlFor="pledge-name"
                    className="mb-1.5 block text-sm font-medium text-sand"
                  >
                    তোমার নাম
                  </label>
                  <input
                    id="pledge-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    placeholder="যেমন: মীনা চক্রবর্তী"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label
                    htmlFor="pledge-country"
                    className="mb-1.5 block text-sm font-medium text-sand"
                  >
                    তুমি কোথা থেকে এসেছো?
                  </label>
                  <select
                    id="pledge-country"
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
                </div>

                <div>
                  <span className="mb-2 block text-sm font-medium text-sand">
                    তোমার প্রতিজ্ঞা
                  </span>
                  <div className="space-y-2">
                    {COMMITMENTS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCommitment(c)}
                        className={`block w-full rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                          commitment === c
                            ? "border-gold bg-gold/15 font-medium text-goldsoft"
                            : "border-cream/15 text-sand/80 hover:border-cream/30"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <p className="text-sm text-flame">{error}</p>
                ) : null}
                {done ? (
                  <p className="flex items-center gap-2 rounded-xl border border-leaf/40 bg-leaf/10 px-4 py-3 text-sm text-leaf">
                    <CircleCheck className="size-4 shrink-0" />
                    শুভেচ্ছা! তোমার প্রতিজ্ঞা বিশ্ব-দেওয়ালে যুক্ত হয়েছে।
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={posting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-semibold text-ink transition hover:bg-goldsoft disabled:opacity-60"
                >
                  {posting ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      প্রতিজ্ঞা সম্পন্ন করুন
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-relaxed text-muted/70">
                  তোমার নাম শুধুমাত্র এই প্রতিজ্ঞা-তালিকায় প্রদর্শিত হবে।
                </p>
              </div>
            </form>
          </Reveal>

          <div className="lg:col-span-3">
            <Reveal delay={100}>
              <div className="flex flex-wrap items-end gap-x-5">
                <span className="font-display text-7xl font-black leading-none text-gold md:text-8xl">
                  <CountUp value={data?.total ?? 0} />
                </span>
                <p className="pb-2.5 leading-snug text-muted">
                  জন ভাষাপ্রেমী
                  <br />
                  ইতিমধ্যে প্রতিজ্ঞাবদ্ধ
                </p>
              </div>
            </Reveal>

            <Reveal delay={180} className="mt-9">
              <h4 className="text-sm font-semibold text-cream/90">
                কোন দেশ থেকে কতজন যুক্ত হলেন
              </h4>
              <div className="mt-4 space-y-2.5">
                {(data?.byCountry.length ? data.byCountry : []).map((c) => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="w-28 shrink-0 truncate text-sm text-sand/85 md:w-36">
                      {c.country}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold transition-[width] duration-1000"
                        style={{ width: `${Math.max(6, (c.count / maxCount) * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-sm font-semibold text-goldsoft">
                      {toBn(c.count)}
                    </span>
                  </div>
                ))}
                {!data ? (
                  <div className="space-y-2.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-6 animate-pulse rounded bg-cream/5"
                      />
                    ))}
                  </div>
                ) : null}
                {data && !data.byCountry.length ? (
                  <p className="text-sm text-muted">
                    প্রথম প্রতিজ্ঞাটি তোমারই হোক।
                  </p>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={260} className="mt-9">
              <h4 className="text-sm font-semibold text-cream/90">
                সাম্প্রতিক প্রতিজ্ঞার দেওয়াল
              </h4>
              <div className="mt-4 space-y-3">
                {(data?.recent ?? []).slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start gap-3.5 rounded-2xl border border-cream/10 bg-panel/30 p-4"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-lg font-bold text-gold">
                      {p.name.trim().charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-cream">
                        {p.name}{" "}
                        <span className="font-normal text-muted">
                          — {p.country}
                        </span>
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-sand/75">
                        {p.commitment}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-muted">
                      {timeAgoBn(p.createdAt)}
                    </span>
                  </div>
                ))}
                {data && !data.recent.length ? (
                  <p className="text-sm text-muted">
                    দেওয়ালটি এখন ফাঁকা — প্রথম নামটি লেখাটাই তোমার সৌভাগ্য।
                  </p>
                ) : null}
                {!data ? (
                  <div className="space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-16 animate-pulse rounded-2xl bg-cream/5"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
