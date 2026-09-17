import type { Metadata } from 'next';
import Projects from '@/app/components/sections/Projects';
import ContactCta from '@/app/components/sections/ContactCta';
import PageHero from '@/app/components/ui/PageHero';
import { getProjects } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Projets - Théo FERRETE',
  description: "Les projets récents de Théo FERRETE : applications web full stack en React, Next.js, Node.js et PostgreSQL.",
};

// Rendu côté serveur pour que le contenu soit indexable ; le cache est rafraîchi
// régulièrement pour que les modifications faites depuis l'admin remontent.
export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main id="contenu" className="min-h-screen">
      <PageHero
        title={
          <>
            Mes <span className="text-accent">projets</span>
          </>
        }
        subtitle="Une sélection d'applications web sur lesquelles j'ai travaillé."
      />
      <Projects projects={projects} />
      <ContactCta />
    </main>
  );
}
