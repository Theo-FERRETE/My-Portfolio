'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

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
      
      // ✅ Connexion réussie - redirection automatique
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError('Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Admin Portfolio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connectez-vous pour gérer votre portfolio
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* 🔐 Message 2FA */}
            {error && error.includes('2FA') && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                placeholder="votre-email@domaine.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {/* 🔐 Champ 2FA (toujours visible, optionnel) */}
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2"
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Si la 2FA est activée, entrez le code à 6 chiffres de Google Authenticator
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        {/* Info de développement */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Interface d&apos;administration sécurisée</p>
        </div>
      </div>
    </div>
  );
}
