import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Star, ImageOff, ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/data';
import TagPill from '@/app/components/ui/TagPill';

export default function ProjectCard({ project }: { project: Project }) {
  const visibleTags = project.tags.slice(0, 4);
  const extraTags = project.tags.length - visibleTags.length;

  return (
    <article className="group relative h-full glass-card rounded-xl overflow-hidden flex flex-col transition-colors duration-300 hover:border-accent/40 focus-within:outline focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2">
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-surface">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(135deg,var(--surface),rgba(0,0,0,0.6))]">
            <ImageOff size={28} className="text-foreground/20" aria-hidden />
          </div>
        )}
        {/* Vignette de bas d'image : accroche visuelle sans nuire à la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
        {project.featured && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-accent-amber text-xs font-semibold">
            <Star size={12} className="fill-current" aria-hidden />
            Projet phare
          </span>
        )}
      </div>

      <div className="flex flex-col grow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
          {/* Lien étiré : toute la carte mène au détail, sans imbriquer des <a> */}
          <Link
            href={`/projects/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {project.title}
          </Link>
        </h3>

        {project.description && (
          <p className="text-foreground/65 mb-4 text-sm leading-relaxed line-clamp-3 grow">
            {project.description}
          </p>
        )}

        {project.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            {visibleTags.map((tag) => (
              <TagPill key={tag} size="sm">
                {tag}
              </TagPill>
            ))}
            {extraTags > 0 && (
              <TagPill size="sm" muted>
                +{extraTags}
              </TagPill>
            )}
          </div>
        )}

        {/* Actions secondaires, au-dessus du lien étiré, d'où le z-10 */}
        <div className="relative z-10 flex items-center gap-2 mt-auto pt-3 border-t border-border">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
            Voir le projet
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
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
  );
}
