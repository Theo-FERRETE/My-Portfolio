'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StatusPage, { PRIMARY_ACTION, SECONDARY_ACTION } from '@/app/components/ui/StatusPage';

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
    <StatusPage
      code="Oups"
      title="Une erreur est survenue"
      message="Ce projet n'a pas pu être chargé. Merci de réessayer."
    >
      <button type="button" onClick={() => reset()} className={PRIMARY_ACTION}>
        Réessayer
      </button>
      <Link href="/projects" className={SECONDARY_ACTION}>
        <ArrowLeft size={18} />
        Retour aux projets
      </Link>
    </StatusPage>
  );
}
