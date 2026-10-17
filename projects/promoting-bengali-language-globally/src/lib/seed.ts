import { db } from "@/db";
import { ideas, pledges, words } from "@/db/schema";
import { COMMITMENTS } from "@/lib/constants";

const WORD_SEEDS = [
  {
    word: "আড্ডা",
    transliteration: "adda",
    pos: "বিশেষ্য",
    meaningBn: "চা-চক্রে ছড়িয়ে যাওয়া নির্মল গল্পগুজব — বাঙালি জীবনধারার প্রাণ।",
    meaningEn:
      "A freewheeling, hours-long conversation with friends — the beating heart of Bengali social life.",
    example: "চায়ের কাপ হাতে মেঠো আড্ডায় রাত কেটে গেল।",
    exampleEn: "With a cup of tea in hand, the night slipped away in adda.",
  },
  {
    word: "মায়া",
    transliteration: "maya",
    pos: "বিশেষ্য",
    meaningBn: "কোনো কিছু ছাড়তে না পারার মোহনীয় টান; স্নেহ আর মোহের মিশ্রণ।",
    meaningEn:
      "A tender, hard-to-name attachment woven from love, longing and illusion.",
    example: "পুরনো বাড়িটার প্রতি আমার বড় মায়া।",
    exampleEn: "I feel a deep maya for our old house.",
  },
  {
    word: "অভিমান",
    transliteration: "obhimaan",
    pos: "বিশেষ্য",
    meaningBn: "ভালোবাসার মানুষের প্রতি মিষ্টি রাগ, যা মানিয়ে নেওয়ার অপেক্ষায় থাকে।",
    meaningEn:
      "A sulky grievance born of love, quietly waiting to be coaxed back.",
    example: "সংবাদ না পেলে সে অভিমান করে বসে থাকে।",
    exampleEn: "When no news arrives, she sits in obhimaan.",
  },
  {
    word: "জ্যোৎস্না",
    transliteration: "jyotsna",
    pos: "বিশেষ্য",
    meaningBn: "চাঁদের রুপালি আলোয় ধুয়ে যাওয়া রাত।",
    meaningEn: "A night bathed in silvery moonlight.",
    example: "জ্যোৎস্না রাতে পদ্মা শান্ত হয়ে থাকে।",
    exampleEn: "On moonlit nights the Padma lies calm.",
  },
  {
    word: "শ্রাবণ",
    transliteration: "srabon",
    pos: "বিশেষ্য",
    meaningBn: "বর্ষার ভরা মাস; বাংলা কবিতার সবচেয়ে প্রিয় ঋতু-চরিত্র।",
    meaningEn: "The rain-drenched monsoon month, beloved of Bengali poets.",
    example: "শ্রাবণ মাসে ধারাধার বৃষ্টি নামে।",
    exampleEn: "In Srabon the rain pours without pause.",
  },
  {
    word: "ঝিরঝির",
    transliteration: "jhirjhir",
    pos: "বিশেষণ",
    meaningBn: "মিহি বৃষ্টির একটানা সুরেলা পড়ার শব্দ ও অনুভূতি।",
    meaningEn: "The soft, rhythmic patter of a fine, endless drizzle.",
    example: "সারাদিন ঝিরঝির বৃষ্টিতে ভিজে গেল গ্রাম।",
    exampleEn: "All day the village soaked in the jhirjhir rain.",
  },
  {
    word: "উন্মেষ",
    transliteration: "unmesh",
    pos: "বিশেষ্য",
    meaningBn: "ফোটার ঠিক আগের মুহূর্ত; প্রথম বিকাশের আনন্দ।",
    meaningEn: "The very moment of unfolding; the joy of a first bloom.",
    example: "বসন্ত এলে প্রকৃতির উন্মেষ ঘটে।",
    exampleEn: "Spring brings the unmesh of nature.",
  },
  {
    word: "অপলক",
    transliteration: "apolak",
    pos: "বিশেষণ",
    meaningBn: "পলক না ফেলে বিস্ময়ে একদৃষ্টে চেয়ে থাকা।",
    meaningEn: "Gazing without blinking, in utter wonder.",
    example: "শিশুটি অপলক দৃষ্টিতে জোনাকি দেখছিল।",
    exampleEn: "The child watched the fireflies with unblinking eyes.",
  },
  {
    word: "আবদার",
    transliteration: "abdar",
    pos: "বিশেষ্য",
    meaningBn: "অন্তরঙ্গ মানুষের কাছে জেদ ধরে চাওয়া; ভালোবাসার অনুরোধ।",
    meaningEn: "An affectionate, stubborn demand one can only make of a loved one.",
    example: "নাতির আবদারে দাদু বাজারে গেলেন।",
    exampleEn: "Grandpa went to the market at his grandson's abdar.",
  },
  {
    word: "প্রীতি",
    transliteration: "priti",
    pos: "বিশেষ্য",
    meaningBn: "নিঃস্বার্থ স্নেহ; মন থেকে মনে বই যাওয়া উষ্ণতা।",
    meaningEn: "Selfless warmth flowing from one heart to another.",
    example: "প্রীতি ছাড়া বড় কোনো সম্পদ নেই।",
    exampleEn: "Without priti there is no true wealth.",
  },
  {
    word: "সাহস",
    transliteration: "sahash",
    pos: "বিশেষ্য",
    meaningBn: "ভয়কে জয় করে এগিয়ে যাওয়ার শক্তি।",
    meaningEn: "The strength to move forward despite fear.",
    example: "সাহস থাকলে সাগরও ছোট হয়।",
    exampleEn: "With courage, even the ocean shrinks.",
  },
  {
    word: "মুক্তি",
    transliteration: "mukti",
    pos: "বিশেষ্য",
    meaningBn: "সব বাঁধন ছেড়ে আসা; স্বাধীনতার আরেক নাম।",
    meaningEn: "A release from all bonds — another name for freedom.",
    example: "১৯৭১-এ বাংলাদেশ পেল মুক্তি।",
    exampleEn: "In 1971, Bangladesh won its mukti.",
  },
  {
    word: "ভোর",
    transliteration: "bhor",
    pos: "বিশেষ্য",
    meaningBn: "রাত শেষে আলো ফোটার প্রথম মুহূর্ত।",
    meaningEn: "The first moment light breaks at the end of night.",
    example: "ভোরের পাখি কাকে আগে ডাকে?",
    exampleEn: "Which bird calls first at dawn?",
  },
  {
    word: "সন্ধ্যা",
    transliteration: "shondhya",
    pos: "বিশেষ্য",
    meaningBn: "দিন আর রাতের মাঝখানের সোনালি ব্যবধান।",
    meaningEn: "The golden interlude between day and night.",
    example: "গ্রামের সন্ধ্যায় প্রদীপ জ্বলে ওঠে।",
    exampleEn: "Lamps flicker on in the village at dusk.",
  },
  {
    word: "নদী",
    transliteration: "nodi",
    pos: "বিশেষ্য",
    meaningBn: "বাংলার শিরা-উপশিরায় বই যাওয়া জীবনস্রোত।",
    meaningEn: "The lifeblood flowing through the veins of Bengal.",
    example: "মেঘনার বুকে চাঁদ ভাসে।",
    exampleEn: "The moon floats on the bosom of the Meghna.",
  },
  {
    word: "মাতৃভাষা",
    transliteration: "matribhasha",
    pos: "বিশেষ্য",
    meaningBn: "যে ভাষায় মানুষ প্রথম হাসে, প্রথম কাঁদে — পরিচয়ের শিকড়।",
    meaningEn:
      "The language of one's first laugh and first cry — the root of identity.",
    example: "২১ ফেব্রুয়ারি — আন্তর্জাতিক মাতৃভাষা দিবস।",
    exampleEn: "21 February — International Mother Language Day.",
  },
  {
    word: "স্বপ্ন",
    transliteration: "shopno",
    pos: "বিশেষ্য",
    meaningBn: "ঘুমের মাঝে বা চোখ বুজে দেখা ভবিষ্যৎ।",
    meaningEn: "What we see in sleep, or with eyes closed toward the future.",
    example: "স্বপ্ন দেখতে হয়, তবেই স্বপ্ন পূরণ হয়।",
    exampleEn: "You must first dream for dreams to come true.",
  },
  {
    word: "হিমেল",
    transliteration: "himel",
    pos: "বিশেষণ",
    meaningBn: "শীতের সকালের কুয়াশামাখা শীতল স্পর্শ।",
    meaningEn: "The misty, cool touch of a winter morning.",
    example: "হিমেল হাওয়ায় পিঠাপুলির কথা মনে পড়ে।",
    exampleEn: "The himel breeze brings back memories of winter cakes.",
  },
  {
    word: "কুয়াশা",
    transliteration: "kuasha",
    pos: "বিশেষ্য",
    meaningBn: "শিশির-জমা হালকা অস্পষ্ট আবরণ।",
    meaningEn: "A soft veil of dew-borne mist.",
    example: "ভোরে কুয়াশা ঢেকে থাকে সবুজ মাঠ।",
    exampleEn: "At dawn, mist drapes the green fields.",
  },
  {
    word: "ঝরনা",
    transliteration: "jhorna",
    pos: "বিশেষ্য",
    meaningBn: "পাহাড়ি ঢাল বেয়ে লাফ দিয়ে নামা জলধারা।",
    meaningEn: "A leaping stream running down a mountain slope.",
    example: "বান্দরবানের ঝরনায় পা ডুবিয়ে থাকি।",
    exampleEn: "We dip our feet in the waterfalls of Bandarban.",
  },
  {
    word: "মধুর",
    transliteration: "modhur",
    pos: "বিশেষণ",
    meaningBn: "মিষ্টি, শ্রুতিমধুর — বাংলা ভাষার প্রশংসায় যে শব্দটি সবার আগে আসে।",
    meaningEn:
      "Sweet, melodious — the very epithet with which Bengali itself is praised.",
    example: "মধুর কণ্ঠে মা গান গায়।",
    exampleEn: "Mother sings in a honeyed voice.",
  },
  {
    word: "পূর্ণিমা",
    transliteration: "purnima",
    pos: "বিশেষ্য",
    meaningBn: "ভরা চাঁদের রাত; বাংলা পঞ্জিকার উৎসবমুখর দিন।",
    meaningEn: "The full-moon night, festive in the Bengali calendar.",
    example: "পূর্ণিমার চাঁদ সারা রাত জ্যোৎস্না করে।",
    exampleEn: "The full moon of purnima floods the night with light.",
  },
  {
    word: "দিগন্ত",
    transliteration: "digonto",
    pos: "বিশেষ্য",
    meaningBn: "যেখানে পৃথিবী আকাশকে ছুঁয়ে যায় বোধ হয়।",
    meaningEn: "Where the earth seems to touch the sky.",
    example: "সূর্য ডুবে গেল দিগন্তের ওপারে।",
    exampleEn: "The sun sank beyond the horizon.",
  },
  {
    word: "বনলতা",
    transliteration: "bonolota",
    pos: "বিশেষ্য",
    meaningBn: "জীবনানন্দ দাশের অমর কবিতার নারী; স্নিগ্ধ সৌন্দর্যের প্রতীক।",
    meaningEn:
      "The heroine of Jibanananda Das's immortal poem — an emblem of gentle beauty.",
    example: "হাজার বছর ধরে আমি পথ হাঁটিতেছি পৃথিবীর পথে।",
    exampleEn: "For a thousand years I have walked the paths of the earth.",
  },
  {
    word: "অনন্ত",
    transliteration: "anonto",
    pos: "বিশেষণ",
    meaningBn: "শেষহীন, সীমাহীন বিস্তার।",
    meaningEn: "Endless, boundless expanse.",
    example: "আকাশের মতো অনন্ত আমাদের সম্ভাবনা।",
    exampleEn: "Our possibilities are as infinite as the sky.",
  },
  {
    word: "মিছিল",
    transliteration: "michhil",
    pos: "বিশেষ্য",
    meaningBn: "একসাথে এগিয়ে চলা মানুষের ঢল; বাংলার ইতিহাসের নিজস্ব শব্দ।",
    meaningEn:
      "A river of people marching together — a word woven into Bengal's history.",
    example: "মিছিলের ধারে ফুলের তোড়া হাতে শিশুরা।",
    exampleEn: "Children line the procession with bouquets.",
  },
  {
    word: "উত্তরণ",
    transliteration: "uttoron",
    pos: "বিশেষ্য",
    meaningBn: "এক তীর থেকে অন্য তীরে পেরিয়ে যাওয়া; কঠিনকে পেছনে ফেলা।",
    meaningEn: "A crossing over — leaving hardship behind on the other shore.",
    example: "প্রতিটি সংকটেই লুকিয়ে থাকে উত্তরণের পথ।",
    exampleEn: "Every crisis hides a path of uttoron.",
  },
  {
    word: "সৌরভ",
    transliteration: "sourabh",
    pos: "বিশেষ্য",
    meaningBn: "মাটিতে প্রথম বৃষ্টির মতো নরম, মন্ত্রমুগ্ধ সুবাস।",
    meaningEn: "A gentle, enchanting fragrance — like first rain on soil.",
    example: "শিউলির সৌরভ শরতের আগমন জানান দেয়।",
    exampleEn: "The scent of shiuli heralds the arrival of autumn.",
  },
];

