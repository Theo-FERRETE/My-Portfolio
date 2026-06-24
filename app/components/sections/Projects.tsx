'use client';

import { useEffect, useRef, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
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

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="h-full transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
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
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* 3D plein format */}
      <ChromeCanvas
        variant="projects"
        visible={isVisible}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-foreground tracking-tight">
            Mes Projets
          </h2>
          <p className="text-center text-foreground/60 mb-12 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Quelques trucs sur lesquels j'ai bossé récemment
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
            {projectsData.map((project, index) => (
              <div
                key={project.id}
                className={`transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <TiltCard>
                  <div className="relative h-full glass rounded-2xl overflow-hidden hover:border-accent/40 transition-colors duration-300 flex flex-col">
                    {/* Header avec image */}
                    <div className="h-40 sm:h-48 bg-surface relative overflow-hidden shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                      />
                    </div>

                    {/* Contenu */}
                    <div className="p-4 sm:p-6 flex flex-col grow">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-foreground/60 mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3 grow">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 sm:px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 sm:px-3 py-1 text-xs font-medium tint text-foreground/50 rounded-full">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
                        <a
                          href={`/projects/${project.id}`}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-accent text-background text-center rounded-lg font-semibold hover:opacity-90 transition-opacity text-xs sm:text-sm"
                        >
                          Détails
                        </a>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-border text-foreground text-center rounded-lg font-semibold hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          Visiter
                          <ExternalLink size={14} />
                        </a>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Voir le code sur GitHub"
                            className="px-3 sm:px-4 py-2 sm:py-2.5 border border-border text-foreground/70 text-center rounded-lg font-semibold hover:border-accent hover:text-accent transition-all flex items-center justify-center"
                          >
                            <Github size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
