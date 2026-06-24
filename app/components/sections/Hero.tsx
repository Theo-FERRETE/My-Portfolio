'use client';

import Link from 'next/link';
import { Download } from 'lucide-react';
import ChromeCanvas from '@/app/components/three/ChromeCanvas';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-0 bg-background">
      {/* Centerpiece 3D */}
      <ChromeCanvas variant="hero" className="absolute inset-0 opacity-80" />

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fadeIn">
          <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-bold mb-3 sm:mb-6 text-foreground animate-slideDown leading-[0.95] tracking-tight drop-shadow-[0_2px_24px_var(--background)]">
            Théo Ferrete
          </h1>
          <h2 className="text-base sm:text-xl md:text-2xl font-medium text-accent mb-4 sm:mb-8 animate-slideUp uppercase tracking-[0.2em]">
            Développeur Full Stack
          </h2>
          <p className="text-sm sm:text-lg text-foreground/60 max-w-xl mx-auto mb-8 sm:mb-12 animate-fadeIn delay-500">
            Je transforme du café en code.
            <br />
            Spécialisé dans la création d'apps web qui fonctionnent vraiment bien.
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center animate-fadeIn delay-700">
            <Link
              href="/projects"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-accent text-background rounded-full font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.02] text-xs sm:text-base"
            >
              Voir mes projets
            </Link>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 border border-border text-foreground rounded-full font-semibold hover:border-accent hover:text-accent transition-all duration-300 text-xs sm:text-base"
            >
              Me contacter
            </Link>
            <a
              href="/CV_Theo_Ferrete.pdf"
              download
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-border text-foreground/70 rounded-full font-semibold hover:border-accent hover:text-accent transition-all duration-300 text-xs sm:text-base"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Télécharger</span> CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
