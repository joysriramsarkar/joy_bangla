"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";
import { toBn } from "@/lib/bn";

const STATS = [
  {
    value: 27,
    grouped: false,
    suffix: " কোটি+",
    title: "ভাষাভাষী সারা পৃথিবীতে",
    note: "মাতৃভাষী ও দ্বিতীয় ভাষাভাষী মিলিয়ে বাংলা-পরিবার দুনিয়ার অন্যতম বড় ভাষা-শক্তি।",
  },
  {
    value: 6,
    grouped: false,
    suffix: "ষ্ঠ",
    title: "বিশ্বের সর্বাধিক কথিত ভাষার তালিকায়",
    note: "ইংরেজি, চীনা, হিন্দি, স্প্যানিশ, ফরাসির ঠিক পরেই বাংলার অবস্থান।",
  },
  {
    value: 2,
    grouped: false,
    suffix: "টি",
    title: "জাতীয় সংগীত রচিত বাংলা ভাষায়",
    note: "বাংলাদেশের 'আমার সোনার বাংলা' ও ভারতের 'জনগণমন' — এক ভাষা, দুই জাতির বুকের স্পন্দন।",
  },
  {
    value: 1952,
    grouped: false,
    suffix: "",
    title: "ভাষা আন্দোলনের বছর",
    note: "মাতৃভাষার মর্যাদা রক্ষায় প্রাণ দেওয়ার এমন উদাহরণ পৃথিবীর ইতিহাসে আর নেই।",
  },
];

function Num({
  v,
  started,
  grouped,
  duration = 1800,
}: {
  v: number;
  started: boolean;
  grouped: boolean;
  duration?: number;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(v * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, v, duration]);

  return <>{toBn(n, grouped)}</>;
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="keno" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHead
          no="০১"
          kicker="Why Bengali"
          title="কেন বিশ্বকে বাংলা জানাতে হবে?"
          desc="ভাষা কেবল কথা বলার মাধ্যম নয় — সে হলো হাজার বছরের স্মৃতি, কাব্য আর পরিচয়ের বাহক। সংখ্যাগুলোই প্রমাণ করে, বাংলা কোনো ক্ষুদ্র ভাষা নয়; এটি একটি বিশ্ব-ভাষা — শুধু সঠিক মঞ্চের অপেক্ষায়।"
        />

        <div ref={ref} className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.title + s.value} delay={i * 90}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-cream/10 bg-panel/60 p-7 transition duration-500 hover:-translate-y-1.5 hover:border-gold/40">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3 -top-7 select-none font-display text-8xl font-black text-cream/[0.04]"
                >
                  {toBn(s.value, false)}
                </span>
                <div className="font-display text-6xl font-black text-gold md:text-7xl">
                  <Num
                    v={s.value}
                    started={started}
                    grouped={s.grouped}
                    duration={s.value > 100 ? 2200 : 1600}
                  />
                  <span className="text-3xl md:text-4xl">{s.suffix}</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-cream">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10">
          <p className="max-w-3xl border-l-2 border-gold/50 pl-5 text-sm italic leading-relaxed text-sand/80 md:text-base">
            “আমার ভাইয়ের রক্তে রাঙানো একুশে ফেব্রুয়ারি, আমি কি ভুলিতে পারি...”
            — যে ভাষার জন্য মানুষ জীবন উৎসর্গ করেছে, সেই ভাষা বিশ্বের কাছে তার
            বক্তব্য রাখার যোগ্যতা রাখে।
          </p>
        </Reveal>
      </div>
    </section>
  );
}
