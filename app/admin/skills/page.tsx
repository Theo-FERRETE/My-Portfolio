'use client';

import Link from 'next/link';
import {
  AdminErrorBanner,
  AdminGuard,
  AdminPageHeader,
  AdminSpinner,
} from '@/app/admin/_components';
import { useAdminList } from '@/app/admin/_hooks/use-admin-list';
import type { Skill } from '@/lib/data';

function groupByCategory(skills: Skill[]): [string, Skill[]][] {
  const byCategory = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill);
    byCategory.set(skill.category, list);
  }
  return [...byCategory.entries()];
}

function SkillsScreen() {
  const { items: skills, setItems, isLoading, error } = useAdminList<Skill>('/api/admin/skills');

  const handleDelete = async (id: number) => {
    if (!confirm('T\'es sûr de vouloir supprimer cette compétence ?')) return;

    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  if (isLoading) {
    return <AdminSpinner label="Chargement des compétences..." />;
  }

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title="Gestion des Compétences"
        backHref="/admin/dashboard"
        actions={
          <Link href="/admin/skills/new" className="admin-btn-primary px-4 py-2 transition-all">
            ➕ Nouvelle compétence
          </Link>
        }
      />

      <main className="container mx-auto px-6 py-12">
        <AdminErrorBanner message={error} />

        {skills.length === 0 ? (
          <div className="text-center py-12">
            <p className="admin-text-muted mb-4">Aucune compétence pour le moment</p>
            <Link
              href="/admin/skills/new"
              className="admin-btn-primary inline-block px-6 py-3 transition-all"
            >
              Créer votre première compétence
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groupByCategory(skills).map(([category, categorySkills]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-4">{category}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="admin-card p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl" aria-hidden>
                          {skill.icon}
                        </span>
                        <h3 className="text-lg font-bold">{skill.name}</h3>
                      </div>

                      <p className="admin-text-muted text-sm mb-4">{skill.description}</p>

                      <div className="flex gap-2">
                        <Link
                          href={`/admin/skills/${skill.id}`}
                          className="admin-btn-secondary flex-1 px-4 py-2 text-center text-sm"
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          aria-label={`Supprimer ${skill.name}`}
                          className="admin-btn-danger px-4 py-2 text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminSkillsPage() {
  return (
    <AdminGuard loadingLabel="Chargement des compétences...">
      <SkillsScreen />
    </AdminGuard>
  );
}
