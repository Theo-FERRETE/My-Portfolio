import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateSecret } from '@/lib/auth/password';

describe('hashPassword / verifyPassword', () => {
  it('round-trips a password through hash and verify', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    expect(await verifyPassword('correct-horse-battery-staple', hash)).toBe(true);
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    expect(await verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('rejects a malformed hash instead of throwing', async () => {
    await expect(verifyPassword('anything', 'not-a-real-bcrypt-hash')).resolves.toBe(false);
  });
});

describe('generateSecret', () => {
  it('returns a base64 string of the expected byte length', () => {
    const secret = generateSecret(32);
    expect(Buffer.from(secret, 'base64')).toHaveLength(32);
  });

  it('respects a custom length', () => {
    const secret = generateSecret(16);
    expect(Buffer.from(secret, 'base64')).toHaveLength(16);
  });
});
