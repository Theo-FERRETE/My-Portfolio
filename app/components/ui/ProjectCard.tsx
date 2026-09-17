import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink, Star, ImageOff } from 'lucide-react';
import type { Project } from '@/lib/data';
import { previewFilename } from '@/lib/preview-filename';
import EditorWindow from '@/app/components/ui/EditorWindow';
import TagPill from '@/app/components/ui/TagPill';

/** Rotation stable des accents "syntaxe", dépend de l'id, pas de la position
    dans la liste, pour ne pas changer de couleur au fil d'un filtre. */
const DOT_COLORS = ['bg-accent-green', 'bg-accent-amber', 'bg-accent-teal'];

export default function ProjectCard({ project }: { project: Project }) {
  const visibleTags = project.tags.slice(0, 4);
  const extraTags = project.tags.length - visibleTags.length;
  const dotColor = DOT_COLORS[project.id % DOT_COLORS.length];

  return (
    <article className="group relative h-full glass-card rounded-xl overflow-hidden flex flex-col transition-colors duration-300 hover:border-accent/40 focus-within:outline focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2">
      {/* Miniature : même chrome de fenêtre que la page détail, en aperçu */}
      <EditorWindow
        filename={previewFilename(project.image)}
        titleBarClassName="px-3 sm:px-4 py-2"
        action={
          project.featured ? (
            <span
              className="inline-flex items-center gap-1 text-accent-amber font-mono text-xs font-semibold"
              title="Projet phare"
            >
              <Star size={12} className="fill-current" />
              phare
            </span>
          ) : undefined
        }
      >
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
        </div>
      </EditorWindow>

      <div className="flex flex-col grow p-4 sm:p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} aria-hidden />
          <h3 className="font-mono text-base sm:text-lg font-semibold text-foreground truncate">
            {/* Lien étiré : toute la carte mène au détail, sans imbriquer des <a> */}
            <Link
              href={`/projects/${project.slug}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}/
            </Link>
          </h3>
        </div>

        {project.description && (
          <p className="font-mono text-foreground/50 mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3 grow">
            <span className="text-foreground/30" aria-hidden>
              {'// '}
            </span>
            {project.description}
          </p>
        )}

        {project.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="font-mono text-foreground/30 text-xs" aria-hidden>
              [
            </span>
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
            <span className="font-mono text-foreground/30 text-xs" aria-hidden>
              ]
            </span>
          </div>
        )}

        {/* Actions secondaires, au-dessus du lien étiré, d'où le z-10 */}
        <div className="relative z-10 flex items-center gap-2 mt-auto pt-3 border-t border-border">
          <span className="font-mono text-accent/60" aria-hidden>
            $
          </span>
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
  );
}
