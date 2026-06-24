'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export default function AdminProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    twitter: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile');
      const data = await res.json();
      setProfile({
        name: data.name || '',
        title: data.title || '',
        bio: data.bio || '',
        email: data.email ||'',
        phone: data.phone || '',
        location: data.location || '',
        github: data.github || '',
        linkedin: data.linkedin || '',
        twitter: data.twitter || '',
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'C\'est bon, c\'est sauvegardé ! 🚀' });
      } else {
        setMessage({ type: 'error', text: 'Oups, j\'ai pas pu sauvegarder 😅' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Y\'a eu un souci, réessaie' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage(null);

    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordMessage({
          type: 'error',
          text: data?.error || 'Impossible de modifier le mot de passe',
        });
        return;
      }

      setPasswordMessage({
        type: 'success',
        text: 'Mot de passe mis a jour avec succes.',
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setPasswordMessage({
        type: 'error',
        text: 'Erreur serveur pendant la modification du mot de passe',
      });
    } finally {
      setIsChangingPassword(false);
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
          <p className="admin-text-muted">Chargement du profil...</p>
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
                Mon Profil
              </h1>
            </div>
            <AdminThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="admin-card p-8 space-y-6">
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Informations personnelles */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                Infos perso
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="admin-input w-full px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={profile.title}
                    onChange={handleChange}
                    className="admin-input w-full px-4 py-2"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows={4}
                    className="admin-input w-full px-4 py-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-xl font-bold mb-4">Contact</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="admin-input w-full px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="admin-input w-full px-4 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    Localisation
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className="admin-input w-full px-4 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                Réseaux sociaux
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    GitHub
                  </label>
                  <input
                    type="url"
                    name="github"
                    value={profile.github}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="admin-input w-full px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    name="linkedin"
                    value={profile.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="admin-input w-full px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium admin-text-muted mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/..."
                    className="admin-input w-full px-4 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="admin-btn-primary px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'J\'enregistre...' : 'Sauvegarder'}
              </button>
            </div>
          </form>

          <form onSubmit={handlePasswordChange} className="admin-card mt-8 p-8 space-y-6">
            {passwordMessage && (
              <div
                className={`p-4 rounded-lg ${
                  passwordMessage.type === 'success'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold mb-2">
                Changer le mot de passe admin
              </h2>
              <p className="text-sm admin-text-muted mb-4">
                Le nouveau mot de passe est stocke en hash cote serveur. Tu n&apos;as plus besoin d&apos;editer le .env pour chaque changement.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium admin-text-muted mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="admin-input w-full px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium admin-text-muted mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="admin-input w-full px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium admin-text-muted mb-2">
                  Confirmation
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="admin-input w-full px-4 py-2"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="admin-btn-primary px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? 'Mise a jour...' : 'Mettre a jour le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
