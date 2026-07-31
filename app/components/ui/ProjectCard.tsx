'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, Star } from 'lucide-react';
import type { Project } from '@/lib/data/data-helpers';
import { useReducedMotion } from '@/lib/use-reduced-motion';

/** Inclinaison au survol — neutralisée si l'utilisateur demande moins de mouvement. */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none"
    >
      {children}
    </div>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const visibleTags = project.tags.slice(0, 3);
  const extraTags = project.tags.length - visibleTags.length;

  return (
    <TiltCard>
      <article className="group relative h-full glass-card rounded-xl overflow-hidden flex flex-col transition-colors duration-300 hover:border-accent/40 focus-within:outline focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2">
        {/* Visuel — affiché en couleur d'entrée de jeu : c'est le travail à montrer,
            et un effet réservé au survol ne se déclenche jamais sur mobile. */}
        <div className="h-40 sm:h-48 bg-surface relative overflow-hidden shrink-0">
          {project.image.startsWith('/') ? (
            // Chemin local (upload admin) : next/image optimise automatiquement.
            <Image
              src={project.image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            // URL externe : domaine non garanti dans next.config.ts remotePatterns,
            // on reste sur <img> pour ne pas casser l'affichage si le domaine change.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-surface/80 via-surface/10 to-transparent" aria-hidden />

          {project.featured && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent text-background text-xs font-semibold">
              <Star size={12} className="fill-current" />
              Projet phare
            </span>
          )}
        </div>

        <div className="p-4 sm:p-6 flex flex-col grow">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-foreground line-clamp-2">
            {/* Lien étiré : toute la carte mène au détail, sans imbriquer des <a> */}
            <Link
              href={`/projects/${project.id}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </Link>
          </h3>

          <p className="text-foreground/70 mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3 grow">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="px-2 sm:px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
              >
                {tag}
              </span>
            ))}
            {extraTags > 0 && (
              <span className="px-2 sm:px-3 py-1 text-xs font-medium tint text-foreground/60 rounded-full">
                +{extraTags}
              </span>
            )}
          </div>

          {/* Actions secondaires — au-dessus du lien étiré, d'où le z-10 */}
          <div className="relative z-10 flex items-center gap-2 mt-auto">
            <span className="text-sm font-semibold text-accent group-hover:underline">
              Voir le projet
            </span>
            <span className="grow" />
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ouvrir ${project.title} en ligne`}
                className="p-2 rounded-lg border border-border text-foreground/70 hover:border-accent hover:text-accent"
              >
                <ExternalLink size={16} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Code source de ${project.title} sur GitHub`}
                className="p-2 rounded-lg border border-border text-foreground/70 hover:border-accent hover:text-accent"
              >
                <Github size={16} />
              </a>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
