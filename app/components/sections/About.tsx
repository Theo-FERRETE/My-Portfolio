'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FolderKanban, Wrench, Target, MapPin, ArrowRight } from 'lucide-react';
import SectionHeading from '@/app/components/ui/SectionHeading';
import type { Profile, Project, Skill } from '@/lib/data';
import { useInView } from '@/lib/hooks/use-in-view';

interface AboutProps {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  headingLevel?: 'h1' | 'h2';
}

export default function About({ profile, projects, skills, headingLevel = 'h2' }: AboutProps) {
  const { ref, inView } = useInView<HTMLElement>();

  const categoryCount = new Set(skills.map((s) => s.category)).size;
  const firstName = profile.name.split(' ')[0] || profile.name;

  const stats = [
    { value: projects.length, label: 'Projets publiés', icon: FolderKanban },
    { value: skills.length, label: 'Technologies', icon: Wrench },
    { value: categoryCount, label: 'Domaines couverts', icon: Target },
  ];

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className={`max-w-5xl mx-auto reveal ${inView ? 'reveal-in' : ''}`}>
          <SectionHeading
            as={headingLevel}
            eyebrow="cat ./about.md"
            title="À propos de moi"
            className="mb-10 sm:mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Bio */}
            <div className="order-2 md:order-1 glass-card p-6 sm:p-8 rounded-xl">
              <div className="flex items-center gap-4 mb-5">
                <Image
                  src="/images/profile/avatar.png"
                  alt={profile.name}
                  width={72}
                  height={72}
                  className="rounded-full object-cover border border-border shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    Salut, moi c&apos;est {firstName} !
                  </h3>
                  {profile.title && (
                    <p className="text-sm text-accent truncate">{profile.title}</p>
                  )}
                </div>
              </div>

              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                {profile.bio}
              </p>

              {profile.location && (
                <p className="mt-5 text-sm text-foreground/60 flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </p>
              )}
            </div>

            {/* Chiffres + raccourcis */}
            <div className="space-y-4 order-1 md:order-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4 p-4 rounded-xl glass-card">
                  <span className="p-2.5 rounded-lg tint text-accent shrink-0">
                    <stat.icon size={22} />
                  </span>
                  <span>
                    <span className="block text-2xl font-bold text-accent">{stat.value}</span>
                    <span className="block text-sm text-foreground/60">{stat.label}</span>
                  </span>
                </div>
              ))}

              {projects.length > 0 && (
                <div className="p-4 rounded-xl glass-card">
                  <h4 className="font-semibold text-foreground/80 mb-3 text-sm">Projets récents</h4>
                  <ul className="space-y-2">
                    {projects.slice(0, 3).map((project) => (
                      <li key={project.id}>
                        <Link
                          href={`/projects/${project.id}`}
                          className="flex flex-wrap items-center gap-2 rounded-lg -mx-1 px-1 py-1 hover-tint"
                        >
                          <span className="text-sm font-medium text-foreground/90">
                            {project.title}
                          </span>
                          <span className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent"
                              >
                                {tag}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href="/skills"
                className="flex items-center justify-between gap-2 p-4 rounded-xl border border-border text-foreground hover:border-accent hover:text-accent font-medium text-sm"
              >
                Voir la stack complète
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
