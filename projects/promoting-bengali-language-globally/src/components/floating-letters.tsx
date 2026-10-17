const LETTERS = [
  { c: "অ", left: "4%", top: "16%", size: "9rem", o: 0.08, d: "10s" },
  { c: "ভ", left: "84%", top: "12%", size: "7rem", o: 0.07, d: "12s" },
  { c: "ম", left: "12%", top: "62%", size: "6rem", o: 0.06, d: "9s" },
  { c: "ক", left: "70%", top: "66%", size: "8rem", o: 0.07, d: "11s" },
  { c: "আ", left: "46%", top: "6%", size: "5.5rem", o: 0.05, d: "13s" },
  { c: "শ", left: "92%", top: "52%", size: "6.5rem", o: 0.06, d: "8s" },
  { c: "ন", left: "30%", top: "82%", size: "5rem", o: 0.05, d: "10s" },
  { c: "ত", left: "58%", top: "40%", size: "4.5rem", o: 0.045, d: "12s" },
];

/** Slow-drifting Bengali letterforms used as ambient background art. */
export function FloatingLetters() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {LETTERS.map((l) => (
        <span
          key={l.c + l.left}
          className="floaty absolute select-none font-display font-extrabold text-gold"
          style={{
            left: l.left,
            top: l.top,
            fontSize: l.size,
            opacity: l.o,
            ["--fd" as string]: l.d,
          }}
        >
          {l.c}
        </span>
      ))}
    </div>
  );
}
