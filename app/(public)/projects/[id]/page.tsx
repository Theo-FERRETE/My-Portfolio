'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import projectsData from '@/app/data/projects.json';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  featured: boolean;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const projectId = parseInt(params.id as string);
    const foundProject = projectsData.find((p) => p.id === projectId);
    
    if (foundProject) {
      setProject(foundProject);
    } else {
      router.push('/projects');
    }
  }, [params.id, router]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Éléments décoratifs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:underline"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux projets
          </Link>
        </nav>

        <div className="max-w-5xl mx-auto">
          {/* Image principale */}
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl mb-12 group">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Badge Featured */}
            {project.featured && (
              <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg">
                ⭐ Projet Phare
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 md:p-12">
            {/* Titre et date */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Description
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Technologies utilisées
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-medium border border-purple-200 dark:border-purple-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Caractéristiques principales
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-3 text-xl">✓</span>
                  <span className="text-gray-600 dark:text-gray-400">Interface utilisateur moderne et responsive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-3 text-xl">✓</span>
                  <span className="text-gray-600 dark:text-gray-400">Performance optimisée</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-3 text-xl">✓</span>
                  <span className="text-gray-600 dark:text-gray-400">Architecture scalable et maintenable</span>
                </li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Visiter le site
              </a>
              <Link
                href="/contact"
                className="flex-1 px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 text-center rounded-xl font-semibold hover:bg-purple-600 hover:text-white dark:hover:text-white transition-all hover:scale-[1.02]"
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
