'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const [projectsRes, skillsRes, messagesRes] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/skills'),
        fetch('/api/admin/contact-messages'),
      ]);

      const projects = await projectsRes.json();
      const skills = await skillsRes.json();
      const messages = await messagesRes.json();

      setStats({
        projects: projects.length || 0,
        skills: skills.length || 0,
        messages: (messages || []).filter((message: { status: string }) => message.status === 'new').length,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    }
  };

  const handleSignOut = async () => {
    // Clear local state
    setStats({ projects: 0, skills: 0, messages: 0 });
    
    // Sign out avec NextAuth et redirection vers l'accueil
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Une seconde...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

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
      title: 'Apparence',
      description: 'Thème par défaut vu par les visiteurs',
      icon: '🎨',
      href: '/admin/settings',
      count: null,
    },
    {
      title: 'Messages',
      description: 'Lire et repondre aux messages de contact',
      icon: '✉️',
      href: '/admin/messages',
      count: stats.messages,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="admin-header">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-lg hover:opacity-80 transition-colors admin-text-muted"
                title="Retour au site"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold admin-text-accent">
                  Dashboard
                </h1>
                <p className="text-sm admin-text-muted mt-1">
                  Content de te revoir Theo 👋
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AdminThemeSwitcher />
              <button
                onClick={handleSignOut}
                className="admin-btn-secondary px-4 py-2"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12">
        {/* Statistiques */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">
            Tes contenus
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="admin-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header icône */}
                <div className="h-32 flex items-center justify-center relative overflow-hidden bg-[color-mix(in_srgb,var(--admin-accent)_15%,transparent)]">
                  <span className="text-6xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="admin-text-muted text-sm mb-4">
                    {item.description}
                  </p>
                  {item.count !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold admin-text-accent">
                        {item.count}
                      </span>
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

        {/* Actions rapides */}
        <div className="admin-card p-8">
          <h2 className="text-2xl font-bold mb-6">
            Envie d'ajouter quelque chose ?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin/projects?action=new"
              className="admin-btn-primary flex items-center gap-3 p-4 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="text-2xl">➕</span>
              <span className="font-semibold">Ajouter un projet</span>
            </Link>
            <Link
              href="/admin/skills?action=new"
              className="admin-btn-primary flex items-center gap-3 p-4 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="text-2xl">⚡</span>
              <span className="font-semibold">Ajouter une compétence</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
