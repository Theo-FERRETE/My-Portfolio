import type { Metadata } from 'next';
import Projects from '@/app/components/sections/Projects';

export const metadata: Metadata = {
  title: 'Projets - Théo FERRETE',
  description: "Les projets récents de Théo FERRETE : applications web full stack en React, Next.js, Node.js et PostgreSQL.",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Projects />
    </main>
  );
}
