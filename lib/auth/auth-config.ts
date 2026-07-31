import { getSupabaseClient } from '@/lib/supabase';

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

export async function saveAdminPasswordHash(hash: string): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('admin_auth')
    .upsert({ id: true, admin_password_hash: hash, updated_at: new Date().toISOString() });
  if (error) throw error;
}

async function readStoredAdminAuth(): Promise<{ adminPasswordHash?: string }> {
  const { data, error } = await getSupabaseClient()
    .from('admin_auth')
    .select('admin_password_hash')
    .eq('id', true)
    .maybeSingle();

  if (error || !data?.admin_password_hash) {
    return {};
  }

  return { adminPasswordHash: data.admin_password_hash };
}

export async function getAuthConfig() {
  const stored = await readStoredAdminAuth();

  const envPasswordHash = process.env.ADMIN_PASSWORD_HASH
    ? normalizeEnvValue(process.env.ADMIN_PASSWORD_HASH)
    : undefined;

  const adminPasswordHash = stored.adminPasswordHash || envPasswordHash;

  if (!adminPasswordHash) {
    throw new Error(
      'Configuration admin invalide: aucun ADMIN_PASSWORD_HASH configuré (ni en variable d\'environnement, ni en base). ' +
      'Générez-en un avec `npm run hash-password`.'
    );
  }

  return {
    adminEmail: process.env.ADMIN_EMAIL
      ? normalizeEnvValue(process.env.ADMIN_EMAIL).toLowerCase()
      : DEFAULT_ADMIN_EMAIL,
    adminPasswordHash,
    // Sécurisé par défaut : le 2FA n'est désactivé que si explicitement demandé.
    disableTwoFactor: parseEnvBoolean(process.env.DISABLE_2FA, false),
  } as const;
}
