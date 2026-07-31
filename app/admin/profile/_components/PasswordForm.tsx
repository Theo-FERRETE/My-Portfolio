'use client';

import { useState } from 'react';
import { AdminField, AdminStatusMessage, type StatusMessage } from '@/app/admin/_components';

const EMPTY = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function PasswordForm() {
  const [form, setForm] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({
          type: 'error',
          text: data?.error || 'Impossible de modifier le mot de passe',
        });
        return;
      }

      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès.' });
      setForm(EMPTY);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({
        type: 'error',
        text: 'Erreur serveur pendant la modification du mot de passe',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card mt-8 p-8 space-y-6">
      <AdminStatusMessage message={message} />

      <div>
        <h2 className="text-xl font-bold mb-2">Changer le mot de passe admin</h2>
        <p className="text-sm admin-text-muted mb-4">
          Le nouveau mot de passe est stocké en hash côté serveur. Tu n&apos;as plus besoin
          d&apos;éditer le .env pour chaque changement.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <AdminField label="Mot de passe actuel" required>
          {({ id, className }) => (
            <input
              id={id}
              type="password"
              name="currentPassword"
              autoComplete="current-password"
              value={form.currentPassword}
              onChange={handleChange}
              className={className}
              required
            />
          )}
        </AdminField>

        <AdminField label="Nouveau mot de passe" required>
          {({ id, className }) => (
            <input
              id={id}
              type="password"
              name="newPassword"
              autoComplete="new-password"
              value={form.newPassword}
              onChange={handleChange}
              className={className}
              required
            />
          )}
        </AdminField>

        <AdminField label="Confirmation" required>
          {({ id, className }) => (
            <input
              id={id}
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={className}
              required
            />
          )}
        </AdminField>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="admin-btn-primary px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
        </button>
      </div>
    </form>
  );
}
