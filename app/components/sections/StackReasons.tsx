'use client';

import { Users, Boxes, Wrench } from 'lucide-react';
import { useInView } from '@/lib/hooks/use-in-view';

/** Ce que ces choix techniques changent pour le client ou l'équipe, sans promesse de résultat. */
const REASONS = [
  {
    icon: Boxes,
    title: 'Des outils standards',
    text: 'Next.js, TypeScript et Node font partie des technologies les plus utilisées du web. Votre projet ne dépend pas d’un outil confidentiel.',
  },
  {
    icon: Users,
    title: 'Un projet qui se transmet',
    text: 'Une autre équipe peut reprendre le code sans tout réapprendre, et les développeurs qui connaissent cette stack ne manquent pas.',
  },
  {
    icon: Wrench,
    title: 'Une seule stack de bout en bout',
    text: 'Le même langage côté interface et côté serveur : moins d’allers-retours, un seul interlocuteur pour l’ensemble.',
  },
];

export default function StackReasons() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-surface/40 border-y border-border">
      <div className={`container mx-auto px-4 sm:px-6 reveal ${inView ? 'reveal-in' : ''}`}>
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Pourquoi <span className="text-accent">cette stack</span> ?
        </h2>
        <p className="mt-4 text-center text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
          Choisir une technologie, c’est aussi choisir ce qu’elle coûtera à faire vivre.
        </p>

        <ul className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {REASONS.map((reason) => (
            <li key={reason.title} className="glass-card rounded-xl p-6 sm:p-8">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <reason.icon size={22} aria-hidden />
              </span>
              <h3 className="mt-5 text-lg sm:text-xl font-bold text-foreground">{reason.title}</h3>
              <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{reason.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
