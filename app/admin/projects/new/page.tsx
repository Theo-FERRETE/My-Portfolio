'use client';

import { AdminGuard } from '@/app/admin/_components';
import ProjectForm from '@/app/admin/projects/_components/ProjectForm';

export default function NewProjectPage() {
  return (
    <AdminGuard loadingLabel="Chargement du formulaire...">
      <ProjectForm />
    </AdminGuard>
  );
}
