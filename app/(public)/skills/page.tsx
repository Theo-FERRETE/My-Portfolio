import type { Metadata } from 'next';
import Skills from '@/app/components/sections/Skills';
import { getProjects, getSkills } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Compétences - Théo FERRETE',
  description: "Les technologies maîtrisées par Théo FERRETE : React, Next.js, TypeScript, Node.js et plus encore.",
};

export const revalidate = 60;

export default async function SkillsPage() {
  const [skills, projects] = await Promise.all([getSkills(), getProjects()]);

  return (
    <main id="contenu" className="min-h-screen pt-20">
      <Skills skills={skills} projects={projects} headingLevel="h1" />
    </main>
  );
}
