// components/ui/Button.tsx
// =============================
import React from "react";


type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
variant?: "primary" | "ghost" | "subtle";
};


export default function Button({ className = "", variant = "ghost", ...props }: Props) {
const base = "inline-flex items-center gap-2 rounded-xl px-4 py-2 border transition active:scale-[.98]";
const variants = {
primary: "bg-brand text-white border-[rgba(255,255,255,0.08)] hover:opacity-95",
ghost: "bg-[#0f172a] text-text border-[rgba(255,255,255,0.08)] hover:border-brand",
subtle: "bg-cardbg text-text border-[rgba(255,255,255,0.08)] hover:border-brand",
} as const;
return <button className={[base, variants[variant], className].join(" ")} {...props} />;
}
