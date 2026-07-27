import { describe, it, expect, vi, beforeEach } from 'vitest';
import speakeasy from 'speakeasy';
import { getSupabaseClient } from '@/lib/supabase';
import {
  generateTwoFactorSecret,
  verifyTwoFactorToken,
  enableTwoFactor,
  isTwoFactorEnabled,
  getBackupCodes,
  regenerateBackupCodes,
} from '@/lib/auth/two-factor';

vi.mock('@/lib/supabase', () => ({
  getSupabaseClient: vi.fn(),
}));

interface StoredRow {
  email: string;
  enabled: boolean;
  secret: string | null;
  backup_codes: string[] | null;
  enabled_at: string | null;
}

function createSupabaseMock(seed: Record<string, StoredRow> = {}) {
  const store: Record<string, StoredRow> = { ...seed };

  const from = vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn((_col: string, email: string) => ({
        maybeSingle: vi.fn(async () => ({
          data: store[email] ?? null,
          error: null,
        })),
      })),
    })),
    upsert: vi.fn(async (row: StoredRow) => {
      store[row.email] = row;
      return { error: null };
    }),
  }));

  return { client: { from } as unknown as ReturnType<typeof getSupabaseClient>, store };
}

const EMAIL = 'admin@test.local';

beforeEach(() => {
  vi.mocked(getSupabaseClient).mockReset();
});

describe('generateTwoFactorSecret', () => {
  it('returns a base32 secret, a QR data URL, and 10 backup codes', async () => {
    const result = await generateTwoFactorSecret(EMAIL);

    expect(result.secret).toMatch(/^[A-Z2-7]+=*$/);
    expect(result.qrCode).toMatch(/^data:image\/png;base64,/);
    expect(result.backupCodes).toHaveLength(10);
    for (const code of result.backupCodes) {
      expect(code).toMatch(/^[A-Z0-9]{8}$/);
    }
  });
});

describe('enableTwoFactor', () => {
  it('activates and persists when the verification token matches the secret', async () => {
    const { client, store } = createSupabaseMock();
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    const secret = speakeasy.generateSecret({ length: 32 }).base32;
    const token = speakeasy.totp({ secret, encoding: 'base32' });

    const result = await enableTwoFactor(EMAIL, secret, ['CODE1234'], token);

    expect(result).toBe(true);
    expect(store[EMAIL]).toMatchObject({ enabled: true, secret });
  });

  it('rejects and does not persist when the token does not match', async () => {
    const { client, store } = createSupabaseMock();
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    const secret = speakeasy.generateSecret({ length: 32 }).base32;

    const result = await enableTwoFactor(EMAIL, secret, ['CODE1234'], '000000');

    expect(result).toBe(false);
    expect(store[EMAIL]).toBeUndefined();
  });
});

describe('verifyTwoFactorToken', () => {
  it('returns false when 2FA is not enabled for the user', async () => {
    const { client } = createSupabaseMock();
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    expect(await verifyTwoFactorToken('123456', EMAIL)).toBe(false);
  });

  it('accepts a valid TOTP token', async () => {
    const secret = speakeasy.generateSecret({ length: 32 }).base32;
    const { client } = createSupabaseMock({
      [EMAIL]: { email: EMAIL, enabled: true, secret, backup_codes: [], enabled_at: null },
    });
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    const token = speakeasy.totp({ secret, encoding: 'base32' });
    expect(await verifyTwoFactorToken(token, EMAIL)).toBe(true);
  });

  it('rejects an incorrect 6-digit TOTP token', async () => {
    const secret = speakeasy.generateSecret({ length: 32 }).base32;
    const { client } = createSupabaseMock({
      [EMAIL]: { email: EMAIL, enabled: true, secret, backup_codes: [], enabled_at: null },
    });
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    expect(await verifyTwoFactorToken('000000', EMAIL)).toBe(false);
  });

  it('accepts and consumes a valid backup code', async () => {
    const secret = speakeasy.generateSecret({ length: 32 }).base32;
    const { client, store } = createSupabaseMock({
      [EMAIL]: {
        email: EMAIL,
        enabled: true,
        secret,
        backup_codes: ['ABCD1234', 'EFGH5678'],
        enabled_at: null,
      },
    });
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    expect(await verifyTwoFactorToken('ABCD1234', EMAIL)).toBe(true);
    expect(store[EMAIL].backup_codes).toEqual(['EFGH5678']);
  });

  it('rejects an unknown backup code', async () => {
    const secret = speakeasy.generateSecret({ length: 32 }).base32;
    const { client } = createSupabaseMock({
      [EMAIL]: { email: EMAIL, enabled: true, secret, backup_codes: ['ABCD1234'], enabled_at: null },
    });
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    expect(await verifyTwoFactorToken('ZZZZ0000', EMAIL)).toBe(false);
  });
});

describe('isTwoFactorEnabled', () => {
  it('reflects the stored enabled flag', async () => {
    const { client } = createSupabaseMock({
      [EMAIL]: { email: EMAIL, enabled: true, secret: 'x', backup_codes: [], enabled_at: null },
    });
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    expect(await isTwoFactorEnabled(EMAIL)).toBe(true);
  });

  it('returns false when no row exists for the user', async () => {
    const { client } = createSupabaseMock();
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    expect(await isTwoFactorEnabled(EMAIL)).toBe(false);
  });
});

describe('getBackupCodes / regenerateBackupCodes', () => {
  it('getBackupCodes returns an empty array when none are stored', async () => {
    const { client } = createSupabaseMock();
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    expect(await getBackupCodes(EMAIL)).toEqual([]);
  });

  it('regenerateBackupCodes throws when 2FA is not enabled', async () => {
    const { client } = createSupabaseMock();
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    await expect(regenerateBackupCodes(EMAIL)).rejects.toThrow('2FA non activé');
  });

  it('regenerateBackupCodes returns and persists 10 new codes when enabled', async () => {
    const { client, store } = createSupabaseMock({
      [EMAIL]: { email: EMAIL, enabled: true, secret: 'x', backup_codes: ['OLD00000'], enabled_at: null },
    });
    vi.mocked(getSupabaseClient).mockReturnValue(client);

    const codes = await regenerateBackupCodes(EMAIL);

    expect(codes).toHaveLength(10);
    expect(store[EMAIL].backup_codes).toEqual(codes);
    expect(store[EMAIL].backup_codes).not.toContain('OLD00000');
  });
});
