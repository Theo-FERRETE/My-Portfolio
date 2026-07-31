'use client';

import { useParams } from 'next/navigation';
import { AdminGuard } from '@/app/admin/_components';
import ProjectForm from '@/app/admin/projects/_components/ProjectForm';

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();

  return (
    <AdminGuard loadingLabel="Chargement du projet...">
      <ProjectForm id={params.id} />
    </AdminGuard>
  );
}
