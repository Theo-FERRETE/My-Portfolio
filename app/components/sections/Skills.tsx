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
import ChromeCanvas from '@/app/components/three/ChromeCanvas';
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
      {/* 3D plein format */}
      <ChromeCanvas
        variant="skills"
        visible={inView}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`reveal ${inView ? 'reveal-in' : ''}`}>
          <SectionHeading
            as={headingLevel}
            title="Ma stack"
            subtitle="Les technologies avec lesquelles je travaille au quotidien, regroupées par domaine."
            className="mb-12 sm:mb-16"
          />

          {grouped.length === 0 ? (
            <p className="text-center text-foreground/60 py-16">
              Les compétences arrivent bientôt.
            </p>
          ) : (
            <div className="max-w-6xl mx-auto space-y-10">
              {grouped.map(({ category, items }) => {
                const CategoryIcon = CATEGORY_ICON[category] ?? Wrench;
                return (
                  <div key={category}>
                    <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-foreground/60 mb-4">
                      <CategoryIcon size={16} className="text-accent" />
                      {category}
                      <span className="grow h-px bg-border ml-2" aria-hidden />
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                      {items.map((skill) => {
                        const { Icon, color } = getSkillIcon(skill.name);
                        const usage = usageBySkill.get(skill.name.toLowerCase()) ?? 0;
                        return (
                          <div
                            key={skill.id}
                            className="group glass-card p-4 rounded-xl flex items-center gap-3 transition-colors duration-300 hover:border-accent/40"
                          >
                            <span className="p-2.5 rounded-lg tint shrink-0 group-hover:bg-accent/10 transition-colors duration-300">
                              <Icon size={24} color={color} />
                            </span>
                            <span className="min-w-0">
                              <span className="block font-semibold text-foreground text-sm truncate">
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
