'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    token: '', // 🔐 Code 2FA
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const tokenInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        token: formData.token || undefined, // Envoyer le code 2FA si présent
        redirect: false,
      });

      if (result?.error) {
        // Gérer les différentes erreurs
        if (result.error === '2FA_REQUIRED') {
          setError('Code 2FA requis - Entrez le code de votre application Authenticator');
          tokenInputRef.current?.focus();
        } else if (result.error === 'Code 2FA invalide') {
          setError('Code 2FA invalide ou expiré');
          setFormData({ ...formData, token: '' });
          tokenInputRef.current?.focus();
        } else {
          setError(result.error || 'Email ou mot de passe incorrect');
        }
        setIsLoading(false);
        return;
      }
      
      // ✅ Connexion réussie - navigation complète pour fiabiliser l'hydratation de session
      window.location.assign('/admin/dashboard');
    } catch (err) {
      setError('Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AdminThemeSwitcher className="fixed top-4 right-4" />

      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold admin-text-accent mb-2">
            Admin Portfolio
          </h1>
          <p className="admin-text-muted">
            Connectez-vous pour gérer votre portfolio
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="admin-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Message 2FA */}
            {error && error.includes('2FA') && (
              <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold admin-text-muted mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="admin-input w-full px-4 py-3 transition-all"
                placeholder="votre-email@domaine.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold admin-text-muted mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="admin-input w-full px-4 py-3 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Champ 2FA (toujours visible, optionnel) */}
            <div>
              <label
                htmlFor="token"
                className="flex items-center gap-2 text-sm font-semibold admin-text-muted mb-2"
              >
                <Shield className="w-4 h-4" />
                Code 2FA (optionnel)
              </label>
              <input
                ref={tokenInputRef}
                type="text"
                id="token"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                maxLength={6}
                autoComplete="off"
                className="admin-input w-full px-4 py-3 transition-all text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="mt-2 text-xs admin-text-muted">
                Si la 2FA est activée, entrez le code à 6 chiffres de Google Authenticator
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="admin-btn-primary w-full px-6 py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Info de développement */}
        <div className="mt-6 text-center text-sm admin-text-muted">
          <p>Interface d&apos;administration sécurisée</p>
        </div>
      </div>
    </div>
  );
}
