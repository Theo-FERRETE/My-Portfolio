'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSkillIcon } from '@/lib/skill-icons';
import type { Skill } from '@/lib/data/data-helpers';
import { useInView } from '@/lib/use-in-view';

const MAX_SHOWN = 12;

/** Bandeau compact de technos pour l'accueil — la page Compétences porte le détail. */
export default function StackStrip({ skills }: { skills: Skill[] }) {
  const { ref, inView } = useInView<HTMLElement>();

  if (skills.length === 0) return null;

  const shown = [...skills].sort((a, b) => a.order - b.order).slice(0, MAX_SHOWN);
  const remaining = skills.length - shown.length;

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-background border-y border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`max-w-5xl mx-auto reveal ${inView ? 'reveal-in' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Ma stack
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                Les technologies avec lesquelles je travaille au quotidien.
              </p>
            </div>
            <Link
              href="/skills"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline shrink-0"
            >
              Tout voir
              <ArrowRight size={15} />
            </Link>
          </div>

          <ul className="flex flex-wrap gap-2.5">
            {shown.map((skill) => {
              const { Icon, color } = getSkillIcon(skill.name);
              return (
                <li
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-full glass-card text-sm text-foreground/85"
                >
                  <Icon size={16} color={color} />
                  {skill.name}
                </li>
              );
            })}
            {remaining > 0 && (
              <li className="flex items-center px-3 py-2 rounded-full tint text-sm text-foreground/70">
                +{remaining} autres
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
