'use client';

import { useEffect, useRef, useState } from 'react';

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

const categoryConfig: Record<string, { className: string; icon: string }> = {
  'Frontend':  { className: 'bg-cyan-500',   icon: '🖥️' },
  'Backend':   { className: 'bg-green-600',  icon: '⚙️' },
  'Database':  { className: 'bg-purple-600', icon: '🗄️' },
  'Language':  { className: 'bg-blue-600',   icon: '📝' },
  'DevOps':    { className: 'bg-orange-500', icon: '🚀' },
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
      className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Éléments décoratifs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            À propos de moi
          </h2>

          {/* Bio + stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start mb-12">
            <div className="relative group order-2 md:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-purple-200 dark:border-purple-800">
                <div className="text-5xl sm:text-6xl mb-4">👋</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Salut, moi c'est {profileData.name.split(' ')[0]} !
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profileData.bio}
                </p>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
                  <span>📍</span>
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4 order-1 md:order-2">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
                  <div className="text-3xl">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {stat.value}+
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                </div>
              ))}

              {/* Projets phares */}
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm">Projets récents</h4>
                <div className="space-y-2">
                  {projectsData.map((project) => (
                    <div key={project.id} className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {project.title}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
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
            <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
              Ma stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedCategories.map((category) => (
                <div
                  key={category}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full text-white ${categoryConfig[category]?.className ?? 'bg-gray-500'}`}>
                      {categoryConfig[category]?.icon ?? '🔧'} {category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsByCategory[category]
                      .sort((a, b) => a.order - b.order)
                      .map((skill) => (
                        <span
                          key={skill.id}
                          className="text-xs flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
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
