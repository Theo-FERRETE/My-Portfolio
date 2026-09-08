'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Rocket, Zap, User, Shield, Mail, Plus, type LucideIcon } from 'lucide-react';
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

  const compactItems: { title: string; description: string; icon: LucideIcon; color: string; href: string; count: number | null; alert?: boolean; createHref?: string }[] = [
    {
      title: 'Compétences',
      description: 'Ta stack technique',
      icon: Zap,
      color: '#ffb86b',
      href: '/admin/skills',
      count: stats.skills,
      createHref: '/admin/skills/new',
    },
    {
      title: 'Profil',
      description: 'Tes infos perso',
      icon: User,
      color: '#7ee787',
      href: '/admin/profile',
      count: null,
    },
    {
      title: 'Sécurité 2FA',
      description: 'Double authentification',
      icon: Shield,
      color: '#4fd6b0',
      href: '/admin/2fa',
      count: null,
    },
    {
      title: 'Messages',
      description: 'Messages de contact',
      icon: Mail,
      color: '#ff3b3b',
      href: '/admin/messages',
      count: stats.messages,
      alert: stats.messages > 0,
    },
  ];

  return (
    <div className="min-h-screen">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Content de te revoir Theo"
        icon={LayoutDashboard}
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
        <h2 className="text-3xl font-bold mb-6">Tes contenus</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 md:auto-rows-[152px]">
          {/* Carte vedette : Projets, sur 2 colonnes et 2 rangées. Lien étiré (pas de <Link> imbriqué) : la carte
              mène aux projets, le bouton + reste cliquable indépendamment grâce à son z-index supérieur. */}
          <div className="admin-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 col-span-2 row-span-2 flex flex-col">
            <div
              className="flex-1 flex items-center justify-center relative overflow-hidden min-h-24"
              style={{ background: 'color-mix(in srgb, var(--admin-accent) 15%, transparent)' }}
            >
              <Rocket
                size={56}
                className="relative z-0 transform group-hover:scale-110 transition-transform duration-300"
                style={{ color: 'var(--admin-accent)' }}
                aria-hidden
              />
              <Link
                href="/admin/projects/new"
                aria-label="Ajouter un projet"
                className="admin-btn-primary absolute top-3 right-3 p-2 z-10 hover:scale-110 transition-transform"
              >
                <Plus size={18} aria-hidden />
              </Link>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">
                <Link href="/admin/projects" className="after:absolute after:inset-0">
                  Projets
                </Link>
              </h3>
              <p className="admin-text-muted text-sm mb-4">Ajouter ou modifier tes projets</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold admin-text-accent">{stats.projects}</span>
                <span className="text-sm admin-text-muted">
                  projet{stats.projects > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Les 4 autres, compactes autour de la vedette */}
          {compactItems.map((item) => (
            <div
              key={item.title}
              className="admin-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 p-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div
                  className="p-2.5 rounded-lg relative"
                  style={{ background: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
                >
                  <item.icon
                    size={20}
                    className="transform group-hover:scale-110 transition-transform duration-300"
                    style={{ color: item.color }}
                    aria-hidden
                  />
                  {item.alert && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                      style={{ background: item.color }}
                      aria-hidden
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 relative z-10">
                  {item.count !== null && (
                    <span className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.count}
                    </span>
                  )}
                  {item.createHref && (
                    <Link
                      href={item.createHref}
                      aria-label={`Ajouter : ${item.title}`}
                      className="admin-btn-secondary p-1.5 hover:scale-110 transition-transform"
                    >
                      <Plus size={14} aria-hidden />
                    </Link>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-bold">
                  <Link href={item.href} className="after:absolute after:inset-0">
                    {item.title}
                  </Link>
                </h3>
                <p className="admin-text-muted text-xs">{item.description}</p>
              </div>
            </div>
          ))}
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
