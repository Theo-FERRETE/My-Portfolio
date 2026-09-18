import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, ArrowLeft, ArrowRight, Star, ImageOff, CalendarDays } from 'lucide-react';
import { getProjectById, getProjectBySlug, getProjects } from '@/lib/data';
import TagPill from '@/app/components/ui/TagPill';
import ProjectGrid from '@/app/components/ui/ProjectGrid';
import ContactCta from '@/app/components/sections/ContactCta';

const OTHER_PROJECTS_COUNT = 3;

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

  // Autres projets : les phares d'abord, pour garder le visiteur sur ce qu'il y a de mieux.
  const otherProjects = (await getProjects())
    .filter((p) => p.id !== project.id)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, OTHER_PROJECTS_COUNT);

  // Étude de cas, propre à chaque projet : seules les étapes renseignées en admin s'affichent.
  const caseStudy = [
    { title: 'Le contexte', text: project.context },
    { title: 'Mon rôle', text: project.myRole },
    { title: 'Le défi', text: project.challenge },
    { title: 'Le résultat', text: project.result },
  ].filter((step) => step.text);

  const createdAt = new Date(project.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <main id="contenu" className="relative min-h-screen bg-background">
      <div
        className="absolute inset-x-0 top-0 h-[36rem] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 70% at 50% 0%, color-mix(in srgb, var(--accent) 6%, transparent) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative container mx-auto px-4 sm:px-6 pt-28 sm:pt-32">
        <div className="max-w-5xl mx-auto">
          <nav className="mb-8">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-accent">
              <ArrowLeft size={16} />
              Tous les projets
            </Link>
          </nav>

          {/* En-tête : l'essentiel avant de scroller */}
          <header className="text-center animate-rise">
            {project.featured && (
              <p className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent-amber/30 bg-accent-amber/10 text-accent-amber text-xs sm:text-sm font-semibold">
                <Star size={14} className="fill-current" aria-hidden />
                Projet phare
              </p>
            )}
            <h1 className="mt-5 text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-foreground leading-tight">
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-5 text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                {project.description}
              </p>
            )}

            {(project.link || project.github) && (
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink size={18} />
                    Voir le site en ligne
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 border border-border text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent"
                  >
                    <Github size={18} />
                    Voir le code
                  </a>
                )}
              </div>
            )}
          </header>

          {/* Visuel */}
          <div className="mt-12 glass-raised rounded-2xl overflow-hidden animate-rise">
            <div className="relative aspect-[16/9]">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-foreground/30 bg-[color-mix(in_srgb,var(--surface)_60%,transparent)]">
                  <ImageOff size={40} aria-hidden />
                  <span className="text-sm">Pas d&apos;aperçu pour ce projet</span>
                </div>
              )}
            </div>
          </div>

          {/* Sans étude de cas : une ligne récap suffit, la description est déjà dans l'en-tête */}
          {caseStudy.length === 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-2 text-foreground/70 capitalize">
                <CalendarDays size={14} className="text-accent" aria-hidden />
                {createdAt}
              </span>
              {project.tags.length > 0 && (
                <span className="flex flex-wrap justify-center gap-1.5">
                  {project.tags.map((tag) => (
                    <TagPill key={tag} size="sm">
                      {tag}
                    </TagPill>
                  ))}
                </span>
              )}
            </div>
          )}

          {/* Étude de cas + fiche récap */}
          {caseStudy.length > 0 && (
            <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-8 lg:gap-12 items-start">
              <ol className="space-y-8">
                {caseStudy.map((step, index) => (
                  <li key={step.title} className="flex gap-4 sm:gap-6">
                    <span
                      className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent font-bold"
                      aria-hidden
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">{step.title}</h2>
                      <p className="mt-2 text-foreground/70 leading-relaxed whitespace-pre-line">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <aside className="glass-card rounded-xl p-6 lg:sticky lg:top-24">
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground/50">Fiche projet</h2>

                <dl className="mt-5 space-y-5 text-sm">
                  <div>
                    <dt className="text-foreground/50">Date</dt>
                    <dd className="mt-1 flex items-center gap-2 font-medium text-foreground capitalize">
                      <CalendarDays size={14} className="text-accent" aria-hidden />
                      {createdAt}
                    </dd>
                  </div>
                  {project.tags.length > 0 && (
                    <div>
                      <dt className="text-foreground/50">Technologies</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <TagPill key={tag} size="sm">
                            {tag}
                          </TagPill>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>

                <Link
                  href="/contact"
                  className="group mt-6 pt-5 border-t border-border flex items-center justify-between gap-2 text-sm font-semibold text-accent"
                >
                  Travaillons ensemble
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </aside>
            </div>
          )}
        </div>
      </div>

      {otherProjects.length > 0 && (
        <section aria-labelledby="autres-projets" className="container mx-auto px-4 sm:px-6 mt-20 sm:mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 id="autres-projets" className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Autres projets
              </h2>
              <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/70 hover:text-accent shrink-0">
                Tout voir
                <ArrowRight size={14} />
              </Link>
            </div>
            <ProjectGrid projects={otherProjects} />
          </div>
        </section>
      )}

      <ContactCta />
    </main>
  );
}
