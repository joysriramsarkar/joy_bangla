"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

const PHRASES = [
  { bn: "আপনি কেমন আছেন?", tr: "apni kemon achhen?", en: "How are you?" },
  { bn: "আমি বাংলা শিখছি", tr: "ami bangla shikhchhi", en: "I am learning Bengali" },
  { bn: "আপনার নাম কী?", tr: "apnar naam ki?", en: "What is your name?" },
  { bn: "ভালোবাসি", tr: "bhalobashi", en: "I love you" },
  { bn: "ধন্যবাদ", tr: "dhonnobad", en: "Thank you" },
  { bn: "চা খাবেন?", tr: "cha khaben?", en: "Would you like some tea?" },
  { bn: "দারুণ!", tr: "darun!", en: "Awesome!" },
  { bn: "আবার দেখা হবে", tr: "abar dekha hobe", en: "See you again" },
];

export function MiniLesson() {
  const [copied, setCopied] = useState<number | null>(null);

  const copy = async (i: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      window.setTimeout(
        () => setCopied((c) => (c === i ? null : c)),
        1600,
      );
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="relative border-t border-cream/5 bg-deep/30 py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHead
          no="০৫"
          kicker="First Phrases"
          title="সাতটি বাক্য দিয়েই শুরু হোক"
          desc="ভাষা-প্রচারের প্রথম ধাপ হলো কৌতূহল জাগানো। যেকোনো বাক্য কপি করে বিদেশি বন্ধুকে পাঠিয়ে দিন — আপনিই হলেন বাংলার প্রথম দূত।"
        />

        <div className="grid gap-3.5 md:grid-cols-2">
          {PHRASES.map((p, i) => (
            <Reveal key={p.bn} delay={(i % 2) * 60}>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-cream/10 bg-panel/40 px-5 py-4 transition duration-300 hover:border-gold/30">
                <div>
                  <p className="font-display text-xl font-bold text-cream md:text-2xl">
                    {p.bn}
                  </p>
                  <p className="mt-0.5 text-xs italic text-muted">/{p.tr}/</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="hidden text-right text-sm text-sand/80 sm:block">
                    {p.en}
                  </p>
                  <button
                    type="button"
                    aria-label="কপি করুন"
                    onClick={() => copy(i, `${p.bn} — ${p.tr} — ${p.en}`)}
                    className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition ${
                      copied === i
                        ? "border-leaf/60 bg-leaf/10 text-leaf"
                        : "border-cream/15 text-muted hover:border-gold hover:text-gold"
                    }`}
                  >
                    {copied === i ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
