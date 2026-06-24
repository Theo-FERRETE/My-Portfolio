'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  gradient: string;
  link: string;
  featured: boolean;
  order: number;
}

export default function AdminProjects() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('T\'es sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
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
          <p className="admin-text-muted">Deux secondes...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Chargement des projets...</p>
        </div>
      </div>
    );
  }

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
                Gestion des Projets
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <AdminThemeSwitcher />
              <Link
                href="/admin/projects/new"
                className="admin-btn-primary px-4 py-2 transition-all"
              >
                ➕ Nouveau projet
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="admin-text-muted mb-4">
              Aucun projet pour le moment
            </p>
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
              <div
                key={project.id}
                className="admin-card overflow-hidden"
              >
                {/* Header avec image */}
                <div className="relative h-48" style={{ background: 'var(--admin-background)' }}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {project.title}
                  </h3>
                  <p className="admin-text-muted text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
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

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="admin-btn-secondary flex-1 px-4 py-2 text-center text-sm"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
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
