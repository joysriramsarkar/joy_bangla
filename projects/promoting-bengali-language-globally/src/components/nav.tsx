"use client";

import { HandHeart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#keno", label: "কেন বাংলা" },
  { href: "#itihas", label: "ইতিহাস" },
  { href: "#ruporekha", label: "রূপরেখা" },
  { href: "#shobdo", label: "শব্দভাণ্ডার" },
  { href: "#idea", label: "আইডিয়া" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-cream/10 bg-ink/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
        <a href="#" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold font-display text-2xl font-black text-ink shadow-[0_6px_24px_-6px_rgba(233,168,58,.6)] transition-transform duration-300 group-hover:-rotate-6">
            ব
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-cream">
              বাংলা বিশ্বজয়
            </span>
            <span className="block text-[9px] font-semibold uppercase tracking-[0.32em] text-muted">
              Bangla for the world
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-sand/85 transition hover:text-goldsoft"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#protigga"
            className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-goldsoft sm:inline-flex"
          >
            <HandHeart className="size-4" />
            প্রতিজ্ঞা করুন
          </a>
          <button
            type="button"
            aria-label="মেনু"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-xl border border-cream/15 text-cream lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-cream/10 bg-deep/95 px-5 py-4 backdrop-blur-md lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-cream/90 transition hover:bg-cream/5 hover:text-goldsoft"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
