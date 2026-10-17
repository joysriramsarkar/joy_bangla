"use client";

import { CalendarDays, Languages, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { todayBn } from "@/lib/bn";

type Word = {
  id: number;
  word: string;
  transliteration: string;
  pos: string;
  meaningBn: string;
  meaningEn: string;
  example: string;
  exampleEn: string;
};

const UNTRANSLATABLE = [
  { w: "আড্ডা", g: "মেঠো গল্পগুজব" },
  { w: "অভিমান", g: "মিষ্টি রাগ" },
  { w: "মায়া", g: "মোহনীয় টান" },
  { w: "ঝিরঝির", g: "মিহি বৃষ্টির সুর" },
  { w: "আবদার", g: "ভালোবাসার জেদ" },
  { w: "হিমেল", g: "শীতের নরম স্পর্শ" },
];

export function WordOfDay() {
  const [today, setToday] = useState<Word | null>(null);
  const [next, setNext] = useState<Word[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/words")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad"))))
      .then((d) => {
        setToday(d.today ?? null);
        setNext(Array.isArray(d.next) ? d.next : []);
      })
      .catch(() => setFailed(true));
  }, []);

  return (
    <section id="shobdo" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHead
          no="০৪"
          kicker="Words of Wonder"
          title="শব্দই ভাষার প্রথম দূত"
          desc="একটি মুগ্ধকর শব্দ একজন মানুষকে ভাষা-শেখার পথে টেনে আনে। প্রতিদিন একটি করে নির্বাচিত বাংলা শব্দ — উচ্চারণ, অর্থ আর প্রসঙ্গসহ — ভাগ করে নিন বিশ্বের রসবোধউদ্দীপ স্বাদপিপাসুদের সঙ্গে।"
        />

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <div className="relative h-full overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-panel via-deep to-panel p-8 md:p-12">
              <span
                aria-hidden="true"
                className="text-stroke pointer-events-none absolute -bottom-10 -right-4 select-none font-display text-[11rem] font-black leading-none"
              >
                অ
              </span>

              <div className="relative flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold">
                  আজকের শব্দ
                </span>
                <span className="flex items-center gap-2 text-sm text-muted">
                  <CalendarDays className="size-4" />
                  {todayBn()}
                </span>
              </div>

              {!today && !failed ? (
                <div className="relative mt-10 space-y-4">
                  <div className="h-20 w-2/3 animate-pulse rounded-2xl bg-cream/10" />
                  <div className="h-4 w-1/3 animate-pulse rounded bg-cream/5" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-cream/5" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-cream/5" />
                </div>
              ) : failed ? (
                <p className="relative mt-10 text-sand/70">
                  শব্দভাণ্ডার লোড হতে ব্যর্থ — পেজটি রিফ্রেশ করে আবার চেষ্টা
                  করুন।
                </p>
              ) : today ? (
                <div className="relative">
                  <div className="mt-8 flex flex-wrap items-end gap-x-6 gap-y-3">
                    <h3 className="font-display text-7xl font-black leading-none text-gold md:text-8xl">
                      {today.word}
                    </h3>
                    <div className="pb-1.5">
                      <p className="text-lg italic text-goldsoft/90">
                        /{today.transliteration}/
                      </p>
                      <p className="mt-1.5 inline-block rounded border border-cream/15 px-2 py-0.5 text-xs text-muted">
                        {today.pos}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
                        বাংলায়
                      </p>
                      <p className="mt-2 leading-relaxed text-cream/95">
                        {today.meaningBn}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Languages className="mt-1 size-4 shrink-0 text-gold" />
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">
                          In English
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-sand/85">
                          {today.meaningEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <blockquote className="mt-8 rounded-r-2xl border-l-4 border-gold/60 bg-cream/[0.03] p-5">
                    <div className="flex items-start gap-3">
                      <Quote className="mt-1 size-4 shrink-0 text-gold/70" />
                      <div>
                        <p className="font-display text-xl text-cream">
                          {today.example}
                        </p>
                        <p className="mt-1.5 text-sm italic text-muted">
                          {today.exampleEn}
                        </p>
                      </div>
                    </div>
                  </blockquote>
                </div>
              ) : null}
            </div>
          </Reveal>

          <div className="lg:col-span-2">
            <Reveal delay={120}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-muted">
                আগামী শব্দগুলো
              </p>
              <div className="mt-5 space-y-3">
                {(next.length
                  ? next
                  : ([undefined, undefined, undefined, undefined] as (
                      | Word
                      | undefined
                    )[])
                ).map((w, i) => (
                    <div
                      key={w?.id ?? i}
                      className="group flex items-center justify-between rounded-2xl border border-cream/10 bg-panel/40 px-5 py-4 transition duration-300 hover:border-gold/30"
                    >
                      {w ? (
                        <>
                          <div>
                            <p className="font-display text-2xl font-bold text-cream transition group-hover:text-goldsoft">
                              {w.word}
                            </p>
                            <p className="mt-0.5 text-xs italic text-muted">
                              /{w.transliteration}/
                            </p>
                          </div>
                          <span className="rounded border border-cream/15 px-2 py-0.5 text-[11px] text-muted">
                            {w.pos}
                          </span>
                        </>
                      ) : (
                        <div className="h-8 w-full animate-pulse rounded bg-cream/5" />
                      )}
                    </div>
                  ),
                )}
              </div>
            </Reveal>

            <Reveal delay={220} className="mt-10">
              <h3 className="font-display text-2xl font-bold text-cream">
                যেসব শব্দ অনুবাদ চায় না
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-sand/75">
                এগুলো অন্য ভাষায় হুবহু ফেরানো যায় না — এবং এটাই বাংলার সবচেয়ে
                বড় বিক্রয়-বিন্দু: যা শুধু বাংলাতেই পাবে।
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {UNTRANSLATABLE.map((u) => (
                  <span
                    key={u.w}
                    className="rounded-full border border-gold/25 bg-gold/5 px-4 py-2 text-sm transition hover:border-gold/50 hover:bg-gold/10"
                  >
                    <b className="font-semibold text-goldsoft">{u.w}</b>
                    <span className="ml-1.5 text-xs text-muted">— {u.g}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
