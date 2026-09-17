import type { Metadata } from 'next';
import Contact from '@/app/components/sections/Contact';
import PageHero from '@/app/components/ui/PageHero';

export const metadata: Metadata = {
  title: 'Contact - Théo FERRETE',
  description: "Un projet en tête ou une question ? Contactez Théo FERRETE, développeur Full Stack, par message ou sur les réseaux.",
};

export default function ContactPage() {
  return (
    <main id="contenu" className="min-h-screen">
      <PageHero
        title={
          <>
            Parlons de votre <span className="text-accent">projet</span>
          </>
        }
        subtitle="Une mission, un poste ou une simple question : envoyez-moi un message via le formulaire ou retrouvez-moi sur les réseaux."
      />
      <Contact />
    </main>
  );
}
