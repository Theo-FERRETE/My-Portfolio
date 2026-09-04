'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { AdminGuard, AdminPageHeader } from '@/app/admin/_components';

interface Stats {
  projects: number;
  skills: number;
  messages: number;
}

const EMPTY_STATS: Stats = { projects: 0, skills: 0, messages: 0 };

function DashboardScreen() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  const fetchStats = useCallback(async () => {
    try {
      const [projectsRes, skillsRes, messagesRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/skills'),
        fetch('/api/admin/contact-messages'),
      ]);

      const [projects, skills, messages] = await Promise.all([
        projectsRes.json(),
        skillsRes.json(),
        messagesRes.json(),
      ]);

      setStats({
        projects: projects.length || 0,
        skills: skills.length || 0,
        messages: (messages || []).filter(
          (message: { status: string }) => message.status === 'new'
        ).length,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  }, []);

  useEffect(() => {
    // fetchStats ne modifie l'état qu'après ses appels réseau (asynchrone),
    // pas de façon synchrone dans le corps de l'effet.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  const menuItems = [
    {
      title: 'Projets',
      description: 'Ajouter ou modifier tes projets',
      icon: '🚀',
      href: '/admin/projects',
      count: stats.projects,
    },
    {
      title: 'Compétences',
      description: 'Gérer ta stack technique',
      icon: '⚡',
      href: '/admin/skills',
      count: stats.skills,
    },
    {
      title: 'Profil',
      description: 'Mettre à jour tes infos perso',
      icon: '👤',
      href: '/admin/profile',
      count: null,
    },
    {
      title: 'Sécurité 2FA',
      description: 'Authentification à deux facteurs',
      icon: '🔐',
      href: '/admin/2fa',
      count: null,
    },
    {
      title: 'Messages',
      description: 'Lire et répondre aux messages de contact',
      icon: '✉️',
      href: '/admin/messages',
      count: stats.messages,
    },
  ];

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Content de te revoir Theo 👋"
        backHref="/"
        backAriaLabel="Retour au site"
        backLabel={<ArrowLeft className="w-6 h-6" />}
        actions={
          <button
            onClick={() => signOut({ callbackUrl: '/', redirect: true })}
            className="admin-btn-secondary px-4 py-2"
          >
            Déconnexion
          </button>
        }
      />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Tes contenus</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="admin-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-32 flex items-center justify-center relative overflow-hidden bg-[color-mix(in_srgb,var(--admin-accent)_15%,transparent)]">
                  <span
                    className="text-6xl relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="admin-text-muted text-sm mb-4">{item.description}</p>
                  {item.count !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold admin-text-accent">{item.count}</span>
                      <span className="text-sm admin-text-muted">
                        élément{item.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card p-8">
          <h2 className="text-2xl font-bold mb-6">Envie d&apos;ajouter quelque chose ?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin/projects/new"
              className="admin-btn-primary flex items-center gap-3 p-4 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="text-2xl" aria-hidden>
                ➕
              </span>
              <span className="font-semibold">Ajouter un projet</span>
            </Link>
            <Link
              href="/admin/skills/new"
              className="admin-btn-primary flex items-center gap-3 p-4 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="text-2xl" aria-hidden>
                ⚡
              </span>
              <span className="font-semibold">Ajouter une compétence</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard loadingLabel="Chargement du dashboard...">
      <DashboardScreen />
    </AdminGuard>
  );
}
