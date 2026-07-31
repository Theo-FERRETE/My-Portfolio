import type { Metadata } from 'next';
import About from '@/app/components/sections/About';
import { getProfile, getProjects, getSkills } from '@/lib/data';

export const metadata: Metadata = {
  title: 'À propos - Théo FERRETE',
  description: "Développeur Full Stack basé à Rognac, spécialisé en React et Next.js. Découvrez mon parcours, mes compétences et mes projets récents.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [profile, projects, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
  ]);

  return (
    <main id="contenu" className="min-h-screen pt-20">
      <About profile={profile} projects={projects} skills={skills} headingLevel="h1" />
    </main>
  );
}
