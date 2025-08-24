// utilitaires de style simples, sans lib externe

export function buttonClasses(extra?: string) {
  return [
    'inline-flex items-center justify-center',
    'px-3 py-2 rounded-lg',
    'bg-[#0f172a] hover:bg-[#0b1220]',
    'border border-white/10',
    'text-white',
    'transition',
    extra || '',
  ]
    .filter(Boolean)
    .join(' ');
}

export function cardClasses(extra?: string) {
  return [
    'rounded-xl',
    'border border-white/10',
    'bg-white/[0.02]',
    'backdrop-blur-sm',
    'p-4',
    extra || '',
  ]
    .filter(Boolean)
    .join(' ');
}
