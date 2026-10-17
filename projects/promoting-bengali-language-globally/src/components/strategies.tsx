import {
  BookOpenText,
  Bot,
  Clapperboard,
  Gamepad2,
  Globe2,
  GraduationCap,
  Music4,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

type Pillar = {
  icon: LucideIcon;
  no: string;
  title: string;
  body: string;
  action: string;
};

const PILLARS: Pillar[] = [
  {
    icon: GraduationCap,
    no: "০১",
    title: "শিক্ষা-অবকাঠামো",
    body: "বিশ্বের প্রথম সারির বিশ্ববিদ্যালয়ে বাংলা বিভাগ, আসন ও স্কলারশিপ; দক্ষিণ কোরিয়ার 'কিং সেজং ইনস্টিটিউট'-এর আদলে দেশে-বিদেশে বাংলা ইনস্টিটিউটের শাখা — ভাষা ছড়ায় ক্লাসরুম থেকে।",
    action: "তোমার শহরের কলেজ বা বিশ্ববিদ্যালয়ে বাংলা কোর্সের দাবি তোলো।",
  },
  {
    icon: Bot,
    no: "০২",
    title: "প্রযুক্তি ও কৃত্রিম বুদ্ধিমত্তা",
    body: "উন্নত বাংলা NLP, ভয়েস রেকগনিশন, মেশিন অনুবাদ, ইউনিকোড ফন্ট আর উন্মুক্ত ডেটাসেট — ভাষা বেঁচে থাকে তখনই, যখন সে প্রযুক্তিতে টিকে থাকে।",
    action: "বাংলা ওপেন-সোর্স প্রকল্প আর ডেটাসেটে অবদান রাখো।",
  },
  {
    icon: Clapperboard,
    no: "০৩",
    title: "ডিজিটাল কনটেন্ট বিপ্লব",
    body: "কে-পপ যেভাবে কোরিয়ান ভাষাকে বিশ্বমঞ্চে তুলেছে, বাংলাও পৌঁছাবে ইউটিউব, পডকাস্ট, অ্যানিমেশন আর শর্ট-ভিডিওর ঢলে — মনোরঞ্জনই ভাষার দ্রুততম যান।",
    action: "সপ্তাহে অন্তত একটি বাংলা কনটেন্ট বানাও — যেকোনো মাধ্যমে।",
  },
  {
    icon: BookOpenText,
    no: "০৪",
    title: "সাহিত্যের অনুবাদ",
    body: "রবীন্দ্রনাথ-নজরুল থেকে আজকের কথাসাহিত্য — মানসম্পন্ন অনুবাদ, আন্তর্জাতিক বইমেলায় বাংলা প্যাভিলিয়ন আর অনুবাদ-পুরস্কার বিশ্বপাঠকের দরজা খুলে দেয়।",
    action: "প্রিয় বাংলা বইয়ের ইংরেজি রিভিউ লিখে বিশ্বকে জানাও।",
  },
  {
    icon: Music4,
    no: "০৫",
    title: "সংগীত, চলচ্চিত্র ও শিল্প",
    body: "ফিল্ম ফেস্টিভ্যালে বাংলা ছবি, স্ট্রিমিংয়ে সাবটাইটেলসহ বাংলা কনটেন্ট, ভাটিয়ালি-ভাওয়াইয়ার গ্লোবাল কোলাবরেশন — শিল্পই ভাষার সবচেয়ে সুন্দর দূত।",
    action: "বিদেশি বন্ধুকে একটি বাংলা গান শোনাও — অর্থসহ।",
  },
  {
    icon: Globe2,
    no: "০৬",
    title: "প্রবাসী জোয়ার",
    body: "দেড় কোটির বেশি প্রবাসী হলো ভাষার বিশ্বসেতু; দ্বিতীয় প্রজন্মের জন্য সাপ্তাহিক বাংলা-স্কুল, দ্বিভাষিক শৈশব আর কমিউনিটি উৎসব ভাষাকে বাঁচিয়ে রাখে দূরভূমিতেও।",
    action: "নিজ এলাকার প্রবাসীদের নিয়ে একটি বাংলা ক্লাব শুরু করো।",
  },
  {
    icon: UtensilsCrossed,
    no: "০৭",
    title: "খাবার, ভ্রমণ ও অভিজ্ঞতা",
    body: "'বিরিয়ানি' যেমন আরবি ভাষার প্রচারক, তেমনি 'ইলিশ', 'পিঠা', 'মিষ্টি' শব্দগুলোই বাংলার কূটনীতিক — পেটের পথ দিয়ে ভাষা ঢুকে যায় মনে।",
    action: "একজন বিদেশি বন্ধুকে বাংলা খাবার রাঁধিয়ে খাওয়াও — শব্দসহ।",
  },
  {
    icon: Gamepad2,
    no: "০৮",
    title: "গেম, অ্যাপ ও নতুন প্রজন্ম",
    body: "ডুয়োলিঙ্গো-ঢঙের বাংলা-শেখার অ্যাপ, বাংলা ভাষার গেম, সহজ কীবোর্ড ও ইনপুট-টুল — ভাষা-শেখা হোক খেলতে খেলতে, ছোটদের মাধ্যমেই।",
    action: "আজই বাংলা কীবোর্ড চালু করো, একদিন শুধু বাংলায় টাইপ করো।",
  },
];

export function Strategies() {
  return (
    <section id="ruporekha" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHead
          no="০৩"
          kicker="The Master Plan"
          title="আটটি স্তম্ভে বিশ্বজয়ের রূপরেখা"
          desc="ভালোবাসা দিয়েই কেবল ভাষা ছড়ায় না, ছড়ায় কাঠামো দিয়ে। শিক্ষা, প্রযুক্তি, শিল্প আর অর্থনীতি — চারদিক থেকে মিলিতভাবে চাপ প্রয়োগ করতে হবে। এটি সেই বাস্তব অভিঘাত-নকশা, আর প্রতিটি স্তম্ভের নিচে তোমার জন্য অপেক্ষমাণ ছোট্ট প্রথম পদক্ষেপ।"
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.no} delay={(i % 4) * 70}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-cream/10 bg-panel/50 p-6 transition duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_24px_60px_-24px_rgba(233,168,58,.3)]">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-5 select-none font-display text-7xl font-black text-cream/[0.05]"
                  >
                    {p.no}
                  </span>
                  <span className="w-fit rounded-xl border border-gold/25 bg-gold/10 p-2.5 text-gold transition duration-500 group-hover:scale-110 group-hover:text-goldsoft">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-cream">
                    {p.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-sand/80">
                    {p.body}
                  </p>
                  <div className="mt-5 flex items-start gap-2 border-t border-cream/10 pt-4 text-[13px] leading-snug text-goldsoft/90">
                    <Sparkles className="mt-0.5 size-3.5 shrink-0 text-gold" />
                    <span>{p.action}</span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
