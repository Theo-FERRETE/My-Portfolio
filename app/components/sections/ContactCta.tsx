'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/lib/hooks/use-in-view';

/**
 * Ligne de clôture de l'accueil : juste de quoi ne pas finir le scroll sur un
 * cul-de-sac. Le détail (formulaire, réseaux, CV) vit sur la page Contact.
 */
export default function ContactCta() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="pb-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <p
          className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm sm:text-base text-foreground/70 reveal ${
            inView ? 'reveal-in' : ''
          }`}
        >
          Un projet en tête ?
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
          >
            Écrivez-moi
            <ArrowRight size={15} />
          </Link>
        </p>
      </div>
    </section>
  );
}
