import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Skills from '@/app/components/sections/Skills';
import StackReasons from '@/app/components/sections/StackReasons';
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
        showAvailability
        title={
          <>
            Une stack, <span className="text-accent">tout le projet</span>.
          </>
        }
        subtitle="De l'interface à la mise en ligne, voici les technologies avec lesquelles je travaille — et ce qu'elles vous apportent."
      >
        <Link
          href="/projects"
          className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Les voir en action
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </PageHero>
      <Skills skills={skills} projects={projects} />
      <StackReasons />
      <ContactCta />
    </main>
  );
}
