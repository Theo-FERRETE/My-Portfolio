import { getSupabaseClient } from '@/lib/supabase';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
  success: boolean;
}

function mapAuditLogRow(row: any): AuditLogEntry {
  return {
    id: String(row.id),
    timestamp: row.timestamp,
    userId: row.user_id,
    action: row.action,
    resource: row.resource,
    resourceId: row.resource_id ?? undefined,
    details: row.details ?? undefined,
    ip: row.ip ?? undefined,
    userAgent: row.user_agent ?? undefined,
    success: row.success,
  };
}

export async function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  if (process.env.ENABLE_AUDIT_LOGS !== 'true') {
    return;
  }

  try {
    const { error } = await getSupabaseClient().from('audit_logs').insert({
      user_id: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resource_id: entry.resourceId ?? null,
      details: entry.details ?? null,
      ip: entry.ip ?? null,
      user_agent: entry.userAgent ?? null,
      success: entry.success,
    });
    if (error) throw error;
  } catch (error) {
    console.error('Erreur log:', error);
  }
}

export async function readAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const { data, error } = await getSupabaseClient()
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1000);
    if (error) throw error;
    return (data ?? []).map(mapAuditLogRow);
  } catch (error) {
    console.error('Erreur lecture logs:', error);
    return [];
  }
}

export async function filterAuditLogs(filters: {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<AuditLogEntry[]> {
  let query = getSupabaseClient()
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false });

  if (filters.userId) query = query.eq('user_id', filters.userId);
  if (filters.action) query = query.eq('action', filters.action);
  if (filters.resource) query = query.eq('resource', filters.resource);
  if (filters.startDate) query = query.gte('timestamp', filters.startDate);
  if (filters.endDate) query = query.lte('timestamp', filters.endDate);

  query = query.limit(filters.limit ?? 1000);

  const { data, error } = await query;
  if (error) {
    console.error('Erreur filtrage logs:', error);
    return [];
  }
  return (data ?? []).map(mapAuditLogRow);
}

export async function cleanOldLogs(daysToKeep: number = 90): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { error } = await getSupabaseClient()
      .from('audit_logs')
      .delete()
      .lt('timestamp', cutoffDate.toISOString());
    if (error) throw error;
  } catch (error) {
    console.error('Erreur nettoyage:', error);
  }
}

export const auditActions = {
  login: (userId: string, ip?: string, success: boolean = true) =>
    addAuditLog({
      userId,
      action: 'LOGIN',
      resource: 'auth',
      ip,
      success,
    }),

  logout: (userId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'LOGOUT',
      resource: 'auth',
      ip,
      success: true,
    }),

  createProject: (userId: string, projectId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'CREATE',
      resource: 'project',
      resourceId: projectId,
      ip,
      success: true,
    }),

  updateProject: (userId: string, projectId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'UPDATE',
      resource: 'project',
      resourceId: projectId,
      ip,
      success: true,
    }),

  deleteProject: (userId: string, projectId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'DELETE',
      resource: 'project',
      resourceId: projectId,
      ip,
      success: true,
    }),

  createSkill: (userId: string, skillId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'CREATE',
      resource: 'skill',
      resourceId: skillId,
      ip,
      success: true,
    }),

  updateSkill: (userId: string, skillId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'UPDATE',
      resource: 'skill',
      resourceId: skillId,
      ip,
      success: true,
    }),

  deleteSkill: (userId: string, skillId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'DELETE',
      resource: 'skill',
      resourceId: skillId,
      ip,
      success: true,
    }),

  updateProfile: (userId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'UPDATE',
      resource: 'profile',
      ip,
      success: true,
    }),

  updateSettings: (userId: string, ip?: string) =>
    addAuditLog({
      userId,
      action: 'UPDATE',
      resource: 'settings',
      ip,
      success: true,
    }),
};
