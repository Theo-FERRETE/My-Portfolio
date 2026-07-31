'use client';

import { useEffect, useState } from 'react';
import { THEMES, type Theme } from '@/app/components/providers/ThemeProvider';
import { AdminGuard, AdminPageHeader, AdminSpinner } from '@/app/admin/_components';

function SettingsScreen() {
  const [defaultTheme, setDefaultTheme] = useState<Theme>('obsidian');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingTheme, setIsSavingTheme] = useState(false);
  const [themeMessage, setThemeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (!cancelled && data.defaultTheme) setDefaultTheme(data.defaultTheme);
      } catch (error) {
        console.error('Erreur lors de la récupération des réglages:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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

  if (isLoading) {
    return <AdminSpinner label="Chargement des réglages..." />;
  }

  return (
    <div className="min-h-screen">
      <AdminPageHeader title="Apparence du site" backHref="/admin/dashboard" />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="admin-card p-8 space-y-6">
            {themeMessage && (
              <p
                role="status"
                className={`p-4 rounded-lg ${
                  themeMessage.type === 'success'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-red-500/10 text-red-400'
                }`}
              >
                {themeMessage.text}
              </p>
            )}

            <div>
              <h2 className="text-xl font-bold mb-2">Thème du site (visiteurs)</h2>
              <p className="text-sm admin-text-muted mb-4">
                Thème vu par défaut par les nouveaux visiteurs. Chaque visiteur peut ensuite
                choisir le sien depuis le site, sa préférence prime sur ce réglage.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  disabled={isSavingTheme}
                  aria-pressed={defaultTheme === t.value}
                  onClick={() => handleThemeSave(t.value)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: defaultTheme === t.value ? 'var(--admin-accent)' : 'var(--admin-border)',
                    background:
                      defaultTheme === t.value
                        ? 'color-mix(in srgb, var(--admin-accent) 12%, transparent)'
                        : 'transparent',
                  }}
                >
                  <span className="w-6 h-6 rounded-full" style={{ background: t.swatch }} aria-hidden />
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

export default function AdminSettingsPage() {
  return (
    <AdminGuard loadingLabel="Chargement des réglages...">
      <SettingsScreen />
    </AdminGuard>
  );
}
