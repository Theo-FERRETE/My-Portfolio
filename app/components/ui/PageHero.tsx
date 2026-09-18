import type { ReactNode } from 'react';
import Image from 'next/image';
import { AVAILABILITY_LABEL } from '@/app/components/layout/nav-items';

interface PageHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Pastille de disponibilité en tête, comme sur l'accueil. */
  showAvailability?: boolean;
  /** Photo + nom sous le texte, pour les pages où l'on veut incarner le propos. */
  showSignature?: boolean;
  /** Boutons d'action. */
  children?: ReactNode;
}

/** En-tête des pages internes, dans la lignée du Hero de l'accueil. */
export default function PageHero({
  title,
  subtitle,
  showAvailability = false,
  showSignature = false,
  children,
}: PageHeroProps) {
  return (
    <header className="relative overflow-hidden pt-36 sm:pt-44 pb-12 sm:pb-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 70% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="relative container mx-auto px-4 sm:px-6 text-center animate-fadeIn">
        {showAvailability && (
          <p className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-accent-green/30 bg-accent-green/10 text-accent-green text-xs sm:text-sm font-medium">
            <span className="relative flex w-2 h-2" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-accent-green opacity-75 animate-ping motion-reduce:animate-none" />
              <span className="relative w-2 h-2 rounded-full bg-accent-green" />
            </span>
            {AVAILABILITY_LABEL}
          </p>
        )}

        <h1 className="text-4xl xs:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-5 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        )}

        {children && <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">{children}</div>}

        {showSignature && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <Image
              src="/images/profile/avatar.png"
              alt=""
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-accent/60"
            />
            <div className="text-left">
              <p className="font-semibold text-foreground leading-tight">Théo Ferrete</p>
              <p className="text-sm text-foreground/60">Développeur Full Stack · Rognac, France</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
