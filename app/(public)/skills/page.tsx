import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Skills from '@/app/components/sections/Skills';
import ContactCta from '@/app/components/sections/ContactCta';
import PageHero from '@/app/components/ui/PageHero';
import { getProjects, getSkills } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Compétences - Théo FERRETE',
  description: "Les technologies utilisées par Théo FERRETE : React, Next.js, TypeScript, Node.js et plus encore.",
};

export const revalidate = 60;

export default async function SkillsPage() {
  const [skills, projects] = await Promise.all([getSkills(), getProjects()]);

  return (
    <main id="contenu" className="min-h-screen">
      <PageHero
        title={
          <>
            Ma <span className="text-accent">stack</span>
          </>
        }
        subtitle="Les technologies avec lesquelles je conçois vos applications, de l'interface à la mise en ligne."
      >
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:border-accent hover:text-accent"
        >
          Les voir en action dans mes projets
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </PageHero>
      <Skills skills={skills} projects={projects} />
      <ContactCta />
    </main>
  );
}
