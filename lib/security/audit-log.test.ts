import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSupabaseClient } from '@/lib/supabase';
import { addAuditLog, filterAuditLogs } from '@/lib/security/audit-log';

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(),
}));

const originalEnableAuditLogs = process.env.ENABLE_AUDIT_LOGS;

beforeEach(() => {
  vi.mocked(getSupabaseClient).mockReset();
});

afterEach(() => {
  if (originalEnableAuditLogs === undefined) delete process.env.ENABLE_AUDIT_LOGS;
  else process.env.ENABLE_AUDIT_LOGS = originalEnableAuditLogs;
});

describe('addAuditLog', () => {
  it('is a no-op and never touches Supabase when ENABLE_AUDIT_LOGS is not "true"', async () => {
    delete process.env.ENABLE_AUDIT_LOGS;

    await addAuditLog({ userId: 'u1', action: 'LOGIN', resource: 'auth', success: true });

    expect(getSupabaseClient).not.toHaveBeenCalled();
  });

  it('inserts a row when ENABLE_AUDIT_LOGS is "true"', async () => {
    process.env.ENABLE_AUDIT_LOGS = 'true';
    const insert = vi.fn(async () => ({ error: null }));
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() => ({ insert })),
    } as unknown as ReturnType<typeof getSupabaseClient>);

    await addAuditLog({ userId: 'u1', action: 'LOGIN', resource: 'auth', success: true });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: 'u1', action: 'LOGIN', resource: 'auth', success: true })
    );
  });

  it('swallows Supabase errors instead of throwing', async () => {
    process.env.ENABLE_AUDIT_LOGS = 'true';
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() => ({
        insert: vi.fn(async () => ({ error: new Error('db down') })),
      })),
    } as unknown as ReturnType<typeof getSupabaseClient>);

    await expect(
      addAuditLog({ userId: 'u1', action: 'LOGIN', resource: 'auth', success: true })
    ).resolves.toBeUndefined();
  });
});

describe('filterAuditLogs', () => {
  it('chains the right query builder calls for the given filters', async () => {
    process.env.ENABLE_AUDIT_LOGS = 'true';

    const query: Record<string, unknown> = {};
    query.eq = vi.fn(() => query);
    query.gte = vi.fn(() => query);
    query.lte = vi.fn(() => query);
    query.limit = vi.fn(async () => ({ data: [], error: null }));
    const order = vi.fn(() => query);
    const select = vi.fn(() => ({ order }));

    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() => ({ select })),
    } as unknown as ReturnType<typeof getSupabaseClient>);

    await filterAuditLogs({ userId: 'u1', action: 'LOGIN', startDate: '2026-01-01' });

    expect(query.eq).toHaveBeenCalledWith('user_id', 'u1');
    expect(query.eq).toHaveBeenCalledWith('action', 'LOGIN');
    expect(query.gte).toHaveBeenCalledWith('timestamp', '2026-01-01');
    expect(query.lte).not.toHaveBeenCalled();
    expect(query.limit).toHaveBeenCalledWith(1000);
  });

  it('returns an empty array and does not throw when the query errors', async () => {
    const query: Record<string, unknown> = {};
    query.eq = vi.fn(() => query);
    query.gte = vi.fn(() => query);
    query.lte = vi.fn(() => query);
    query.limit = vi.fn(async () => ({ data: null, error: new Error('db down') }));
    const order = vi.fn(() => query);
    const select = vi.fn(() => ({ order }));

    vi.mocked(getSupabaseClient).mockReturnValue({
      from: vi.fn(() => ({ select })),
    } as unknown as ReturnType<typeof getSupabaseClient>);

    await expect(filterAuditLogs({})).resolves.toEqual([]);
  });
});
