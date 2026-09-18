'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { useInView } from '@/lib/hooks/use-in-view';
import { AVAILABILITY_LABEL } from '@/app/components/layout/nav-items';

const EMAIL = 'theo.ferrete@gmail.com';

/**
 * Bloc de clôture : un dernier appel à l'action fort.
 * Le détail (formulaire, réseaux) vit sur la page Contact.
 */
export default function ContactCta() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="py-14 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`relative max-w-5xl mx-auto overflow-hidden rounded-2xl border border-border glass-raised px-6 py-10 sm:px-10 sm:py-12 text-center reveal ${
            inView ? 'reveal-in' : ''
          }`}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in srgb, var(--accent) 9%, transparent) 0%, transparent 70%)' }}
            aria-hidden
          />

          <div className="relative">
            <p className="inline-flex items-center gap-2 text-sm text-accent-green">
              <span className="w-2 h-2 rounded-full bg-accent-green" aria-hidden />
              {AVAILABILITY_LABEL}
            </p>
            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Alternance, poste ou projet ?
              <br />
              <span className="text-accent">Parlons-en.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto">
              Écrivez-moi en quelques lignes : on voit ensemble comment je peux vous être utile.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-background rounded-lg font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity"
              >
                Démarrer la discussion
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-accent"
              >
                <Mail size={14} aria-hidden />
                ou directement : {EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
