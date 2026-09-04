import type { ReactNode } from 'react';

interface SectionHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Étiquette courte façon commentaire de code, ex. "projets", "stack". */
  eyebrow?: string;
  /** `h1` sur une page dont la section est le contenu principal, `h2` sinon. */
  as?: 'h1' | 'h2';
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  eyebrow,
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p className="font-mono text-xs sm:text-sm text-accent/80 mb-3 tracking-wide" aria-hidden>
          {'// '}
          {eyebrow}
        </p>
      )}
      <Tag className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
        {title}
      </Tag>
      {subtitle && (
        <p className="mt-4 text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base px-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}
