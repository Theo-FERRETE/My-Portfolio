import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getSupabaseClient } from '@/lib/supabase';
import { getAuthConfig } from '@/lib/auth/auth-config';

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(),
}));

const ENV_KEYS = ['ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH', 'ADMIN_PASSWORD', 'DISABLE_2FA'] as const;
const originalEnv: Record<string, string | undefined> = {};

function mockStoredHash(hash: string | null) {
  vi.mocked(getSupabaseClient).mockReturnValue({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(async () => ({
            data: hash ? { admin_password_hash: hash } : null,
            error: null,
          })),
        })),
      })),
    })),
  } as unknown as ReturnType<typeof getSupabaseClient>);
}

beforeEach(() => {
  for (const key of ENV_KEYS) {
    originalEnv[key] = process.env[key];
    delete process.env[key];
  }
  vi.mocked(getSupabaseClient).mockReset();
});

afterEach(() => {
  for (const key of ENV_KEYS) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

describe('getAuthConfig', () => {
  it('throws when no ADMIN_PASSWORD_HASH is configured anywhere (no weak default fallback)', async () => {
    mockStoredHash(null);

    await expect(getAuthConfig()).rejects.toThrow('ADMIN_PASSWORD_HASH');
  });

  it('falls back to the default admin email when ADMIN_EMAIL is unset', async () => {
    mockStoredHash(null);
    process.env.ADMIN_PASSWORD_HASH = '$2b$10$customhashcustomhashcustomhashcustomha';

    const config = await getAuthConfig();

    expect(config.adminEmail).toBe('theo.ferrete@gmail.com');
  });

  it('defaults disableTwoFactor to false (secure by default) when DISABLE_2FA is unset', async () => {
    mockStoredHash(null);
    process.env.ADMIN_PASSWORD_HASH = '$2b$10$customhashcustomhashcustomhashcustomha';

    const config = await getAuthConfig();

    expect(config.disableTwoFactor).toBe(false);
  });

  it('uses ADMIN_EMAIL / ADMIN_PASSWORD_HASH env vars when no row is stored', async () => {
    mockStoredHash(null);
    process.env.ADMIN_EMAIL = 'Custom@Example.com';
    process.env.ADMIN_PASSWORD_HASH = '$2b$10$customhashcustomhashcustomhashcustomha';

    const config = await getAuthConfig();

    expect(config.adminEmail).toBe('custom@example.com');
    expect(config.adminPasswordHash).toBe('$2b$10$customhashcustomhashcustomhashcustomha');
  });

  it('prefers the stored DB hash over the ADMIN_PASSWORD_HASH env var', async () => {
    mockStoredHash('$2b$10$storedhashstoredhashstoredhashstoredha');
    process.env.ADMIN_PASSWORD_HASH = '$2b$10$envhashenvhashenvhashenvhashenvhashenv';

    const config = await getAuthConfig();

    expect(config.adminPasswordHash).toBe('$2b$10$storedhashstoredhashstoredhashstoredha');
  });

  it('respects DISABLE_2FA=true as an explicit opt-in', async () => {
    mockStoredHash(null);
    process.env.ADMIN_PASSWORD_HASH = '$2b$10$customhashcustomhashcustomhashcustomha';
    process.env.DISABLE_2FA = 'true';

    const config = await getAuthConfig();

    expect(config.disableTwoFactor).toBe(true);
  });

  it('strips wrapping quotes from env values (normalizeEnvValue)', async () => {
    mockStoredHash(null);
    process.env.ADMIN_PASSWORD_HASH = '$2b$10$customhashcustomhashcustomhashcustomha';
    process.env.ADMIN_EMAIL = '"Quoted@Example.com"';

    const config = await getAuthConfig();

    expect(config.adminEmail).toBe('quoted@example.com');
  });
});
