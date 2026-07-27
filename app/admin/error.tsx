'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminError({
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4">
          Une erreur interne est survenue
        </h1>
        <p className="admin-text-muted mb-8">
          Merci de réessayer. Si le problème persiste, contactez l&apos;administrateur.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => reset()} className="admin-btn-primary px-6 py-3">
            Réessayer
          </button>
          <Link href="/admin/dashboard" className="admin-btn-secondary px-6 py-3">
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
