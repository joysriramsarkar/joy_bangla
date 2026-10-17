import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

const ITEMS = [
  {
    year: "প্রা. ১০ম–১২শ",
    title: "চর্যাপদ — প্রথম স্বাক্ষর",
    text: "পাল যুগের বৌদ্ধ সিদ্ধাচার্যদের রচিত চর্যাপদ বাংলা ভাষার প্রাচীনতম লিখিত নিদর্শন — হাজার বছর আগেই এ ভাষা কবিতা লিখতে জানত।",
  },
  {
    year: "১৮০১",
    title: "ফোর্ট উইলিয়াম ও গদ্যের জন্ম",
    text: "কলকাতার ফোর্ট উইলিয়াম কলেজ থেকে ছাপা বাংলা গদ্যের যাত্রা শুরু; বাংলা হয়ে ওঠে উপমহাদেশের অন্যতম আধুনিক প্রকাশনা-ভাষা।",
  },
  {
    year: "১৯১৩",
    title: "বাংলা ভাষায় প্রথম নোবেল",
    text: "বাংলায় লেখা 'গীতাঞ্জলি'-র জন্য রবীন্দ্রনাথ ঠাকুর পেলেন সাহিত্যে নোবেল — এশিয়ার প্রথম। সেদিন বিশ্ব প্রথম গভীরভাবে কান পাতল বাংলার ছন্দে।",
  },
  {
    year: "১৯৫২",
    title: "একুশে ফেব্রুয়ারি",
    text: "মাতৃভাষার মর্যাদা রক্ষায় রাজপথে প্রাণ দিলেন সালাম, বরকত, রফিক, জব্বারসহ আরও অনেকে। ভাষার জন্য প্রাণ উৎসর্গের এমন দৃষ্টান্ত বিশ্বে আর নেই।",
  },
  {
    year: "১৯৯৯",
    title: "ইউনেস্কোর স্বীকৃতি",
    text: "বাংলার ত্যাগের স্মরণে ইউনেস্কো ২১ ফেব্রুয়ারিকে ঘোষণা করল 'আন্তর্জাতিক মাতৃভাষা দিবস' — বাংলার ব্যথা হয়ে গেল সব ভাষার উদযাপন।",
  },
  {
    year: "আজ",
    title: "ডিজিটাল যুগের ডাক",
    text: "ইন্টারনেট, স্মার্টফোন আর কৃত্রিম বুদ্ধিমত্তার যুগে বাংলার লড়াই এখন স্ক্রিনে — অ্যালগরিদমে, কনটেন্টে, কোডে।",
  },
];

export function Timeline() {
  return (
    <section
      id="itihas"
      className="relative scroll-mt-24 border-y border-cream/5 bg-deep/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHead
          no="০২"
          kicker="A Thousand Years"
          title="সহস্র বছরের অভিযাত্রা"
          desc="চর্যাপদের পুঁথি থেকে 4K স্ক্রিন — বাংলা প্রতিটি যুগে নিজেকে নতুন করে লিখেছে। যে ভাষার এত গভীর শিকড়, তাকে বিশ্বজয়ের জন্য প্রস্তুত করাটাই এখন আমাদের কর্তব্য।"
        />

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-gold/60 via-cream/10 to-transparent md:left-1/2"
          />
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.year}
              delay={(i % 2) * 100}
              className={`relative mb-10 flex md:mb-14 ${
                i % 2 ? "md:justify-end" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute left-[13px] top-2.5 size-3.5 rounded-full bg-gold shadow-[0_0_18px_rgba(233,168,58,.7)] md:left-1/2 md:-translate-x-1/2"
              />
              <div className="ml-12 w-full rounded-2xl border border-cream/10 bg-panel/50 p-6 transition duration-500 hover:border-gold/35 md:ml-0 md:w-[calc(50%-2.5rem)] md:p-7">
                <div className="font-display text-3xl font-bold text-gold md:text-4xl">
                  {item.year}
                </div>
                <h3 className="mt-2 text-xl font-semibold text-cream">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-sand/80">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
