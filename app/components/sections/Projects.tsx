'use client';

import { useMemo, useState } from 'react';
import ProjectCard from '@/app/components/ui/ProjectCard';
import type { Project } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

const ALL = 'Tout';

/** Liste complète des projets : filtres par techno puis grille. L'en-tête vit dans la page. */
export default function Projects({ projects }: { projects: Project[] }) {
  const { ref, inView } = useInView<HTMLElement>();
  const [activeTag, setActiveTag] = useState(ALL);

  // Un filtre n'a d'intérêt qu'au-delà de quelques projets et de quelques technos.
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tag of project.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tag]) => tag);
  }, [projects]);

  const showFilters = projects.length >= 4 && tags.length >= 3;

  // Les projets phares d'abord, l'ordre d'origine ensuite.
  const visibleProjects = useMemo(() => {
    const filtered = activeTag === ALL ? projects : projects.filter((p) => p.tags.includes(activeTag));
    return [...filtered].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [projects, activeTag]);

  return (
    <section ref={ref} aria-label="Liste des projets" className="pb-20 sm:pb-24 bg-background">
      <div className={`container mx-auto px-4 sm:px-6 reveal ${inView ? 'reveal-in' : ''}`}>
        {showFilters && (
          <div
            className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12"
            role="group"
            aria-label="Filtrer les projets par technologie"
          >
            {[ALL, ...tags].map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={active}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium border ${
                    active
                      ? 'border-accent bg-accent/15 text-accent'
                      : 'border-border text-foreground/70 hover:border-accent/50 hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {visibleProjects.length === 0 ? (
          <p className="text-center text-foreground/60 py-16">
            {projects.length === 0
              ? 'Les projets arrivent bientôt.'
              : `Aucun projet ne correspond à « ${activeTag} ».`}
          </p>
        ) : (
          <ul className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}

        <p className="sr-only" aria-live="polite">
          {visibleProjects.length} projet{visibleProjects.length > 1 ? 's' : ''} affiché
          {visibleProjects.length > 1 ? 's' : ''}
        </p>
      </div>
    </section>
  );
}
