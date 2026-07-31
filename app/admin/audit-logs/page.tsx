'use client';

import { useMemo, useState } from 'react';
import { AdminGuard, AdminPageHeader, AdminSpinner } from '@/app/admin/_components';
import { useAdminList } from '@/app/admin/_hooks/use-admin-list';

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

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-500/15 text-green-400',
  UPDATE: 'bg-blue-500/15 text-blue-400',
  DELETE: 'bg-red-500/15 text-red-400',
  LOGIN: 'bg-purple-500/15 text-purple-400',
};

const DEFAULT_ACTION_COLOR = 'bg-white/10 admin-text-muted';

const ACTIONS = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];

const RESOURCES = [
  { value: 'project', label: 'Projets' },
  { value: 'skill', label: 'Compétences' },
  { value: 'profile', label: 'Profil' },
  { value: 'auth', label: 'Authentification' },
];

function AuditLogsScreen() {
  const [filter, setFilter] = useState({ action: '', resource: '' });

  // L'URL fait partie de la clé de chargement : changer un filtre relance la requête.
  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    if (filter.action) params.append('action', filter.action);
    if (filter.resource) params.append('resource', filter.resource);
    return `/api/admin/audit-logs?${params}`;
  }, [filter.action, filter.resource]);

  const { items: logs, isLoading } = useAdminList<AuditLog>(endpoint);

  return (
    <div className="min-h-screen">
      <AdminPageHeader title="Logs d'Audit" backHref="/admin/dashboard" />

      <main className="container mx-auto px-6 py-12">
        <div className="admin-card p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Filtres</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filter-action" className="block text-sm font-medium mb-2 admin-text-muted">
                Action
              </label>
              <select
                id="filter-action"
                value={filter.action}
                onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                className="admin-input w-full px-4 py-2"
              >
                <option value="">Toutes</option>
                {ACTIONS.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-resource" className="block text-sm font-medium mb-2 admin-text-muted">
                Ressource
              </label>
              <select
                id="filter-resource"
                value={filter.resource}
                onChange={(e) => setFilter({ ...filter, resource: e.target.value })}
                className="admin-input w-full px-4 py-2"
              >
                <option value="">Toutes</option>
                {RESOURCES.map((resource) => (
                  <option key={resource.value} value={resource.value}>
                    {resource.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <AdminSpinner label="Chargement des logs..." />
        ) : (
          <div className="admin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ background: 'var(--admin-background)' }}>
                  <tr>
                    {['Date/Heure', 'Action', 'Ressource', 'IP', 'Statut'].map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium admin-text-muted uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="admin-divide">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:opacity-90">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            ACTION_COLORS[log.action] ?? DEFAULT_ACTION_COLOR
                          }`}
                        >
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
                          <span className="text-green-400" title="Succès">
                            ✓
                          </span>
                        ) : (
                          <span className="text-red-400" title="Échec">
                            ✗
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {logs.length === 0 && (
                <p className="text-center py-12 admin-text-muted">Aucun log trouvé</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <AdminGuard loadingLabel="Chargement des logs...">
      <AuditLogsScreen />
    </AdminGuard>
  );
}
