import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/data';
import { requireAdmin } from '@/lib/auth';
import { auditActions } from '@/lib/security';
import { GET, POST } from './route';

vi.mock('@/lib/data', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/data')>();
  return {
    ...actual,
    getProjects: vi.fn(),
    createProject: vi.fn(),
  };
});

vi.mock('@/lib/auth', () => ({
  requireAdmin: vi.fn(),
}));

vi.mock('@/lib/security', () => ({
  auditActions: { createProject: vi.fn() },
  getClientIp: vi.fn(() => '127.0.0.1'),
}));

const ADMIN_SESSION = { user: { email: 'admin@test.local', role: 'admin' } };

const VALID_BODY = {
  title: 'My project',
  description: 'A description',
  tags: ['nextjs'],
  featured: false,
};

function postRequest(body: unknown) {
  return new NextRequest('http://localhost/api/admin/projects', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

beforeEach(() => {
  vi.mocked(getProjects).mockReset();
  vi.mocked(createProject).mockReset();
  vi.mocked(requireAdmin).mockReset();
  vi.mocked(auditActions.createProject).mockReset();
});

describe('GET /api/admin/projects', () => {
  it('returns the project list with 200', async () => {
    vi.mocked(getProjects).mockResolvedValue([{ id: 1 } as never]);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ id: 1 }]);
  });

  it('returns a generic 500 without leaking error details when getProjects rejects', async () => {
    vi.mocked(getProjects).mockRejectedValue(new Error('supabase timeout: secret internal detail'));

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Erreur serveur');
    expect(JSON.stringify(body)).not.toContain('secret internal detail');
  });
});

describe('POST /api/admin/projects', () => {
  it('returns 401/403 from requireAdmin before parsing the body when unauthenticated', async () => {
    const unauthorized = NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    vi.mocked(requireAdmin).mockResolvedValue(unauthorized);

    const response = await POST(postRequest(VALID_BODY));

    expect(response.status).toBe(403);
    expect(createProject).not.toHaveBeenCalled();
  });

  it('creates the project, audit-logs it, and returns 201 for a valid authenticated request', async () => {
    vi.mocked(requireAdmin).mockResolvedValue(ADMIN_SESSION as never);
    vi.mocked(createProject).mockResolvedValue({ id: 42, ...VALID_BODY, createdAt: 'now' } as never);

    const response = await POST(postRequest(VALID_BODY));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.id).toBe(42);
    expect(createProject).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'My project', tags: ['nextjs'] })
    );
    expect(auditActions.createProject).toHaveBeenCalledWith('admin@test.local', '42', '127.0.0.1');
  });

  it('returns 400 with validation issues and does not call createProject for an invalid body', async () => {
    vi.mocked(requireAdmin).mockResolvedValue(ADMIN_SESSION as never);

    const response = await POST(postRequest({ title: '' }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Données invalides');
    expect(Array.isArray(body.issues)).toBe(true);
    expect(createProject).not.toHaveBeenCalled();
  });
});
