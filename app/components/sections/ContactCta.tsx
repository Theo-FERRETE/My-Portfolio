'use client';

import Link from 'next/link';
import { ArrowRight, Download } from 'lucide-react';
import { useInView } from '@/lib/hooks/use-in-view';

/** Dernier appel à l'action de l'accueil, pour ne pas finir le scroll sur un cul-de-sac. */
export default function ContactCta() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`max-w-3xl mx-auto text-center glass-card rounded-2xl p-8 sm:p-12 reveal ${
            inView ? 'reveal-in' : ''
          }`}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground tracking-tight">
            Un projet en tête ?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-foreground/70 max-w-xl mx-auto">
            Je suis disponible pour de nouvelles missions et je réponds généralement sous 48 h.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 text-sm sm:text-base"
            >
              Me contacter
              <ArrowRight size={16} />
            </Link>
            <a
              href="/CV_Theo_Ferrete.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border border-border text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent text-sm sm:text-base"
            >
              <Download size={16} />
              Télécharger le CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
