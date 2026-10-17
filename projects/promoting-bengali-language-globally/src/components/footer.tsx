import { ArrowUp, Heart } from "lucide-react";
import { toBn } from "@/lib/bn";

const LINKS = [
  { href: "#keno", label: "কেন বাংলা" },
  { href: "#itihas", label: "ইতিহাস" },
  { href: "#ruporekha", label: "রূপরেখা" },
  { href: "#shobdo", label: "শব্দভাণ্ডার" },
  { href: "#protigga", label: "প্রতিজ্ঞা" },
  { href: "#idea", label: "আইডিয়া" },
];

export function Footer() {
  return (
    <footer className="relative">
      <div className="relative h-16 w-full overflow-hidden md:h-24">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url(/images/alpana-band.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/30 to-ink/80" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 text-center md:py-20">
        <p className="font-display text-3xl font-bold leading-snug text-cream md:text-5xl md:leading-snug">
          মোদের গরব, মোদের আশা,
          <span className="block text-gold">আ-মরি বাংলা ভাষা!</span>
        </p>
        <p className="mt-4 text-sm text-muted">
          — একুশের চেতনায় প্রজন্ম থেকে প্রজন্ম
        </p>

        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-sand/75 transition hover:text-goldsoft"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#"
            aria-label="উপরে ফিরে যান"
            className="inline-flex size-9 items-center justify-center rounded-full border border-cream/15 text-muted transition hover:border-gold hover:text-gold"
          >
            <ArrowUp className="size-4" />
          </a>
        </nav>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted md:flex-row md:px-10">
          <p>
            © {toBn(new Date().getFullYear(), false)} বাংলা বিশ্বজয় — একটি
            নিরলস ভাষা-আন্দোলন · ২১ ফেব্রুয়ারি, আন্তর্জাতিক মাতৃভাষা দিবসে
            উৎসর্গীকৃত
          </p>
          <p className="flex items-center gap-1.5">
            মাতৃভাষার জন্য, ভালোবাসার জন্য
            <Heart className="size-3.5 fill-flame text-flame" />
          </p>
        </div>
      </div>
    </footer>
  );
}
