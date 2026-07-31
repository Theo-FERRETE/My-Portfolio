'use client';

import { useCallback, useState } from 'react';
import { AdminGuard, AdminPageHeader, AdminSpinner } from '@/app/admin/_components';
import ProfileForm from './_components/ProfileForm';
import PasswordForm from './_components/PasswordForm';

function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const handleLoaded = useCallback(() => setIsLoading(false), []);

  return (
    <div className="min-h-screen">
      <AdminPageHeader title="Mon Profil" backHref="/admin/dashboard" />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {isLoading && <AdminSpinner label="Chargement du profil..." />}
          <div className={isLoading ? 'hidden' : undefined}>
            <ProfileForm onLoaded={handleLoaded} />
            <PasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <AdminGuard loadingLabel="Chargement du profil...">
      <ProfileScreen />
    </AdminGuard>
  );
}
