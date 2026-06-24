'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
}

export default function AdminSkills() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSkills();
    }
  }, [status]);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/admin/skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des compétences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('T\'es sûr de vouloir supprimer cette compétence ?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">J'charge...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Chargement des competences...</p>
        </div>
      </div>
    );
  }

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="admin-header">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="admin-text-muted hover:opacity-80"
              >
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold admin-text-accent">
                Gestion des Compétences
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <AdminThemeSwitcher />
              <Link
                href="/admin/skills/new"
                className="admin-btn-primary px-4 py-2 transition-all"
              >
                ➕ Nouvelle compétence
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        {skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="admin-text-muted mb-4">
              Aucune compétence pour le moment
            </p>
            <Link
              href="/admin/skills/new"
              className="admin-btn-primary inline-block px-6 py-3 transition-all"
            >
              Créer votre première compétence
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold mb-4">
                  {category}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="admin-card p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{skill.icon}</span>
                          <h3 className="text-lg font-bold">
                            {skill.name}
                          </h3>
                        </div>
                      </div>

                      <p className="admin-text-muted text-sm mb-4">
                        {skill.description}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/skills/${skill.id}`}
                          className="admin-btn-secondary flex-1 px-4 py-2 text-center text-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="admin-btn-danger px-4 py-2 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
