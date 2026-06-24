'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminThemeSwitcher from '@/app/admin/_theme/AdminThemeSwitcher';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ip?: string;
  success: boolean;
}

export default function AuditLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ action: '', resource: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchLogs();
    }
  }, [status, filter]);

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.action) params.append('action', filter.action);
      if (filter.resource) params.append('resource', filter.resource);

      const res = await fetch(`/api/admin/audit-logs?${params}`);
      const data = await res.json();
      setLogs(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Patiente 2 sec...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--admin-accent)', borderTopColor: 'transparent' }}></div>
          <p className="admin-text-muted">Chargement des logs...</p>
        </div>
      </div>
    );
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-500/15 text-green-400';
      case 'UPDATE': return 'bg-blue-500/15 text-blue-400';
      case 'DELETE': return 'bg-red-500/15 text-red-400';
      case 'LOGIN': return 'bg-purple-500/15 text-purple-400';
      case 'LOGOUT': return 'bg-white/10 admin-text-muted';
      default: return 'bg-white/10 admin-text-muted';
    }
  };

  return (
    <div className="min-h-screen">
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
                Logs d'Audit
              </h1>
            </div>
            <AdminThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Filtres */}
        <div className="admin-card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Filtres</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 admin-text-muted">
                Action
              </label>
              <select
                value={filter.action}
                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                className="admin-input w-full px-4 py-2"
              >
                <option value="">Toutes</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="LOGIN">LOGIN</option>
                <option value="LOGOUT">LOGOUT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 admin-text-muted">
                Ressource
              </label>
              <select
                value={filter.resource}
                onChange={(e) => setFilter({ ...filter, resource: e.target.value })}
                className="admin-input w-full px-4 py-2"
              >
                <option value="">Toutes</option>
                <option value="project">Projets</option>
                <option value="skill">Compétences</option>
                <option value="profile">Profil</option>
                <option value="auth">Authentification</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des logs */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: 'var(--admin-background)' }}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-muted uppercase tracking-wider">
                    Date/Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-muted uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-muted uppercase tracking-wider">
                    Ressource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-muted uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium admin-text-muted uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="admin-divide">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:opacity-90">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {log.resource}
                      {log.resourceId && <span className="admin-text-muted"> #{log.resourceId}</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm admin-text-muted">
                      {log.ip || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.success ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <span className="text-red-400">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {logs.length === 0 && (
              <div className="text-center py-12 admin-text-muted">
                Aucun log trouvé
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
