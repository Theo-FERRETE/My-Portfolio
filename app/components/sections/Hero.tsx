'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
      {/* Gradient animé de fond */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20"></div>
      
      {/* Effet de particules/blur */}
      <div 
        className="hidden md:block absolute w-64 h-64 md:w-96 md:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"
        style={{
          left: `${mousePosition.x / 30}px`,
          top: `${mousePosition.y / 30}px`,
          transition: 'all 0.3s ease-out',
        }}
      ></div>
      <div className="hidden md:block absolute bottom-10 md:bottom-20 right-5 md:right-20 w-48 h-48 md:w-64 md:h-64 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <div className="animate-fadeIn">
          <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-slideDown leading-tight">
            Théo Ferrete
          </h1>
          <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300 mb-4 sm:mb-8 animate-slideUp">
            Développeur Full Stack
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-12 animate-fadeIn delay-500">
            Je transforme du café en code.
            <br />
            Spécialisé dans la création d'apps web qui fonctionnent vraiment bien.
          </p>
          
          <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row justify-center animate-fadeIn delay-700">
            <Link
              href="/projects"
              className="group relative px-4 sm:px-8 py-2.5 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50 text-xs sm:text-base"
            >
              <span className="relative z-10">Voir mes projets</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/contact"
              className="px-4 sm:px-8 py-2.5 sm:py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-full font-semibold hover:bg-purple-600 hover:text-white dark:hover:text-white transition-all duration-300 hover:scale-105 text-xs sm:text-base"
            >
              Me contacter
            </Link>
            <a
              href="/cv.pdf"
              download
              className="flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-4 border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 text-xs sm:text-base"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Télécharger</span> CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
