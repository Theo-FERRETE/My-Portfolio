'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface SkillForm {
  name: string;
  category: string;
  icon: string;
  description: string;
}

export default function EditSkill() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<SkillForm>({
    name: '',
    category: '',
    icon: '⚡',
    description: '',
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
      fetchSkill();
    }
  }, [status, params.id]);

  const fetchSkill = async () => {
    try {
      const res = await fetch(`/api/admin/skills/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || '',
          category: data.category || '',
          icon: data.icon || '⚡',
          description: data.description || '',
        });
      } else {
        setError('Cette compétence existe pas');
        setTimeout(() => router.push('/admin/skills'), 2000);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('J\'ai pas réussi à charger');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/skills/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/admin/skills');
      } else {
        const data = await res.json();
        setError(data.error || 'Oups, ça a pas marché');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Impossible de sauvegarder');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Patiente 2 sec...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Chargement de la competence...</p>
        </div>
      </div>
    );
  }

  const categories = ['Frontend', 'Backend', 'DevOps', 'Database', 'Tools', 'Design'];

  return (
    <div className="min-h-screen">
      <header className="admin-header">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/skills"
                className="admin-text-muted hover:opacity-80"
              >
                ← Retour
              </Link>
              <h1 className="text-2xl font-bold admin-text-accent">
                Éditer la compétence
              </h1>
            </div>
            <AdminThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="admin-card p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Nom de la compétence *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="React, TypeScript, Node.js..."
                className="admin-input w-full px-4 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Catégorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="admin-input w-full px-4 py-2"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Icône (emoji) *
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="⚛️, 🚀, 💻..."
                className="admin-input w-full px-4 py-2"
                required
              />
              <p className="mt-1 text-sm admin-text-muted">
                Utilisez un emoji pour représenter cette compétence
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium admin-text-muted mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brève description de votre expérience avec cette technologie"
                className="admin-input w-full px-4 py-2"
                required
              />
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
                href="/admin/skills"
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
