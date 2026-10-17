import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { IdeasBoard } from "@/components/ideas-board";
import { Marquee } from "@/components/marquee";
import { MiniLesson } from "@/components/mini-lesson";
import { Nav } from "@/components/nav";
import { PledgeSection } from "@/components/pledge-section";
import { Stats } from "@/components/stats";
import { Strategies } from "@/components/strategies";
import { Timeline } from "@/components/timeline";
import { WordOfDay } from "@/components/word-of-day";

function AlpanaBand({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-14 w-full bg-cover bg-center md:h-20 ${className}`}
      style={{ backgroundImage: "url(/images/alpana-band.jpg)" }}
    />
  );
}

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Marquee />
      <Stats />
      <Timeline />
      <Strategies />
      <AlpanaBand className="opacity-80" />
      <WordOfDay />
      <MiniLesson />
      <PledgeSection />
      <IdeasBoard />
      <Footer />
    </main>
  );
}
