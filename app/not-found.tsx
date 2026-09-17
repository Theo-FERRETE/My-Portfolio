import Link from 'next/link';
import StatusPage, { PRIMARY_ACTION, SECONDARY_ACTION } from '@/app/components/ui/StatusPage';

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Page introuvable"
      message="Cette page n'existe pas ou a été déplacée. Les projets, eux, sont toujours là."
    >
      <Link href="/projects" className={PRIMARY_ACTION}>
        Voir les projets
      </Link>
      <Link href="/" className={SECONDARY_ACTION}>
        Retour à l&apos;accueil
      </Link>
    </StatusPage>
  );
}
