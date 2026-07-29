import type { Metadata } from 'next';
import Skills from '@/app/components/sections/Skills';

export const metadata: Metadata = {
  title: 'Compétences - Théo FERRETE',
  description: "Les technologies maîtrisées par Théo FERRETE : React, Next.js, TypeScript, Node.js et plus encore.",
};

export default function SkillsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Skills />
    </main>
  );
}
