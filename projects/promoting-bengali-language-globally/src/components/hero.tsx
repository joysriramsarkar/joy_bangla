"use client";

import { ArrowDown, HandHeart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FloatingLetters } from "@/components/floating-letters";
import { toBn } from "@/lib/bn";

const STRIP = [
  { v: "২৭ কোটি+", l: "ভাষাভাষী সারা বিশ্বে" },
  { v: "৬ষ্ঠ", l: "সর্বাধিক কথিত ভাষা" },
  { v: "২টি", l: "জাতীয় সংগীত বাংলায়" },
  { v: "২১ ফেব্রুয়ারি", l: "আন্তর্জাতিক মাতৃভাষা দিবস" },
];

export function Hero() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/pledges")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.total === "number") setTotal(d.total);
      })
      .catch(() => undefined);
  }, []);

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden">
      <Image
        src="/images/hero-calligraphy.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/30 to-ink" />
      <div className="vignette absolute inset-0" />
      <FloatingLetters />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-14 pt-32 md:px-10">
        <p
          className="rise flex items-center gap-3 text-sm font-medium text-goldsoft/90 md:text-base"
          style={{ animationDelay: "150ms" }}
        >
          <span className="h-px w-10 bg-gold/60" />
          ভাষা শহীদদের স্বপ্নে — একটি বিশ্বব্যাপী আবাহন
        </p>

        <h1 className="mt-6">
          <span
            className="rise block font-display text-[clamp(4rem,13vw,10.5rem)] font-black leading-[1.02] text-gold"
            style={{ animationDelay: "300ms" }}
          >
            বাংলা
          </span>
          <span
            className="rise mt-2 block font-display text-[clamp(1.9rem,5.2vw,4.2rem)] font-bold leading-[1.2] text-cream"
            style={{ animationDelay: "470ms" }}
          >
            এবার বিশ্বজয়ের পালা।
          </span>
        </h1>

        <p
          className="rise mt-7 max-w-2xl text-base leading-relaxed text-sand md:text-lg"
          style={{ animationDelay: "640ms" }}
        >
          প্রায় সাতাশ কোটি মানুষের হৃদয়ের ভাষাকে পৌঁছে দিতে চাই পৃথিবীর
          প্রতিটি প্রান্তে। এটি শুধু একটি ওয়েবসাইট নয় — একটি রূপরেখা, একটি
          আন্দোলন, আর একটি প্রতিজ্ঞা।
        </p>

        <div
          className="rise mt-9 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "800ms" }}
        >
          <a
            href="#protigga"
            className="inline-flex items-center gap-2.5 rounded-full bg-gold px-7 py-3.5 font-semibold text-ink shadow-[0_10px_45px_-8px_rgba(233,168,58,.55)] transition hover:bg-goldsoft"
          >
            <HandHeart className="size-5" />
            প্রতিজ্ঞা করুন
          </a>
          <a
            href="#ruporekha"
            className="group inline-flex items-center gap-2 rounded-full border border-cream/20 px-7 py-3.5 font-medium text-cream/90 backdrop-blur-sm transition hover:border-gold/50 hover:text-goldsoft"
          >
            রূপরেখা দেখুন
            <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>

        {total !== null && total > 0 ? (
          <p
            className="rise mt-7 inline-flex items-center gap-2.5 text-sm text-sand"
            style={{ animationDelay: "950ms" }}
          >
            <span className="pulse-dot inline-block size-2 rounded-full bg-leaf text-leaf" />
            ইতিমধ্যে{" "}
            <span className="font-semibold text-goldsoft">
              {toBn(total)} জন
            </span>{" "}
            ভাষাপ্রেমী প্রতিজ্ঞায় যুক্ত হয়েছেন
          </p>
        ) : null}
      </div>

      <div className="relative z-10 border-t border-cream/10 bg-ink/55 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {STRIP.map((s, i) => (
            <div
              key={s.v}
              className={`px-4 py-5 text-center md:px-8 md:py-6 md:text-left ${
                i > 0 ? "border-l border-cream/5" : ""
              } ${i === 2 ? "max-md:border-l-0" : ""}`}
            >
              <p className="font-display text-xl font-bold text-goldsoft md:text-2xl">
                {s.v}
              </p>
              <p className="mt-1 text-[11px] text-muted md:text-xs">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
