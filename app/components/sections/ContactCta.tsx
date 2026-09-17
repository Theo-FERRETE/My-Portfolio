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
    <section ref={ref} className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div
          className={`relative max-w-5xl mx-auto overflow-hidden rounded-3xl border border-accent/25 glass-raised px-6 py-14 sm:px-12 sm:py-20 text-center reveal ${
            inView ? 'reveal-in' : ''
          }`}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 0%, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 70%)' }}
            aria-hidden
          />

          <div className="relative">
            <p className="inline-flex items-center gap-2 text-sm text-accent-green">
              <span className="w-2 h-2 rounded-full bg-accent-green" aria-hidden />
              {AVAILABILITY_LABEL}
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Un projet ou un poste à pourvoir ?
              <br />
              <span className="text-accent">Parlons-en.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Décrivez-moi votre besoin en quelques lignes, on voit ensemble comment avancer.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-10 py-4 bg-accent text-background rounded-lg font-semibold text-base sm:text-lg hover:opacity-90 transition-opacity shadow-[0_8px_30px_-8px_var(--accent)]"
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
