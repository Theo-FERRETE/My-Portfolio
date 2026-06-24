'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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

export default function NewProject() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    image: '',
    tags: '',
    link: '',
    github: '',
    featured: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
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
        setError(data.error || 'Oups, j\'ai pas pu créer le projet 😅');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Y\'a eu un souci, réessaie dans 2 secondes');
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Une seconde...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Chargement du formulaire...</p>
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
                Ajouter un projet
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
                Titre *
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
                Image *
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://unsplash.com/... ou /images/projects/mon-image.webp"
                className="admin-input w-full px-4 py-2"
                required
              />
              <p className="mt-1 text-sm admin-text-muted">
                URL de l'image ou un chemin local
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Technos utilisées *
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL..."
                className="admin-input w-full px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Lien *
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://..."
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
                Projet important (mettre en avant)
              </label>
            </div>

            <div className="flex gap-4 pt-6" style={{ borderTop: '1px solid var(--admin-border)' }}>
              <button
                type="submit"
                disabled={isSaving}
                className="admin-btn-primary flex-1 px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'J\'enregistre...' : 'Créer'}
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
