'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProjectCard from '@/app/components/ui/ProjectCard';
import SectionHeading from '@/app/components/ui/SectionHeading';
import type { Project } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

/**
 * Aperçu de projets pour l'accueil. Pas de ChromeCanvas ici : la page porte déjà
 * celui du Hero, et chaque canvas supplémentaire est un contexte WebGL de plus.
 */
export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const { ref, inView } = useInView<HTMLElement>();

  if (projects.length === 0) return null;

  return (
    <section ref={ref} id="apercu" className="py-20 sm:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className={`reveal ${inView ? 'reveal-in' : ''}`}>
          <SectionHeading
            title="Projets récents"
            subtitle="Un aperçu de ce que je construis en ce moment."
            className="mb-10 sm:mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:border-accent hover:text-accent text-sm sm:text-base"
            >
              Voir tous les projets
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