const PLEDGE_SEEDS = [
  { name: "আরিফ হক", country: "বাংলাদেশ", commitment: COMMITMENTS[2], hoursAgo: 3 },
  { name: "প্রিয়া সেনগুপ্ত", country: "ভারত", commitment: COMMITMENTS[0], hoursAgo: 11 },
  { name: "Emily Carter", country: "যুক্তরাজ্য", commitment: COMMITMENTS[3], hoursAgo: 19 },
  { name: "রিনা আক্তার", country: "সংযুক্ত আরব আমিরাত", commitment: COMMITMENTS[1], hoursAgo: 26 },
  { name: "Kenji Tanaka", country: "জাপান", commitment: COMMITMENTS[4], hoursAgo: 34 },
  { name: "Markus Weber", country: "জার্মানি", commitment: COMMITMENTS[3], hoursAgo: 47 },
];

const IDEA_SEEDS = [
  {
    author: "আরিফুল ইসলাম",
    country: "যুক্তরাজ্য",
    body: "পৃথিবীর প্রতিটি বাংলা রেস্টুরেন্টের মেনুতে QR কোড — স্ক্যান করলেই খাবারের নামসহ পাঁচটি করে বাংলা বাক্যের মিনি-পাঠ।",
    votes: 22,
    hoursAgo: 96,
  },
  {
    author: "সায়ন ঘোষ",
    country: "অস্ট্রেলিয়া",
    body: "অক্সফোর্ড অভিধানের 'Word of the Year'-এ প্রতি বছর একটি বাংলা শব্দ (যেমন 'আড্ডা') মনোনীত করার জন্য বিশ্বব্যাপী প্রচারণা চালানো যায়।",
    votes: 17,
    hoursAgo: 140,
  },
  {
    author: "রুমানা পারভীন",
    country: "যুক্তরাষ্ট্র",
    body: "টাইমস স্কয়ারের দেড়শো ফুট উঁচু স্ক্রিনে অন্তত একদিন হলেও জ্বলে উঠুক — 'শিখুন বাংলা'।",
    votes: 14,
    hoursAgo: 50,
  },
  {
    author: "নাবিলা হক",
    country: "কানাডা",
    body: "জনপ্রিয় সব ভিডিও গেমে বাংলা ভাষা-প্যাক আনার জন্য গেমারদের কমিউনিটি-ক্যাম্পেইন শুরু করা যাক।",
    votes: 9,
    hoursAgo: 70,
  },
];

async function runSeeds() {
  const wordCount = await db.$count(words);
  if (wordCount === 0) {
    await db.insert(words).values(WORD_SEEDS);
  }
  const ideaCount = await db.$count(ideas);
  if (ideaCount === 0) {
    await db.insert(ideas).values(
      IDEA_SEEDS.map(({ hoursAgo, ...rest }) => ({
        ...rest,
        createdAt: new Date(Date.now() - hoursAgo * 3600_000),
      })),
    );
  }
  const pledgeCount = await db.$count(pledges);
  if (pledgeCount === 0) {
    await db.insert(pledges).values(
      PLEDGE_SEEDS.map(({ hoursAgo, ...rest }) => ({
        ...rest,
        createdAt: new Date(Date.now() - hoursAgo * 3600_000),
      })),
    );
  }
}

let seedPromise: Promise<void> | null = null;

/** Idempotently seeds demo content on first use. */
export function ensureSeeds(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeeds().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}
