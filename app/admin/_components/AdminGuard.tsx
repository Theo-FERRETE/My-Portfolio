'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminSpinner from './AdminSpinner';

/**
 * Ne monte ses enfants qu'une fois la session confirmée, et redirige vers la page
 * de connexion sinon. Les écrans qu'il enveloppe peuvent donc partir du principe
 * qu'ils sont authentifiés, au lieu de refaire la vérification chacun de leur côté.
 */
export default function AdminGuard({
  children,
  loadingLabel,
}: {
  children: React.ReactNode;
  loadingLabel?: string;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status !== 'authenticated') {
    return <AdminSpinner label={loadingLabel} />;
  }

  return <>{children}</>;
}
