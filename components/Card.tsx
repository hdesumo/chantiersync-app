import React from "react";


export default function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
return (
<div className={[
"rounded-2xl shadow-soft border border-[rgba(255,255,255,0.08)]",
"bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent),#121a2b]",
"p-6",
className,
].join(" ")}>{children}</div>
);
}
