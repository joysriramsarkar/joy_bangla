import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export function SectionHead({
  no,
  kicker,
  title,
  desc,
}: {
  no: string;
  kicker: string;
  title: ReactNode;
  desc?: string;
}) {
  return (
    <Reveal className="mb-14 md:mb-20">
      <div className="flex items-center gap-4">
        <span className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-sm font-semibold text-gold">
          {no}
        </span>
        <span className="h-px w-10 bg-gold/40" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.42em] text-muted">
          {kicker}
        </span>
      </div>
      <h2 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.15] text-cream md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {desc ? (
        <p className="mt-5 max-w-2xl leading-relaxed text-sand/85">{desc}</p>
      ) : null}
    </Reveal>
  );
}
