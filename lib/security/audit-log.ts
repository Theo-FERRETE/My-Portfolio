import { promises as fs } from 'fs';
import path from 'path';

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

const LOGS_DIR = path.join(process.cwd(), 'logs');
const LOGS_FILE = path.join(LOGS_DIR, 'audit.json');

async function initLogsFile(): Promise<void> {
  try {
    await fs.mkdir(LOGS_DIR, { recursive: true });
    
    try {
      await fs.access(LOGS_FILE);
    } catch {
      await fs.writeFile(LOGS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Erreur init logs:', error);
  }
}

export async function addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
  if (process.env.ENABLE_AUDIT_LOGS !== 'true') {
    return;
  }

  try {
    await initLogsFile();

    const logs = await readAuditLogs();
    
    const newEntry: AuditLogEntry = {
      ...entry,
      id: generateId(),
      timestamp: new Date().toISOString(),
    };

    logs.unshift(newEntry);

    if (logs.length > 1000) {
      logs.splice(1000);
    }

    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Erreur log:', error);
  }
}

export async function readAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    await initLogsFile();
    const content = await fs.readFile(LOGS_FILE, 'utf-8');
    return JSON.parse(content);
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
  let logs = await readAuditLogs();

  if (filters.userId) {
    logs = logs.filter(log => log.userId === filters.userId);
  }

  if (filters.action) {
    logs = logs.filter(log => log.action === filters.action);
  }

  if (filters.resource) {
    logs = logs.filter(log => log.resource === filters.resource);
  }

  if (filters.startDate) {
    logs = logs.filter(log => log.timestamp >= filters.startDate!);
  }

  if (filters.endDate) {
    logs = logs.filter(log => log.timestamp <= filters.endDate!);
  }

  if (filters.limit) {
    logs = logs.slice(0, filters.limit);
  }

  return logs;
}

export async function cleanOldLogs(daysToKeep: number = 90): Promise<void> {
  try {
    const logs = await readAuditLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const filteredLogs = logs.filter(log => {
      return new Date(log.timestamp) > cutoffDate;
    });

    await fs.writeFile(LOGS_FILE, JSON.stringify(filteredLogs, null, 2));
  } catch (error) {
    console.error('Erreur nettoyage:', error);
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
};
