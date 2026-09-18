'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProjectCarousel from '@/app/components/ui/ProjectCarousel';
import type { Project } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

const MAX_PROJECTS = 6;

/** Aperçu des projets sur l'accueil : les phares d'abord, en carrousel. */
export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const { ref, inView } = useInView<HTMLElement>();

  const selection = [...projects]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, MAX_PROJECTS);

  if (selection.length === 0) return null;

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-background">
      <div className={`container mx-auto px-4 sm:px-6 reveal ${inView ? 'reveal-in' : ''}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Projets <span className="text-accent">phares</span>
              </h2>
              <p className="mt-2 text-foreground/70 text-sm sm:text-base">Une sélection de mes réalisations.</p>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 hover:text-accent shrink-0"
            >
              Voir tous les projets ({projects.length})
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ProjectCarousel projects={selection} />
        </div>
      </div>
    </section>
  );
}
