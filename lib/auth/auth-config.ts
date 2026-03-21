import fs from 'fs';
import path from 'path';

function normalizeEnvValue(value: string): string {
  const trimmed = value.trim();

  // Accept optional wrapping quotes from hosting panels.
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  // Support both `$2b$...` and `\$2b\$...` representations.
  return unquoted.replace(/\\\$/g, '$');
}

function parseEnvBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }

  const normalized = normalizeEnvValue(value).toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalized);
}

const DEFAULT_ADMIN_EMAIL = 'theo.ferrete@gmail.com';
const DEFAULT_ADMIN_PASSWORD_HASH = '$2b$10$m0v8SvLd2BJFWkm24qhAxe8SAgnJOqHAGqSq8xJoviBU0c6hoiHgG'; // admin123
const ADMIN_AUTH_FILE = path.join(process.cwd(), 'data', 'admin-auth.json');

interface StoredAdminAuth {
  adminPasswordHash?: string;
  updatedAt?: string;
}

function readStoredAdminAuth(): StoredAdminAuth {
  try {
    if (!fs.existsSync(ADMIN_AUTH_FILE)) {
      return {};
    }

    const raw = fs.readFileSync(ADMIN_AUTH_FILE, 'utf8');
    const parsed = JSON.parse(raw) as StoredAdminAuth;

    if (!parsed.adminPasswordHash || typeof parsed.adminPasswordHash !== 'string') {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

export function saveAdminPasswordHash(hash: string): void {
  const payload: StoredAdminAuth = {
    adminPasswordHash: hash,
    updatedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(ADMIN_AUTH_FILE), { recursive: true });
  fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(payload, null, 2));
}

export function getAuthConfig() {
  const stored = readStoredAdminAuth();

  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH
    ? normalizeEnvValue(process.env.ADMIN_PASSWORD_HASH)
    : DEFAULT_ADMIN_PASSWORD_HASH;

  return {
    adminEmail: process.env.ADMIN_EMAIL
      ? normalizeEnvValue(process.env.ADMIN_EMAIL).toLowerCase()
      : DEFAULT_ADMIN_EMAIL,
    adminPasswordHash: stored.adminPasswordHash || envPasswordHash,
    adminPasswordPlain: process.env.ADMIN_PASSWORD
      ? normalizeEnvValue(process.env.ADMIN_PASSWORD)
      : '',
    // Keep 2FA disabled by default during current recovery phase.
    disableTwoFactor: parseEnvBoolean(process.env.DISABLE_2FA, true),
  } as const;
}

export const AUTH_CONFIG = {
  ...getAuthConfig(),
} as const;
