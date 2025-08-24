// components/ui.ts

/** Join util */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

/** Buttons */
export function buttonClasses(...extra: string[]) {
  return cn(
    'inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-gray-50 active:translate-y-px transition',
    ...extra
  );
}

/** Inputs */
export function inputClasses(...extra: string[]) {
  return cn(
    'w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-200',
    ...extra
  );
}

/** Cards */
export function cardClasses(...extra: string[]) {
  return cn('rounded-2xl border bg-white/90 backdrop-blur shadow-soft', ...extra);
}
