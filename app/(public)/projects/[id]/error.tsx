'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen pt-20 flex items-center justify-center bg-background px-6">
      <div className="glass rounded-2xl p-8 md:p-12 text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-foreground/60 mb-8">
          Ce projet n&apos;a pas pu être chargé. Merci de réessayer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-accent text-background rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Réessayer
          </button>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl font-semibold hover:border-accent hover:text-accent transition-all"
          >
            <ArrowLeft size={18} />
            Retour aux projets
          </Link>
        </div>
      </div>
    </main>
  );
}
