'use client';

import { useEffect, useRef, useState } from 'react';
import ChromeCanvas from '@/app/components/three/ChromeCanvas';

interface Project {
  id: number;
  title: string;
  tags: string[];
}

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  order: number;
}

interface Profile {
  name: string;
  bio: string;
  location: string;
}

const EMPTY_PROFILE: Profile = { name: '', bio: '', location: '' };

const categoryIcon: Record<string, string> = {
  'Frontend': '🖥️',
  'Backend': '⚙️',
  'Database': '🗄️',
  'Language': '📝',
  'DevOps': '🚀',
};

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [profileData, setProfileData] = useState<Profile>(EMPTY_PROFILE);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data: Project[]) => setProjectsData(data))
      .catch((err) => console.error('Erreur chargement projets:', err));

    fetch('/api/skills')
      .then((res) => res.json())
      .then((data: Skill[]) => setSkillsData(data))
      .catch((err) => console.error('Erreur chargement skills:', err));

    fetch('/api/profile')
      .then((res) => res.json())
      .then((data: Profile) => setProfileData(data))
      .catch((err) => console.error('Erreur chargement profil:', err));
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

  // Grouper les skills par catégorie
  const skillsByCategory = skillsData.reduce<Record<string, typeof skillsData>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categoryOrder = ['Frontend', 'Language', 'Backend', 'Database', 'DevOps'];
  const sortedCategories = categoryOrder.filter(cat => skillsByCategory[cat]);

  const stats = [
    { value: projectsData.length, label: 'Projets réalisés', icon: '📁' },
    { value: skillsData.length, label: 'Technologies', icon: '🛠️' },
    { value: sortedCategories.length, label: 'Domaines couverts', icon: '🎯' },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* 3D plein format */}
      <ChromeCanvas
        variant="skills"
        visible={isVisible}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 text-foreground tracking-tight">
            À propos de moi
          </h2>

          {/* Bio + stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start mb-12">
            <div className="order-2 md:order-1 glass p-6 sm:p-8 rounded-2xl">
              <div className="text-5xl sm:text-6xl mb-4">👋</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">
                Salut, moi c'est {profileData.name.split(' ')[0]} !
              </h3>
              <p className="text-sm sm:text-base text-foreground/60 leading-relaxed">
                {profileData.bio}
              </p>
              <div className="mt-4 text-sm text-foreground/50 flex items-center gap-1">
                <span>📍</span>
                <span>{profileData.location}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4 order-1 md:order-2">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-xl glass">
                  <div className="text-3xl">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-accent">
                      {stat.value}+
                    </div>
                    <div className="text-sm text-foreground/50">{stat.label}</div>
                  </div>
                </div>
              ))}

              {/* Projets phares */}
              <div className="p-4 rounded-xl glass">
                <h4 className="font-semibold text-foreground/80 mb-3 text-sm">Projets récents</h4>
                <div className="space-y-2">
                  {projectsData.map((project) => (
                    <div key={project.id} className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground/90">
                        {project.title}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills par catégorie */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-foreground">
              Ma stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedCategories.map((category) => (
                <div
                  key={category}
                  className="glass p-4 rounded-2xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold px-2 py-0.5 rounded-full border border-border text-foreground/80">
                      {categoryIcon[category] ?? '🔧'} {category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsByCategory[category]
                      .sort((a, b) => a.order - b.order)
                      .map((skill) => (
                        <span
                          key={skill.id}
                          className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg tint text-foreground/70 border border-border"
                        >
                          <span>{skill.icon}</span>
                          <span>{skill.name}</span>
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
