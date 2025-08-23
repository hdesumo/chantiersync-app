export function cardClasses(extra = "") {
  return [
    "rounded-2xl shadow-soft border border-[rgba(255,255,255,0.08)]",
    "bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent),#121a2b]",
    "p-6", extra
  ].join(" ");
}

export function buttonClasses(
  variant: "primary"|"ghost"|"subtle" = "ghost",
  extra = ""
) {
  const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 border transition active:scale-[.98]";
  const variants = {
    primary: "bg-brand text-white border-[rgba(255,255,255,0.08)] hover:opacity-95",
    ghost:   "bg-[#0f172a] text-text border-[rgba(255,255,255,0.08)] hover:border-brand",
    subtle:  "bg-cardbg text-text border-[rgba(255,255,255,0.08)] hover:border-brand",
  } as const;
  return [base, variants[variant], extra].join(" ");
}
