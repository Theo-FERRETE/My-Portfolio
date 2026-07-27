import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProjectNotFound() {
  return (
    <main className="min-h-screen pt-20 flex items-center justify-center bg-background px-6">
      <div className="text-center">
        <p className="text-accent font-semibold mb-2">404</p>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Projet introuvable
        </h1>
        <p className="text-foreground/60 mb-8">
          Ce projet n&apos;existe pas ou a été retiré.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={18} />
          Retour aux projets
        </Link>
      </div>
    </main>
  );
}
