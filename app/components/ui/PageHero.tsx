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
    <header className="relative overflow-hidden pt-28 sm:pt-32 pb-8 sm:pb-12">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 70% at 50% 0%, color-mix(in srgb, var(--accent) 7%, transparent) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="relative container mx-auto px-4 sm:px-6 text-center animate-fadeIn">
        {showAvailability && (
          <p className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-accent-green/30 bg-accent-green/10 text-accent-green text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-accent-green" aria-hidden />
            {AVAILABILITY_LABEL}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-foreground leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-5 text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
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
