'use client';

import {
  LayoutTemplate,
  Server,
  RefreshCw,
  Check,
  UserRound,
  Layers,
  Eye,
  type LucideIcon,
} from 'lucide-react';
import SectionHeading from '@/app/components/ui/SectionHeading';
import { useInView } from '@/lib/hooks/use-in-view';

interface Service {
  icon: LucideIcon;
  title: string;
  pitch: string;
  benefits: string[];
  accent: string;
}

const SERVICES: Service[] = [
  {
    icon: LayoutTemplate,
    title: 'Sites & applications web',
    pitch: "Développement d'interfaces web, de la maquette à la mise en ligne.",
    benefits: ['Design responsive', 'Attention à l’accessibilité', 'Espace d’administration'],
    accent: 'text-accent-green',
  },
  {
    icon: Server,
    title: 'API & back-end',
    pitch: 'La partie serveur : données, utilisateurs et échanges avec l’interface.',
    benefits: ['API REST', 'Authentification', 'Base de données'],
    accent: 'text-accent-amber',
  },
  {
    icon: RefreshCw,
    title: 'Évolution de projet',
    pitch: 'Intervenir sur un projet existant pour le faire avancer.',
    benefits: ['Ajout de fonctionnalités', 'Corrections', 'Tests automatisés'],
    accent: 'text-accent-teal',
  },
];

/** Arguments vérifiables uniquement : rien qui ressemble à une promesse de résultat. */
const REASONS = [
  {
    icon: UserRound,
    title: 'Autonome de bout en bout',
    text: 'Interface, API, base de données, mise en ligne : je peux intervenir sur toute la chaîne.',
  },
  {
    icon: Layers,
    title: 'Une stack répandue',
    text: 'Next.js, TypeScript, Node : des outils standards, faciles à reprendre par une autre équipe.',
  },
  {
    icon: Eye,
    title: 'Un travail visible',
    text: 'Projets consultables en ligne et code source sur GitHub : jugez sur pièce.',
  },
];

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-surface/40 border-y border-border">
      <div className={`container mx-auto px-4 sm:px-6 reveal ${inView ? 'reveal-in' : ''}`}>
        <SectionHeading
          title="Ce que je fais"
          subtitle="Pour une équipe qui recrute ou un projet à lancer, du front au back."
          className="mb-12 sm:mb-14"
        />

        <ul className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <li
              key={service.title}
              className="glass-card rounded-xl p-6 sm:p-8 flex flex-col transition-colors duration-300 hover:border-accent/40"
            >
              <span className={`inline-flex w-12 h-12 items-center justify-center rounded-lg tint ${service.accent}`}>
                <service.icon size={24} aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-bold text-foreground">{service.title}</h3>
              <p className="mt-2 text-sm sm:text-base text-foreground/70 leading-relaxed">{service.pitch}</p>
              <ul className="mt-5 pt-5 border-t border-border space-y-2.5">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="max-w-6xl mx-auto mt-16 sm:mt-20">
          <h3 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Pourquoi <span className="text-accent">moi</span> ?
          </h3>
          <ul className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {REASONS.map((reason) => (
              <li key={reason.title} className="flex gap-4">
                <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <reason.icon size={20} aria-hidden />
                </span>
                <div>
                  <h4 className="font-bold text-foreground">{reason.title}</h4>
                  <p className="mt-1 text-sm text-foreground/70 leading-relaxed">{reason.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
