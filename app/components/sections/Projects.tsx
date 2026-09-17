'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ImageOff, Star } from 'lucide-react';
import ProjectCard from '@/app/components/ui/ProjectCard';
import TagPill from '@/app/components/ui/TagPill';
import type { Project } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

const ALL = 'Tout';

/** Grande carte horizontale pour le projet mis en avant en tête de liste. */
function ProjectSpotlight({ project }: { project: Project }) {
  return (
    <article className="group relative mb-6 glass-raised rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] transition-colors duration-300 hover:border-accent/40 focus-within:outline focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2">
      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem] bg-surface overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageOff size={36} className="text-foreground/20" aria-hidden />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center p-6 sm:p-10">
        <p className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full border border-accent-amber/30 bg-accent-amber/10 text-accent-amber text-xs font-semibold">
          <Star size={12} className="fill-current" aria-hidden />
          À la une
        </p>
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {/* Lien étiré : toute la carte mène au détail */}
          <Link
            href={`/projects/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h2>
        {project.description && (
          <p className="mt-3 text-foreground/70 leading-relaxed line-clamp-4">{project.description}</p>
        )}
        {project.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 6).map((tag) => (
              <TagPill key={tag} size="sm">
                {tag}
              </TagPill>
            ))}
          </div>
        )}
        <span className="mt-6 inline-flex items-center gap-2 font-semibold text-accent">
          Découvrir le projet
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </article>
  );
}

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

  // Vitrine : le premier projet phare, en grand, seulement sans filtre actif.
  const spotlight = activeTag === ALL && visibleProjects[0]?.featured ? visibleProjects[0] : null;
  const gridProjects = spotlight ? visibleProjects.slice(1) : visibleProjects;

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
          <div className="max-w-6xl mx-auto">
            {spotlight && <ProjectSpotlight project={spotlight} />}
            {gridProjects.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridProjects.map((project) => (
                  <li key={project.id}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {visibleProjects.length} projet{visibleProjects.length > 1 ? 's' : ''} affiché
          {visibleProjects.length > 1 ? 's' : ''}
        </p>
      </div>
    </section>
  );
}
