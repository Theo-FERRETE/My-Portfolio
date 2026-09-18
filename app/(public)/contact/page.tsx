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
        showAvailability
        showSignature
        title={
          <>
            Travaillons <span className="text-accent">ensemble</span>.
          </>
        }
        subtitle="Alternance, poste, mission ou simple question : décrivez votre besoin en quelques lignes, je vous réponds par email."
      />
      <Contact />
    </main>
  );
}
