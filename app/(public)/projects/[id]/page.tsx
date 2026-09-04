import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, ArrowLeft, Check, Star } from 'lucide-react';
import { getProjectById } from '@/lib/data';

/** Nom de fichier plausible pour l'onglet de la fenêtre d'éditeur, dérivé de l'image. */
function previewFilename(imagePath: string): string {
  const base = imagePath.split('/').pop() || 'preview.png';
  return base;
}

type ProjectPageParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: ProjectPageParams): Promise<Metadata> {
  const { id } = await params;
  const project = Number.isInteger(Number(id)) ? await getProjectById(Number(id)) : undefined;

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
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const project = await getProjectById(projectId);

  if (!project) {
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
          <div className="glass-raised rounded-2xl overflow-hidden mb-12">
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-border">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" aria-hidden />
              <span className="ml-3 font-mono text-xs text-foreground/50 tint px-2.5 py-1 rounded truncate">
                {previewFilename(project.image)}
              </span>
              {project.featured && (
                <span className="ml-auto inline-flex items-center gap-1.5 text-accent-amber font-mono text-xs font-semibold shrink-0">
                  <Star size={12} className="fill-current" />
                  phare
                </span>
              )}
            </div>
            <div className="relative h-72 sm:h-96">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </div>

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
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Description
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Technologies utilisées
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-accent/10 text-accent rounded-lg font-mono font-medium border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Caractéristiques principales
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-accent mr-3 shrink-0" size={20} />
                  <span className="text-foreground/70">Interface utilisateur moderne et responsive</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mr-3 shrink-0" size={20} />
                  <span className="text-foreground/70">Performance optimisée</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mr-3 shrink-0" size={20} />
                  <span className="text-foreground/70">Architecture scalable et maintenable</span>
                </li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-border">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-8 py-4 bg-accent text-background text-center rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ExternalLink size={18} />
                Visiter le site
              </a>
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
