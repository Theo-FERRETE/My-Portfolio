'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/app/components/ui/SectionHeading';
import ProjectCard from '@/app/components/ui/ProjectCard';
import type { Project } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

const MAX_FEATURED = 3;

/** Les projets marqués "phare" dans l'admin ; à défaut, les premiers publiés. */
export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const { ref, inView } = useInView<HTMLElement>();

  const featured = projects.filter((p) => p.featured);
  const selection = (featured.length > 0 ? featured : projects).slice(0, MAX_FEATURED);

  if (selection.length === 0) return null;

  return (
    <section ref={ref} className="py-20 sm:py-24 bg-background">
      <div className={`container mx-auto px-4 sm:px-6 reveal ${inView ? 'reveal-in' : ''}`}>
        <SectionHeading
          title="Projets phares"
          subtitle="Une sélection de mes réalisations."
          className="mb-12 sm:mb-14"
        />

        <ul className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selection.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:border-accent hover:text-accent text-sm sm:text-base"
          >
            Voir tous les projets ({projects.length})
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
