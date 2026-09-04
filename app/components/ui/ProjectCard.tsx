import Link from 'next/link';
import { Github, ExternalLink, Star } from 'lucide-react';
import type { Project } from '@/lib/data';

/** Rotation stable des accents "syntaxe", dépend de l'id, pas de la position
    dans la liste, pour ne pas changer de couleur au fil d'un filtre. */
const DOT_COLORS = ['bg-accent-green', 'bg-accent-amber', 'bg-accent-teal'];

export default function ProjectCard({ project }: { project: Project }) {
  const visibleTags = project.tags.slice(0, 4);
  const extraTags = project.tags.length - visibleTags.length;
  const dotColor = DOT_COLORS[project.id % DOT_COLORS.length];

  return (
    <article className="group relative h-full glass-card rounded-xl overflow-hidden flex flex-col p-4 sm:p-6 transition-colors duration-300 hover:border-accent/40 focus-within:outline focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2">
      <div className="flex items-center gap-2.5 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} aria-hidden />
        <h3 className="font-mono text-base sm:text-lg font-semibold text-foreground truncate">
          {/* Lien étiré : toute la carte mène au détail, sans imbriquer des <a> */}
          <Link
            href={`/projects/${project.id}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {project.title}/
          </Link>
        </h3>
        {project.featured && (
          <span
            className="ml-auto inline-flex items-center gap-1 shrink-0 text-xs font-medium text-accent-amber"
            title="Projet phare"
          >
            <Star size={12} className="fill-current" />
          </span>
        )}
      </div>

      <p className="text-foreground/70 mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3 grow">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="font-mono px-2 py-0.5 text-[11px] sm:text-xs font-medium bg-accent/10 text-accent rounded"
          >
            {tag}
          </span>
        ))}
        {extraTags > 0 && (
          <span className="font-mono px-2 py-0.5 text-[11px] sm:text-xs font-medium tint text-foreground/60 rounded">
            +{extraTags}
          </span>
        )}
      </div>

      {/* Actions secondaires, au-dessus du lien étiré, d'où le z-10 */}
      <div className="relative z-10 flex items-center gap-2 mt-auto pt-3 border-t border-border">
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
    </article>
  );
}
