'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from '@/app/components/ui/ProjectCard';
import type { Project } from '@/lib/data';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

/**
 * Carrousel horizontal de projets : doigt ou trackpad partout, flèches en plus
 * sur grand écran. La piste reste focalisable pour le défilement au clavier.
 */
export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const reducedMotion = useReducedMotion();

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  // L'état des flèches dépend de la largeur disponible, pas seulement du scroll.
  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [projects.length]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9 * direction, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  if (projects.length === 0) return null;

  const showArrows = canScrollPrev || canScrollNext;

  return (
    <div>
      {showArrows && (
        <div className="hidden sm:flex justify-end gap-2 mb-4">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            aria-label="Projets précédents"
            className="p-2 rounded-lg border border-border text-foreground/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label="Projets suivants"
            className="p-2 rounded-lg border border-border text-foreground/70 hover:border-accent hover:text-accent disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <ul
        ref={trackRef}
        onScroll={updateScrollState}
        role="region"
        aria-label="Projets, défilement horizontal"
        tabIndex={0}
        className={`flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 ${
          reducedMotion ? '' : 'scroll-smooth'
        }`}
      >
        {projects.map((project) => (
          <li key={project.id} className="shrink-0 snap-start w-[80%] xs:w-[20rem] sm:w-[22rem]">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  );
}
