import type { ReactNode } from 'react';

interface TagPillProps {
  children: ReactNode;
  /** 'sm' = carte projet (défaut), 'md' = page détail. */
  size?: 'sm' | 'md';
  /** Variante discrète, utilisée pour le chip "+N" en fin de liste. */
  muted?: boolean;
}

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-[11px] sm:text-xs rounded',
  md: 'px-3 py-1.5 text-xs sm:text-sm rounded-md',
};

/** Pastille de tag, partagée entre la carte projet et la page détail pour un style unique. */
export default function TagPill({ children, size = 'sm', muted = false }: TagPillProps) {
  const tone = muted
    ? 'tint text-foreground/60'
    : 'bg-accent/10 text-accent border border-accent/20';

  return (
    <span className={`font-mono font-medium ${SIZE_CLASSES[size]} ${tone}`}>{children}</span>
  );
}
