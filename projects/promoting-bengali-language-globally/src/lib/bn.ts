const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Convert a number to Bengali digits (with Indian-style lakh grouping). */
export function toBn(value: number | string, grouped = true): string {
  const s = String(value).replace(/[^0-9.-]/g, "");
  if (!s || s === "-") return "০";
  let body = s;
  if (grouped) {
    const neg = s.startsWith("-");
    const digits = neg ? s.slice(1) : s;
    if (digits.length > 3) {
      const last = digits.slice(-3);
      const rest = digits.slice(0, -3);
      body =
        (neg ? "-" : "") +
        rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        "," +
        last;
    }
  }
  return body.replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Bengali relative time, e.g. "৫ মিনিট আগে". */
export function timeAgoBn(input: string | Date): string {
  const then = new Date(input).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "এইমাত্র";
  if (m < 60) return `${toBn(m)} মিনিট আগে`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${toBn(h)} ঘণ্টা আগে`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${toBn(d)} দিন আগে`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${toBn(w)} সপ্তাহ আগে`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${toBn(mo)} মাস আগে`;
  return `${toBn(Math.floor(d / 365))} বছর আগে`;
}

/** Today's date in Bengali, e.g. "৪ জানুয়ারি ২০২৬". */
export function todayBn(): string {
  try {
    return new Date().toLocaleDateString("bn", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
