'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Github, ExternalLink, ArrowLeft, Check } from 'lucide-react';
import ChromeCanvas from '@/app/components/three/ChromeCanvas';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;
  featured: boolean;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const projectId = parseInt(params.id as string);
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data: Project[]) => {
        const foundProject = data.find((p) => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        } else {
          router.push('/projects');
        }
      })
      .catch(() => router.push('/projects'));
  }, [params.id, router]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground/60">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-background relative overflow-hidden">
      {/* 3D plein format */}
      <ChromeCanvas variant="hero" className="absolute inset-0 opacity-50 pointer-events-none" />

      <div className="container mx-auto px-6 py-12 relative z-10">
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
          {/* Image principale */}
          <div className="relative h-96 rounded-2xl overflow-hidden mb-12 group border border-border">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent"></div>

            {/* Badge Featured */}
            {project.featured && (
              <div className="absolute top-6 right-6 px-4 py-2 bg-accent text-background rounded-full font-semibold">
                ⭐ Projet Phare
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="glass rounded-2xl p-8 md:p-12">
            {/* Titre et date */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
                {project.title}
              </h1>
              <p className="text-foreground/50">
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
              <p className="text-lg text-foreground/60 leading-relaxed">
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
                    className="px-4 py-2 bg-accent/10 text-accent rounded-lg font-medium border border-accent/20"
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
                  <span className="text-foreground/60">Interface utilisateur moderne et responsive</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mr-3 shrink-0" size={20} />
                  <span className="text-foreground/60">Performance optimisée</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-accent mr-3 shrink-0" size={20} />
                  <span className="text-foreground/60">Architecture scalable et maintenable</span>
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
