import type { ReactNode } from 'react';

interface StatusPageProps {
  /** Code affiché en grand, ex. "404". */
  code: string;
  title: string;
  message: string;
  /** Boutons d'action, du plus important au moins important. */
  children: ReactNode;
}

/** Gabarit commun des pages 404 et d'erreur, dans la lignée du Hero. */
export default function StatusPage({ code, title, message, children }: StatusPageProps) {
  return (
    <main
      id="contenu"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-4 sm:px-6 pt-20"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 45% 50% at 50% 45%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div className="relative text-center max-w-xl animate-fadeIn">
        <p className="text-7xl sm:text-8xl font-extrabold tracking-tight text-accent leading-none" aria-hidden>
          {code}
        </p>
        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
        <p className="mt-4 text-base sm:text-lg text-foreground/70">{message}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">{children}</div>
      </div>
    </main>
  );
}

export const PRIMARY_ACTION =
  'inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity';

export const SECONDARY_ACTION =
  'inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent';
