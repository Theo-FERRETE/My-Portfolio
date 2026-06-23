'use client';

import { useEffect, useRef, useState } from 'react';

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  order: number;
}

// Fonction pour générer une couleur gradient basée sur la catégorie
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Frontend': 'from-cyan-500 to-blue-500',
    'Backend': 'from-green-600 to-green-700',
    'Database': 'from-purple-600 to-purple-700',
    'Language': 'from-blue-600 to-blue-700',
  };
  return colors[category] || 'from-gray-600 to-gray-700';
};

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data: Skill[]) => setSkillsData(data))
      .catch((err) => console.error('Erreur chargement skills:', err));
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
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-300/20 dark:bg-pink-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ma stack
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Les technos avec lesquelles je bosse le plus souvent
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {skillsData
              .sort((a, b) => a.order - b.order)
              .map((skill, index) => (
                <div
                  key={skill.id}
                  className="group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 h-full flex flex-col items-center">
                    <div className={`text-3xl sm:text-4xl p-3 sm:p-4 rounded-xl bg-gradient-to-r ${getCategoryColor(skill.category)} bg-opacity-10 mb-2 sm:mb-3`}>
                      {skill.icon}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm text-center line-clamp-2">
                      {skill.name}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
