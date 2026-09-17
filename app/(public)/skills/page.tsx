import type { Metadata } from 'next';
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
        subtitle="Les technologies avec lesquelles je travaille, regroupées par domaine."
      />
      <Skills skills={skills} projects={projects} />
      <ContactCta />
    </main>
  );
}
