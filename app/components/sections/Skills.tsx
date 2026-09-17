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
import { getSkillIcon } from '@/lib/skill-icons';
import type { Project, Skill } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

interface CategoryMeta {
  label: string;
  /** Ce que le domaine apporte, en une phrase neutre. */
  pitch: string;
  icon: LucideIcon;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  Frontend: { label: 'Front-end', pitch: "L'interface que voient vos utilisateurs.", icon: Monitor },
  Language: { label: 'Langages', pitch: 'Les bases sur lesquelles tout repose.', icon: Code2 },
  Backend: { label: 'Back-end', pitch: 'La logique serveur et les API.', icon: Settings },
  Database: { label: 'Bases de données', pitch: 'Le stockage et la structure des données.', icon: DatabaseIcon },
  DevOps: { label: 'Outils & déploiement', pitch: 'De mon poste à la mise en ligne.', icon: Rocket },
};

const CATEGORY_ORDER = ['Frontend', 'Language', 'Backend', 'Database', 'DevOps'];

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
}

/** Stack groupée par domaine, une carte par domaine. L'en-tête vit dans la page. */
export default function Skills({ skills, projects = [] }: SkillsProps) {
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
    <section ref={ref} aria-label="Technologies par domaine" className="pb-20 sm:pb-24 bg-background">
      <div className={`container mx-auto px-4 sm:px-6 reveal ${inView ? 'reveal-in' : ''}`}>
        {grouped.length === 0 ? (
          <p className="text-center text-foreground/60 py-16">Les compétences arrivent bientôt.</p>
        ) : (
          <ul className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped.map(({ category, items }) => {
              const meta = CATEGORY_META[category];
              const CategoryIcon = meta?.icon ?? Wrench;
              return (
                <li
                  key={category}
                  className="glass-card rounded-xl p-6 sm:p-7 transition-colors duration-300 hover:border-accent/40"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex w-11 h-11 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <CategoryIcon size={22} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">{meta?.label ?? category}</h2>
                      {meta?.pitch && <p className="mt-0.5 text-sm text-foreground/60">{meta.pitch}</p>}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-1">
                    {items.map((skill) => {
                      const { Icon, color } = getSkillIcon(skill.name);
                      const usage = usageBySkill.get(skill.name.toLowerCase()) ?? 0;
                      return (
                        <li
                          key={skill.id}
                          className="flex items-center gap-3 -mx-2 px-2 py-2 rounded-lg hover-tint"
                        >
                          <Icon size={22} color={color} aria-hidden className="shrink-0" />
                          <span className="font-semibold text-foreground text-sm truncate">{skill.name}</span>
                          {usage > 0 && (
                            <span className="ml-auto shrink-0 text-xs text-foreground/50">
                              {usage} projet{usage > 1 ? 's' : ''}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
