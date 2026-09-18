import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Projects from '@/app/components/sections/Projects';
import ProofBand from '@/app/components/sections/ProofBand';
import ContactCta from '@/app/components/sections/ContactCta';
import PageHero from '@/app/components/ui/PageHero';
import { getProjects, getSkills } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Projets - Théo FERRETE',
  description: "Les projets récents de Théo FERRETE : applications web full stack en React, Next.js, Node.js et PostgreSQL.",
};

// Rendu côté serveur pour que le contenu soit indexable ; le cache est rafraîchi
// régulièrement pour que les modifications faites depuis l'admin remontent.
export const revalidate = 60;

export default async function ProjectsPage() {
  const [projects, skills] = await Promise.all([getProjects(), getSkills()]);

  return (
    <main id="contenu" className="min-h-screen">
      <PageHero
        showAvailability
        title={
          <>
            Ce que j&apos;ai déjà <span className="text-accent">construit</span>.
          </>
        }
        subtitle="Chaque projet a été conçu et développé par mes soins. Ouvrez-en un pour voir le contexte, mon rôle et le résultat."
      >
        <Link
          href="/contact"
          className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-[0_8px_30px_-8px_var(--accent)]"
        >
          Me contacter
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </PageHero>
      <Projects projects={projects} />
      <ProofBand skills={skills} />
      <ContactCta />
    </main>
  );
}
