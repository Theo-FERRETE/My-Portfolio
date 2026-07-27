'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PublicError({
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
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="glass rounded-2xl p-8 md:p-12 text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Une erreur est survenue
        </h1>
        <p className="text-foreground/60 mb-8">
          Cette page n&apos;a pas pu s&apos;afficher correctement. Merci de réessayer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-accent text-background rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-border text-foreground rounded-xl font-semibold hover:border-accent hover:text-accent transition-all"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
