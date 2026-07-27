import { describe, it, expect } from 'vitest';
import { validatePasswordStrength, requireStrongPassword } from '@/lib/auth/password-policy';

describe('validatePasswordStrength', () => {
  it('rejects passwords under the minimum length', () => {
    const result = validatePasswordStrength('Ab1!Ab1!');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('12 caractères'))).toBe(true);
  });

  it('rejects a password missing an uppercase letter', () => {
    const result = validatePasswordStrength('lowercase123!@#');
    expect(result.errors.some((e) => e.includes('majuscule'))).toBe(true);
  });

  it('rejects a password missing a lowercase letter', () => {
    const result = validatePasswordStrength('UPPERCASE123!@#');
    expect(result.errors.some((e) => e.includes('minuscule'))).toBe(true);
  });

  it('rejects a password missing a digit', () => {
    const result = validatePasswordStrength('NoDigitsHere!@#');
    expect(result.errors.some((e) => e.includes('chiffre'))).toBe(true);
  });

  it('rejects a password missing a special character', () => {
    const result = validatePasswordStrength('NoSpecialChar123');
    expect(result.errors.some((e) => e.includes('spécial'))).toBe(true);
  });

  it('accepts a long, complex password', () => {
    const result = validatePasswordStrength('Tr0ub4dor&3xtra!');
    expect(result.isValid).toBe(true);
    expect(result.strength).toBe('strong');
  });

  it('flags common passwords even when otherwise complex', () => {
    const result = validatePasswordStrength('Password123!');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('commun'))).toBe(true);
  });

  it('documents that the common-password check matches on substring, not whole word', () => {
    // "admin" is in COMMON_PASSWORDS and matched via .includes(), so an
    // otherwise strong password containing it anywhere is flagged as common.
    // This is existing behavior, not something this test suite fixes.
    const result = validatePasswordStrength('MySuperAdmin123!');
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('commun'))).toBe(true);
  });

  it('documents that any valid password scores at least "strong"', () => {
    // A valid password requires length>=12 + all 4 character classes, which
    // already totals a score of 5 (the "strong" threshold) — so 'medium' is
    // currently unreachable for isValid=true results. Documented, not fixed.
    const result = validatePasswordStrength('Abcdefgh1234!');
    expect(result.isValid).toBe(true);
    expect(result.strength).toBe('strong');
  });
});

describe('requireStrongPassword', () => {
  it('throws with an aggregated message for an invalid password', () => {
    expect(() => requireStrongPassword('short')).toThrow('Mot de passe invalide');
  });

  it('does not throw for a valid password', () => {
    expect(() => requireStrongPassword('Tr0ub4dor&3xtra!')).not.toThrow();
  });
});
