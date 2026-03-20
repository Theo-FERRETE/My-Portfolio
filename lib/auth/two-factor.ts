/**
 * 🔐 Authentification à Deux Facteurs (2FA)
 * Gestion complète du 2FA avec Google Authenticator
 */

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { promises as fs } from 'fs';
import path from 'path';
import { AUTH_CONFIG } from './auth-config';

export interface TwoFactorSecret {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorData {
  enabled: boolean;
  secret?: string;
  backupCodes?: string[];
  enabledAt?: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', '2fa.json');
const LEGACY_ADMIN_EMAIL = 'admin@portfolio.com';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Génère un nouveau secret 2FA et un QR code pour Google Authenticator
 */
export async function generateTwoFactorSecret(userEmail: string): Promise<TwoFactorSecret> {
  // Générer le secret
  const secret = speakeasy.generateSecret({
    name: `Portfolio (${userEmail})`,
    issuer: 'Portfolio Admin',
    length: 32,
  });

  // Générer le QR code
  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  // Générer des codes de secours (backup codes)
  const backupCodes = generateBackupCodes(10);

  return {
    secret: secret.base32,
    qrCode,
    backupCodes,
  };
}

/**
 * Vérifie un code 2FA (TOTP ou backup code)
 */
export async function verifyTwoFactorToken(token: string, userEmail: string): Promise<boolean> {
  const twoFactorData = await getTwoFactorData(userEmail);

  if (!twoFactorData.enabled || !twoFactorData.secret) {
    return false;
  }

  // Vérifier si c'est un code TOTP (6 chiffres)
  if (/^\d{6}$/.test(token)) {
    const verified = speakeasy.totp.verify({
      secret: twoFactorData.secret,
      encoding: 'base32',
      token,
      window: 2, // Accepte ±2 périodes (60 secondes de marge)
    });

    return verified;
  }

  // Vérifier si c'est un code de secours
  if (twoFactorData.backupCodes?.includes(token)) {
    // Consommer le code de secours (utilisation unique)
    await consumeBackupCode(userEmail, token);
    return true;
  }

  return false;
}

/**
 * Active le 2FA pour un utilisateur après vérification du code initial
 */
export async function enableTwoFactor(
  userEmail: string,
  secret: string,
  backupCodes: string[],
  verificationToken: string
): Promise<boolean> {
  // Vérifier que le code fonctionne avant d'activer
  const verified = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token: verificationToken,
    window: 2,
  });

  if (!verified) {
    return false;
  }

  // Sauvegarder les données 2FA
  const twoFactorData: TwoFactorData = {
    enabled: true,
    secret,
    backupCodes,
    enabledAt: new Date().toISOString(),
  };

  await saveTwoFactorData(userEmail, twoFactorData);
  return true;
}

/**
 * Désactive le 2FA pour un utilisateur
 */
export async function disableTwoFactor(userEmail: string): Promise<void> {
  const twoFactorData: TwoFactorData = {
    enabled: false,
  };

  await saveTwoFactorData(userEmail, twoFactorData);
}

/**
 * Vérifie si le 2FA est activé pour un utilisateur
 */
export async function isTwoFactorEnabled(userEmail: string): Promise<boolean> {
  const twoFactorData = await getTwoFactorData(userEmail);
  return twoFactorData.enabled;
}

/**
 * Récupère les données 2FA d'un utilisateur
 */
async function getTwoFactorData(userEmail: string): Promise<TwoFactorData> {
  try {
    await fs.access(DATA_FILE);
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const allData = JSON.parse(content) as Record<string, TwoFactorData>;
    const normalizedEmail = normalizeEmail(userEmail);

    if (allData[normalizedEmail]) {
      return allData[normalizedEmail];
    }

    // Migrate old hardcoded admin email entry to configured admin email once.
    const configuredAdminEmail = AUTH_CONFIG.adminEmail;
    if (
      configuredAdminEmail &&
      normalizedEmail === configuredAdminEmail &&
      allData[LEGACY_ADMIN_EMAIL]
    ) {
      allData[normalizedEmail] = allData[LEGACY_ADMIN_EMAIL];
      delete allData[LEGACY_ADMIN_EMAIL];
      await fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2));
      return allData[normalizedEmail];
    }

    return { enabled: false };
  } catch {
    return { enabled: false };
  }
}

/**
 * Sauvegarde les données 2FA d'un utilisateur
 */
async function saveTwoFactorData(userEmail: string, data: TwoFactorData): Promise<void> {
  let allData: Record<string, TwoFactorData> = {};
  const normalizedEmail = normalizeEmail(userEmail);

  try {
    await fs.access(DATA_FILE);
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    allData = JSON.parse(content);
  } catch {
    // Créer le fichier s'il n'existe pas
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  }

  allData[normalizedEmail] = data;
  await fs.writeFile(DATA_FILE, JSON.stringify(allData, null, 2));
}

/**
 * Consomme un code de secours (utilisation unique)
 */
async function consumeBackupCode(userEmail: string, code: string): Promise<void> {
  const twoFactorData = await getTwoFactorData(userEmail);

  if (twoFactorData.backupCodes) {
    twoFactorData.backupCodes = twoFactorData.backupCodes.filter(c => c !== code);
    await saveTwoFactorData(userEmail, twoFactorData);
  }
}

/**
 * Génère des codes de secours aléatoires
 */
function generateBackupCodes(count: number): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Générer un code de 8 caractères alphanumériques
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }

  return codes;
}

/**
 * Récupère les codes de secours restants
 */
export async function getBackupCodes(userEmail: string): Promise<string[]> {
  const twoFactorData = await getTwoFactorData(userEmail);
  return twoFactorData.backupCodes || [];
}

/**
 * Régénère les codes de secours
 */
export async function regenerateBackupCodes(userEmail: string): Promise<string[]> {
  const twoFactorData = await getTwoFactorData(userEmail);
  
  if (!twoFactorData.enabled) {
    throw new Error('2FA non activé');
  }

  const newCodes = generateBackupCodes(10);
  twoFactorData.backupCodes = newCodes;
  
  await saveTwoFactorData(userEmail, twoFactorData);
  return newCodes;
}
