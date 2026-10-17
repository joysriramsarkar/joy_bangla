import { Sparkle } from "lucide-react";

const ITEMS = [
  "বাংলা শিখুন",
  "Learn Bengali",
  "Aprende bengalí",
  "Apprenez le bengali",
  "Bengalisch lernen",
  "学孟加拉语",
  "ベンガル語を学ぶ",
  "تعلّم البنغالية",
  "Учите бенгальский",
  "Aprenda bengali",
  "Impara il bengalese",
  "বাংলা জানো, বিশ্ব চেনো",
];

export function Marquee() {
  return (
    <section aria-hidden="true" className="marquee border-y border-cream/10 bg-deep/70 py-5">
      <div className="marquee-track items-center">
        {[...ITEMS, ...ITEMS].map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="px-8 font-display text-2xl font-semibold text-cream/85 md:text-3xl">
              {t}
            </span>
            <Sparkle className="size-3 shrink-0 text-gold" />
          </span>
        ))}
      </div>
    </section>
  );
}
