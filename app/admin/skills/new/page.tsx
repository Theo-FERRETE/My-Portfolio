'use client';

import { AdminGuard } from '@/app/admin/_components';
import SkillForm from '@/app/admin/skills/_components/SkillForm';

export default function NewSkillPage() {
  return (
    <AdminGuard loadingLabel="Chargement du formulaire...">
      <SkillForm />
    </AdminGuard>
  );
}
