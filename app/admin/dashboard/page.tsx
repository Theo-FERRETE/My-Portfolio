'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

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
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Une seconde...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du dashboard...</p>
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
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Compétences',
      description: 'Gérer ta stack technique',
      icon: '⚡',
      href: '/admin/skills',
      count: stats.skills,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Profil',
      description: 'Mettre à jour tes infos perso',
      icon: '👤',
      href: '/admin/profile',
      count: null,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Sécurité 2FA',
      description: 'Authentification à deux facteurs',
      icon: '🔐',
      href: '/admin/2fa',
      count: null,
      gradient: 'from-red-500 to-orange-500',
    },
    {
      title: 'Messages',
      description: 'Lire et repondre aux messages de contact',
      icon: '✉️',
      href: '/admin/messages',
      count: stats.messages,
      gradient: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                title="Retour au site"
              >
                <svg 
                  className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Content de te revoir Theo 👋
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Tes contenus
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Gradient header */}
                <div className={`h-32 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300"></div>
                  <span className="text-6xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {item.description}
                  </p>
                  {item.count !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {item.count}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        élément{item.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Effet de brillance */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Link>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            Envie d'ajouter quelque chose ?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/admin/projects?action=new"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="text-2xl">➕</span>
              <span className="font-semibold">Ajouter un projet</span>
            </Link>
            <Link
              href="/admin/skills?action=new"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
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
