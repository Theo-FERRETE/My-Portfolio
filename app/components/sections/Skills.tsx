'use client';

import { useEffect, useRef, useState } from 'react';

const skills = [
  { name: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-500' },
  { name: 'Next.js', icon: '▲', color: 'from-gray-700 to-gray-900' },
  { name: 'TypeScript', icon: 'TS', color: 'from-blue-600 to-blue-700' },
  { name: 'Tailwind CSS', icon: '🎨', color: 'from-cyan-400 to-blue-500' },
  { name: 'Node.js', icon: '🟢', color: 'from-green-600 to-green-700' },
  { name: 'Python', icon: '🐍', color: 'from-yellow-500 to-blue-600' },
  { name: 'MongoDB', icon: '🍃', color: 'from-green-500 to-green-600' },
  { name: 'Git', icon: '📦', color: 'from-orange-600 to-red-600' },
];

export default function Skills() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

      <div className="container mx-auto px-6 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ma stack
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto">
            Les technos avec lesquelles je bosse le plus souvent
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className="group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 h-full">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`text-4xl p-4 rounded-xl bg-gradient-to-r ${skill.color} bg-opacity-10`}>
                      {skill.icon}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {skill.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
