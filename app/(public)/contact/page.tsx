import type { Metadata } from 'next';
import Contact from '@/app/components/sections/Contact';

export const metadata: Metadata = {
  title: 'Contact - Théo FERRETE',
  description: "Un projet en tête ou une question ? Contactez Théo FERRETE, développeur Full Stack, par message ou sur les réseaux.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20">
      <Contact />
    </main>
  );
}
