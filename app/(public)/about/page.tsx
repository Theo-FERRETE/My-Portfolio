import type { Metadata } from 'next';
import About from '@/app/components/sections/About';

export const metadata: Metadata = {
  title: 'À propos - Théo FERRETE',
  description: "Développeur Full Stack basé à Rognac, spécialisé en React et Next.js. Découvrez mon parcours, mes compétences et mes projets récents.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-20">
      <About />
    </main>
  );
}
