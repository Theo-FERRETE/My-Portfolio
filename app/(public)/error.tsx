'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import StatusPage, { PRIMARY_ACTION, SECONDARY_ACTION } from '@/app/components/ui/StatusPage';

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
    <StatusPage
      code="Oups"
      title="Une erreur est survenue"
      message="Cette page n'a pas pu s'afficher correctement. Merci de réessayer."
    >
      <button type="button" onClick={() => reset()} className={PRIMARY_ACTION}>
        Réessayer
      </button>
      <Link href="/" className={SECONDARY_ACTION}>
        Retour à l&apos;accueil
      </Link>
    </StatusPage>
  );
}
