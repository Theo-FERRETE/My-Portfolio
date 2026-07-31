'use client';

import Link from 'next/link';
import { Download, ArrowRight, ChevronDown } from 'lucide-react';
import ChromeCanvas from '@/app/components/three/ChromeCanvas';

export default function Hero({ hasContentBelow = false }: { hasContentBelow?: boolean }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-0 bg-background">
      {/* Centerpiece 3D */}
      <ChromeCanvas variant="hero" className="absolute inset-0" />

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fadeIn relative">
          {/* Vignette locale pour garder le texte lisible sans aplatir l'objet 3D */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[140%] -z-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 65% at 50% 50%, var(--background) 0%, transparent 70%)' }}
            aria-hidden
          />
          <h1 className="font-display text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-bold mb-3 sm:mb-6 text-foreground animate-slideDown leading-[0.95] tracking-tight">
            Théo Ferrete
          </h1>
          {/* Sous-titre : un <p>, pas un <h2> — ce n'est pas le titre d'une section. */}
          <p className="text-base sm:text-xl md:text-2xl font-medium text-accent mb-4 sm:mb-8 animate-slideUp uppercase tracking-[0.2em]">
            Développeur Full Stack
          </p>
          <p className="text-sm sm:text-lg text-foreground/70 max-w-xl mx-auto mb-8 sm:mb-12 animate-fadeIn delay-500">
            Je transforme du café en code.
            <br />
            Spécialisé dans la création d&apos;apps web qui fonctionnent vraiment bien.
          </p>

          {/* Une seule action principale : les deux autres sont volontairement plus discrètes. */}
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center justify-center animate-fadeIn delay-700">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 hover:scale-[1.02] motion-reduce:hover:scale-100 transition-transform duration-300 text-sm sm:text-base"
            >
              Voir mes projets
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border border-border text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent text-sm sm:text-base"
            >
              Me contacter
            </Link>
            <a
              href="/CV_Theo_Ferrete.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-2 py-3 sm:py-4 text-foreground/70 font-medium hover:text-accent text-sm sm:text-base"
            >
              <Download size={16} />
              Télécharger le CV
            </a>
          </div>
        </div>
      </div>

      {hasContentBelow && (
        <a
          href="#apercu"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 p-2 rounded-lg text-foreground/70 hover:text-accent"
        >
          <span className="text-xs uppercase tracking-[0.15em]">Découvrir</span>
          <ChevronDown size={18} className="animate-bounce motion-reduce:animate-none" aria-hidden />
        </a>
      )}
    </section>
  );
}
