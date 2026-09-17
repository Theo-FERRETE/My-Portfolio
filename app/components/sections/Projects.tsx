'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '@/app/components/ui/ProjectCard';
import SectionHeading from '@/app/components/ui/SectionHeading';
import type { Project } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

const ALL = 'Tout';

interface ProjectsProps {
  projects: Project[];
  headingLevel?: 'h1' | 'h2';
}

export default function Projects({ projects, headingLevel = 'h2' }: ProjectsProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const [activeTag, setActiveTag] = useState(ALL);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const reducedMotion = useReducedMotion();

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

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  // Un filtre plus court ne doit pas laisser l'utilisateur au milieu d'un scroll vide.
  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 });
    updateScrollState();
  }, [activeTag, visibleProjects.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9 * direction, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`reveal ${inView ? 'reveal-in' : ''}`}>
          <SectionHeading
            as={headingLevel}
            eyebrow="ls ./projets"
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
            <div className="max-w-7xl mx-auto">
              {/* Navigation du carrousel : au clavier/pointeur sur desktop, le tactile suffit en dessous */}
              <div className="hidden sm:flex justify-end gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Projet précédent"
                  className="p-2 rounded-lg border border-border text-foreground/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  disabled={!canScrollNext}
                  aria-label="Projet suivant"
                  className="p-2 rounded-lg border border-border text-foreground/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div
                ref={trackRef}
                onScroll={updateScrollState}
                role="region"
                aria-label="Liste des projets, défilement horizontal"
                tabIndex={0}
                className={`flex gap-6 sm:gap-8 overflow-x-auto snap-x snap-mandatory pb-4 ${reducedMotion ? '' : 'scroll-smooth'}`}
              >
                {visibleProjects.map((project) => (
                  <div key={project.id} className="shrink-0 snap-start w-[85%] xs:w-[22rem] sm:w-[24rem]">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
