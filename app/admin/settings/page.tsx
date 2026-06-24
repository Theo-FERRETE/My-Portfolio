'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { THEMES, type Theme } from '@/app/components/providers/ThemeProvider';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [defaultTheme, setDefaultTheme] = useState<Theme>('obsidian');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeMessage, setThemeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.defaultTheme) setDefaultTheme(data.defaultTheme);
    } catch (error) {
      console.error('Erreur lors de la récupération des réglages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeSave = async (theme: Theme) => {
    setIsSavingTheme(true);
    setThemeMessage(null);
    setDefaultTheme(theme);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultTheme: theme }),
      });

      if (res.ok) {
        setThemeMessage({ type: 'success', text: 'Thème par défaut mis à jour ✨' });
      } else {
        setThemeMessage({ type: 'error', text: "Oups, j'ai pas pu sauvegarder 😅" });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setThemeMessage({ type: 'error', text: "Y'a eu un souci, réessaie" });
    } finally {
      setIsSavingTheme(false);
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
          <p className="admin-text-muted">Chargement des réglages...</p>
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
                Apparence du site
              </h1>
            </div>
            <AdminThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="admin-card p-8 space-y-6">
            {themeMessage && (
              <div
                className={`p-4 rounded-lg ${
                  themeMessage.type === 'success'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {themeMessage.text}
              </div>
            )}

            <div>
              <h2 className="text-xl font-bold mb-2">
                Thème du site (visiteurs)
              </h2>
              <p className="text-sm admin-text-muted mb-4">
                Thème vu par défaut par les nouveaux visiteurs. Chaque visiteur peut ensuite choisir le sien depuis le site, sa préférence prime sur ce réglage.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  disabled={isSavingTheme}
                  onClick={() => handleThemeSave(t.value)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: defaultTheme === t.value ? 'var(--admin-accent)' : 'var(--admin-border)',
                    background: defaultTheme === t.value ? 'color-mix(in srgb, var(--admin-accent) 12%, transparent)' : 'transparent',
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full"
                    style={{ background: t.swatch }}
                    aria-hidden
                  />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
