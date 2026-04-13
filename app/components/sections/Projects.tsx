'use client';

import { useEffect, useRef, useState } from 'react';

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

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setProjectsData(data))
      .catch((err) => console.error('Erreur chargement projets:', err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mes Projets
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Quelques trucs sur lesquels j'ai bossé récemment
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {projectsData.map((project, index) => {
              // Gradients dynamiques
              const gradients = [
                'from-purple-500 to-pink-500',
                'from-blue-500 to-cyan-500',
                'from-green-500 to-emerald-500',
                'from-orange-500 to-red-500',
                'from-indigo-500 to-purple-500',
                'from-pink-500 to-rose-500',
              ];
              const gradient = gradients[index % gradients.length];

              return (
              <div
                key={project.id}
                className={`group transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:-translate-y-2 flex flex-col">
                  {/* Header avec image */}
                  <div className={`h-40 sm:h-48 bg-gradient-to-br ${gradient} relative overflow-hidden flex-shrink-0`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    />
                  </div>

                  {/* Contenu */}
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3 flex-grow">
                      {project.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 sm:px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 sm:px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
                      <a
                        href={`/projects/${project.id}`}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-[1.02] text-xs sm:text-sm"
                      >
                        Détails
                      </a>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-600 text-purple-600 dark:text-purple-400 text-center rounded-lg font-semibold hover:bg-purple-600 hover:text-white dark:hover:text-white transition-all hover:scale-[1.02] flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        Visiter
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Effet de brillance au hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
