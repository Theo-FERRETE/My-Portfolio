import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import StatusPage, { PRIMARY_ACTION, SECONDARY_ACTION } from '@/app/components/ui/StatusPage';

export default function ProjectNotFound() {
  return (
    <StatusPage
      code="404"
      title="Projet introuvable"
      message="Ce projet n'existe pas ou a été retiré. Découvrez les autres réalisations."
    >
      <Link href="/projects" className={PRIMARY_ACTION}>
        <ArrowLeft size={18} />
        Tous les projets
      </Link>
      <Link href="/contact" className={SECONDARY_ACTION}>
        Me contacter
      </Link>
    </StatusPage>
  );
}
