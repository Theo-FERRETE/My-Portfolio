import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, ArrowLeft, Check, Star, ImageOff } from 'lucide-react';
import { getProjectById, getProjectBySlug } from '@/lib/data';
import { previewFilename } from '@/lib/preview-filename';
import EditorWindow from '@/app/components/ui/EditorWindow';
import TagPill from '@/app/components/ui/TagPill';
import type { ReactNode } from 'react';

/** En-tête de section façon titre markdown commenté, cohérent avec l'eyebrow `// ` de SectionHeading. */
function SectionHeader({
  children,
  icon,
  className = 'mb-4',
}: {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`flex items-center gap-2 font-mono text-lg sm:text-xl font-semibold text-foreground tracking-tight ${className}`}>
      <span className="text-accent-amber/70 text-sm sm:text-base" aria-hidden>
        ##
      </span>
      {children}
      {icon}
    </h2>
  );
}

type ProjectPageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProjectPageParams): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: 'Projet introuvable - Théo FERRETE' };
  }

  return {
    title: `${project.title} - Théo FERRETE`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageParams) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    // Filet pour d'anciens liens partagés avec l'id numérique : redirige vers le slug
    // plutôt que de renvoyer un 404 sur une URL qui fonctionnait avant.
    if (/^\d+$/.test(slug)) {
      const legacyProject = await getProjectById(Number(slug));
      if (legacyProject) {
        permanentRedirect(`/projects/${legacyProject.slug}`);
      }
    }
    notFound();
  }

  return (
    <main id="contenu" className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-accent transition-colors"
          >
            <ArrowLeft size={18} />
            Retour aux projets
          </Link>
        </nav>

        <div className="max-w-5xl mx-auto">
          {/* Image principale, encadrée façon fenêtre d'éditeur */}
          <EditorWindow
            filename={previewFilename(project.image)}
            action={
              project.featured ? (
                <span className="inline-flex items-center gap-1.5 text-accent-amber font-mono text-xs font-semibold">
                  <Star size={12} className="fill-current" />
                  phare
                </span>
              ) : undefined
            }
            className="glass-raised rounded-2xl overflow-hidden mb-12"
          >
            <div className="relative h-72 sm:h-96">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-foreground/30 bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]">
                  <ImageOff size={40} aria-hidden />
                  <span className="text-sm font-mono">Pas d&apos;aperçu pour ce projet</span>
                </div>
              )}
            </div>
          </EditorWindow>

          {/* Contenu */}
          <div className="glass-card rounded-2xl p-8 md:p-12">
            {/* Titre et date */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
                {project.title}
              </h1>
              <p className="text-foreground/65">
                Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Description */}
            {project.description && (
              <div className="mb-8">
                <SectionHeader>Description</SectionHeader>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  {project.description}
                </p>
              </div>
            )}

            {/* Technologies */}
            {project.tags.length > 0 && (
              <div className="mb-8">
                <SectionHeader>Technologies utilisées</SectionHeader>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <TagPill key={tag} size="md">
                      {tag}
                    </TagPill>
                  ))}
                </div>
              </div>
            )}

            {/* Étude de cas — propre à chaque projet, absente tant que non renseignée en admin */}
            {(project.context || project.myRole || project.challenge || project.result) && (
              <div className="mb-8 space-y-6">
                {project.context && (
                  <div>
                    <SectionHeader className="mb-2">Contexte</SectionHeader>
                    <p className="text-foreground/70 leading-relaxed">{project.context}</p>
                  </div>
                )}
                {project.myRole && (
                  <div>
                    <SectionHeader className="mb-2">Mon rôle</SectionHeader>
                    <p className="text-foreground/70 leading-relaxed">{project.myRole}</p>
                  </div>
                )}
                {project.challenge && (
                  <div>
                    <SectionHeader className="mb-2">Difficulté rencontrée</SectionHeader>
                    <p className="text-foreground/70 leading-relaxed">{project.challenge}</p>
                  </div>
                )}
                {project.result && (
                  <div>
                    <SectionHeader className="mb-2" icon={<Check className="text-accent" size={20} />}>
                      Résultat
                    </SectionHeader>
                    <p className="text-foreground/70 leading-relaxed">{project.result}</p>
                  </div>
                )}
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-8 py-4 bg-accent text-background text-center rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <ExternalLink size={18} />
                  Visiter le site
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-8 py-4 border border-border text-foreground text-center rounded-xl font-semibold hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
                >
                  <Github size={18} />
                  Voir le code
                </a>
              )}
              <Link
                href="/contact"
                className="flex-1 px-8 py-4 border border-border text-foreground text-center rounded-xl font-semibold hover:border-accent hover:text-accent transition-all flex items-center justify-center"
              >
                Discuter du projet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
