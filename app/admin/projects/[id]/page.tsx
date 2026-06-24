'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface ProjectForm {
  title: string;
  description: string;
  image: string;
  tags: string;
  link: string;
  github: string;
  featured: boolean;
}

export default function EditProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    image: '',
    tags: '',
    link: '',
    github: '',
    featured: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProject();
    }
  }, [status, params.id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/admin/projects/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || '',
          description: data.description || '',
          image: data.image || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          link: data.link || '',
          github: data.github || '',
          featured: data.featured || false,
        });
      } else {
        setError('Ce projet existe pas');
        setTimeout(() => router.push('/admin/projects'), 2000);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('J\'arrive pas à charger ce projet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      const res = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
        }),
      });

      if (res.ok) {
        router.push('/admin/projects');
      } else {
        const data = await res.json();
        setError(data.error || 'Impossible de sauvegarder');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Oups, j\'ai pas pu sauvegarder');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">J\'charge...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="admin-header">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/projects"
                className="admin-text-muted hover:opacity-80"
              >
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold admin-text-accent">
                Éditer le projet
              </h1>
            </div>
            <AdminThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="admin-card p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Titre du projet *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="admin-input w-full px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="admin-input w-full px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                URL de l'image *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/... ou /images/projects/..."
                className="admin-input w-full px-4 py-2"
                required
              />
              <p className="mt-1 text-sm admin-text-muted">
                URL externe ou chemin local (/images/projects/mon-image.jpg)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Technologies (séparées par des virgules) *
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Next.js, TypeScript, Tailwind"
                className="admin-input w-full px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Lien du projet *
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://mon-projet.com"
                className="admin-input w-full px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Lien GitHub
              </label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="admin-input w-full px-4 py-2"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded"
                style={{ accentColor: 'var(--admin-accent)' }}
              />
              <label htmlFor="featured" className="ml-2 text-sm font-medium admin-text-muted">
                Mettre en avant ce projet
              </label>
            </div>

            <div className="flex gap-4 pt-6" style={{ borderTop: '1px solid var(--admin-border)' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="admin-btn-primary flex-1 px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'J\'enregistre...' : 'Sauvegarder'}
              </button>
              <Link
                href="/admin/projects"
                className="admin-btn-secondary px-6 py-3 transition-all"
              >
                Annuler
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
