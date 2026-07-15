'use client';

import { useEffect, useRef, useState } from 'react';
import ChromeCanvas from '@/app/components/three/ChromeCanvas';
import { getSkillIcon } from '@/lib/skill-icons';

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  order: number;
}

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
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* 3D plein format */}
      <ChromeCanvas
        variant="skills"
        visible={isVisible}
        className="absolute inset-0 opacity-60 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-foreground tracking-tight">
            Ma stack
          </h2>
          <p className="text-center text-foreground/60 mb-12 sm:mb-16 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Les technos avec lesquelles je bosse le plus souvent
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {skillsData
              .sort((a, b) => a.order - b.order)
              .map((skill, index) => {
                const { Icon, color } = getSkillIcon(skill.name);
                return (
                <div
                  key={skill.id}
                  className="group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="glass p-4 sm:p-6 rounded-2xl hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col items-center">
                    <div className="p-3 sm:p-4 rounded-xl tint mb-2 sm:mb-3 group-hover:bg-accent/10 transition-colors duration-300">
                      <Icon size={32} color={color} />
                    </div>
                    <span className="font-semibold text-foreground/90 text-xs sm:text-sm text-center line-clamp-2">
                      {skill.name}
                    </span>
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
