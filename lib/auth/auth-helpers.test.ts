import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { requireAuth, requireAdmin } from '@/lib/auth/auth-helpers';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth/auth', () => ({
  authOptions: {},
}));

beforeEach(() => {
  vi.mocked(getServerSession).mockReset();
});

describe('requireAuth', () => {
  it('returns a 401 NextResponse when there is no session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await requireAuth();

    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(401);
  });

  it('returns the session when authenticated', async () => {
    const session = { user: { email: 'user@test.local', role: 'user' } };
    vi.mocked(getServerSession).mockResolvedValue(session as never);

    const result = await requireAuth();

    expect(result).toEqual(session);
  });
});

describe('requireAdmin', () => {
  it('returns a 403 NextResponse when there is no session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const result = await requireAdmin();

    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(403);
  });

  it('returns a 403 NextResponse when the session is not an admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'user@test.local', role: 'user' },
    } as never);

    const result = await requireAdmin();

    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(403);
  });

  it('returns the session when the user is an admin', async () => {
    const session = { user: { email: 'admin@test.local', role: 'admin' } };
    vi.mocked(getServerSession).mockResolvedValue(session as never);

    const result = await requireAdmin();

    expect(result).toEqual(session);
  });
});
