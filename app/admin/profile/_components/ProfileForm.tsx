'use client';

import { useEffect, useState } from 'react';
import {
  AdminField,
  AdminStatusMessage,
  type StatusMessage,
} from '@/app/admin/_components';

interface ProfileValues {
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

const EMPTY: ProfileValues = {
  name: '',
  title: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  github: '',
  linkedin: '',
  twitter: '',
};

export default function ProfileForm({ onLoaded }: { onLoaded: () => void }) {
  const [profile, setProfile] = useState<ProfileValues>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (cancelled) return;
        setProfile({ ...EMPTY, ...data });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
      } finally {
        if (!cancelled) onLoaded();
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [onLoaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      setMessage(
        res.ok
          ? { type: 'success', text: "C'est bon, c'est sauvegardé ! 🚀" }
          : { type: 'error', text: "Oups, j'ai pas pu sauvegarder 😅" }
      );
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: "Y'a eu un souci, réessaie" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card p-8 space-y-6">
      <AdminStatusMessage message={message} />

      <section>
        <h2 className="text-xl font-bold mb-4">Infos perso</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Nom" required>
            {({ id, className }) => (
              <input
                id={id}
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className={className}
                required
              />
            )}
          </AdminField>

          <AdminField label="Titre" required>
            {({ id, className }) => (
              <input
                id={id}
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
                className={className}
                required
              />
            )}
          </AdminField>

          <div className="md:col-span-2">
            <AdminField label="Bio" required>
              {({ id, className }) => (
                <textarea
                  id={id}
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows={4}
                  className={className}
                  required
                />
              )}
            </AdminField>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Contact</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <AdminField label="Email" required>
            {({ id, className }) => (
              <input
                id={id}
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className={className}
                required
              />
            )}
          </AdminField>

          <AdminField label="Téléphone">
            {({ id, className }) => (
              <input
                id={id}
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className={className}
              />
            )}
          </AdminField>

          <div className="md:col-span-2">
            <AdminField label="Localisation">
              {({ id, className }) => (
                <input
                  id={id}
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className={className}
                />
              )}
            </AdminField>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Réseaux sociaux</h2>
        <div className="space-y-4">
          <AdminField label="GitHub">
            {({ id, className }) => (
              <input
                id={id}
                type="url"
                name="github"
                value={profile.github}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={className}
              />
            )}
          </AdminField>

          <AdminField label="LinkedIn">
            {({ id, className }) => (
              <input
                id={id}
                type="url"
                name="linkedin"
                value={profile.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className={className}
              />
            )}
          </AdminField>

          <AdminField label="Twitter">
            {({ id, className }) => (
              <input
                id={id}
                type="url"
                name="twitter"
                value={profile.twitter}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className={className}
              />
            )}
          </AdminField>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="admin-btn-primary px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "J'enregistre..." : 'Sauvegarder'}
        </button>
      </div>
    </form>
  );
}
