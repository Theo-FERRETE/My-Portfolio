'use client';

import { useMemo, useState } from 'react';
import ChromeCanvas from '@/app/components/three/ChromeCanvas';
import ProjectCard from '@/app/components/ui/ProjectCard';
import SectionHeading from '@/app/components/ui/SectionHeading';
import type { Project } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

const ALL = 'Tout';

interface ProjectsProps {
  projects: Project[];
  headingLevel?: 'h1' | 'h2';
}

export default function Projects({ projects, headingLevel = 'h2' }: ProjectsProps) {
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

  const visibleProjects = useMemo(
    () => (activeTag === ALL ? projects : projects.filter((p) => p.tags.includes(activeTag))),
    [projects, activeTag]
  );

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* 3D plein format */}
      <ChromeCanvas
        variant="projects"
        visible={inView}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`reveal ${inView ? 'reveal-in' : ''}`}>
          <SectionHeading
            as={headingLevel}
            title="Mes Projets"
            subtitle="Quelques trucs sur lesquels j'ai bossé récemment"
            className="mb-10 sm:mb-12"
          />

          {showFilters && (
            <div
              className="flex flex-wrap justify-center gap-2 mb-10"
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
                    className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {visibleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
