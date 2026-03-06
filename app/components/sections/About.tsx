'use client';

import { useEffect, useRef, useState } from 'react';

export default function About() {
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
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            À propos de moi
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-8 rounded-2xl backdrop-blur-sm border border-purple-200 dark:border-purple-800">
                <div className="text-6xl mb-4">👋</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Salut !
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Développeur web basé à Rognac. J'ai commencé à coder en bidouillant 
                  des sites pour le fun, et maintenant c'est devenu mon métier. Je bosse 
                  principalement avec React et Next.js, mais j'aime bien explorer de 
                  nouvelles technos quand j'ai du temps.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl">
                    💻
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Développement Web
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      React, Next.js et TypeScript au quotidien - c'est ce que je maîtrise le mieux
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🎨
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Design UI/UX
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      J'aime que les interfaces soient claires et agréables à utiliser
                    </p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xl">
                    🚀
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Performance
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Personne n'aime les sites lents - j'optimise pour que ça tourne bien
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
