'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  AdminErrorBanner,
  AdminGuard,
  AdminPageHeader,
  AdminSpinner,
} from '@/app/admin/_components';
import { useAdminList } from '@/app/admin/_hooks/use-admin-list';
import type { Project } from '@/lib/data';

function ProjectsScreen() {
  const { items: projects, setItems, isLoading, error } = useAdminList<Project>('/api/admin/projects');

  const handleDelete = async (id: number) => {
    if (!confirm('T\'es sûr de vouloir supprimer ce projet ?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  if (isLoading) {
    return <AdminSpinner label="Chargement des projets..." />;
  }

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title="Gestion des Projets"
        backHref="/admin/dashboard"
        actions={
          <Link href="/admin/projects/new" className="admin-btn-primary px-4 py-2 transition-all">
            ➕ Nouveau projet
          </Link>
        }
      />

      <main className="container mx-auto px-6 py-12">
        <AdminErrorBanner message={error} />

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="admin-text-muted mb-4">Aucun projet pour le moment</p>
            <Link
              href="/admin/projects/new"
              className="admin-btn-primary inline-block px-6 py-3 transition-all"
            >
              Créer votre premier projet
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="admin-card overflow-hidden">
                <div className="relative h-48" style={{ background: 'var(--admin-background)' }}>
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                  <p className="admin-text-muted text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded admin-text-accent"
                        style={{ background: 'color-mix(in srgb, var(--admin-accent) 15%, transparent)' }}
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs admin-text-muted">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="admin-btn-secondary flex-1 px-4 py-2 text-center text-sm"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      aria-label={`Supprimer ${project.title}`}
                      className="admin-btn-danger px-4 py-2 text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <AdminGuard loadingLabel="Chargement des projets...">
      <ProjectsScreen />
    </AdminGuard>
  );
}
