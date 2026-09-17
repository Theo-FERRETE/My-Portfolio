import type { ReactNode } from 'react';

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}

/** En-tête des pages internes, dans la lignée du Hero de l'accueil. */
export default function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <header className="relative overflow-hidden pt-36 sm:pt-44 pb-12 sm:pb-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 70% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="relative container mx-auto px-4 sm:px-6 text-center animate-fadeIn">
        <h1 className="text-4xl xs:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
