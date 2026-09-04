'use client';

import { useMemo } from 'react';
import {
  Monitor,
  Settings,
  Database as DatabaseIcon,
  Code2,
  Rocket,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import SectionHeading from '@/app/components/ui/SectionHeading';
import { getSkillIcon } from '@/lib/skill-icons';
import type { Project, Skill } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Frontend: Monitor,
  Backend: Settings,
  Database: DatabaseIcon,
  Language: Code2,
  DevOps: Rocket,
};

const CATEGORY_ORDER = ['Frontend', 'Language', 'Backend', 'Database', 'DevOps'];

/** Rotation des accents "syntaxe" par catégorie, plutôt qu'un unique --accent. */
const CATEGORY_ACCENT = ['text-accent-green', 'text-accent-amber', 'text-accent-teal'];

/** Décalage vertical par colonne, cohérent avec l'effet appliqué aux grilles de projets. */
const OFFSET_2COL = ['translate-y-0', 'translate-y-4'];
const OFFSET_3COL = ['sm:translate-y-0', 'sm:translate-y-4', 'sm:-translate-y-3'];
const OFFSET_4COL = ['md:translate-y-0', 'md:translate-y-5', 'md:-translate-y-3', 'md:translate-y-2'];

/** Trie les catégories connues d'abord, puis les autres par ordre alphabétique. */
function sortCategories(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

interface SkillsProps {
  skills: Skill[];
  /** Sert à indiquer sur combien de projets chaque techno a servi. */
  projects?: Project[];
  headingLevel?: 'h1' | 'h2';
}

export default function Skills({ skills, projects = [], headingLevel = 'h2' }: SkillsProps) {
  const { ref, inView } = useInView<HTMLElement>();

  const usageBySkill = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tag of project.tags) {
        const key = tag.toLowerCase();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    return counts;
  }, [projects]);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, Skill[]>();
    for (const skill of skills) {
      const list = byCategory.get(skill.category) ?? [];
      list.push(skill);
      byCategory.set(skill.category, list);
    }
    for (const list of byCategory.values()) list.sort((a, b) => a.order - b.order);
    return sortCategories([...byCategory.keys()]).map((category) => ({
      category,
      items: byCategory.get(category)!,
    }));
  }, [skills]);

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`reveal ${inView ? 'reveal-in' : ''}`}>
          <SectionHeading
            as={headingLevel}
            eyebrow="cat ./stack.json"
            title="Ma stack"
            subtitle="Les technologies avec lesquelles je travaille au quotidien, regroupées par domaine."
            className="mb-12 sm:mb-16"
          />

          {grouped.length === 0 ? (
            <p className="text-center text-foreground/60 py-16">
              Les compétences arrivent bientôt.
            </p>
          ) : (
            <div className="max-w-6xl mx-auto space-y-14 sm:space-y-16">
              {grouped.map(({ category, items }, index) => {
                const CategoryIcon = CATEGORY_ICON[category] ?? Wrench;
                const accent = CATEGORY_ACCENT[index % CATEGORY_ACCENT.length];
                return (
                  <div key={category}>
                    <h3 className="flex items-center gap-2 font-mono text-sm font-semibold uppercase tracking-[0.15em] text-foreground/60 mb-4">
                      <CategoryIcon size={16} className={accent} />
                      {category}
                      <span className="grow h-px bg-border ml-2" aria-hidden />
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10">
                      {items.map((skill, skillIndex) => {
                        const { Icon, color } = getSkillIcon(skill.name);
                        const usage = usageBySkill.get(skill.name.toLowerCase()) ?? 0;
                        return (
                          <div
                            key={skill.id}
                            className={`group glass-card p-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:border-accent/40 ${OFFSET_2COL[skillIndex % 2]} ${OFFSET_3COL[skillIndex % 3]} ${OFFSET_4COL[skillIndex % 4]}`}
                          >
                            <span className="p-2.5 rounded-lg tint shrink-0 group-hover:bg-accent/10 transition-colors duration-300">
                              <Icon size={24} color={color} />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-mono font-semibold text-foreground text-sm truncate">
                                {skill.name}
                              </span>
                              {usage > 0 && (
                                <span className="block text-xs text-foreground/60">
                                  {usage} projet{usage > 1 ? 's' : ''}
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
