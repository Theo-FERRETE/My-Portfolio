'use client';

import { useParams } from 'next/navigation';
import { AdminGuard } from '@/app/admin/_components';
import SkillForm from '@/app/admin/skills/_components/SkillForm';

export default function EditSkillPage() {
  const params = useParams<{ id: string }>();

  return (
    <AdminGuard loadingLabel="Chargement de la compétence...">
      <SkillForm id={params.id} />
    </AdminGuard>
  );
}
