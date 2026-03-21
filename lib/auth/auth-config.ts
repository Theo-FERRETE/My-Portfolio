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

const DEFAULT_ADMIN_EMAIL = 'theo.ferrete@gmail.com';
const DEFAULT_ADMIN_PASSWORD_HASH = '$2b$10$m0v8SvLd2BJFWkm24qhAxe8SAgnJOqHAGqSq8xJoviBU0c6hoiHgG'; // admin123

export const AUTH_CONFIG = {
  adminEmail: process.env.ADMIN_EMAIL
    ? normalizeEnvValue(process.env.ADMIN_EMAIL).toLowerCase()
    : DEFAULT_ADMIN_EMAIL,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH
    ? normalizeEnvValue(process.env.ADMIN_PASSWORD_HASH)
    : DEFAULT_ADMIN_PASSWORD_HASH,
  adminPasswordPlain: process.env.ADMIN_PASSWORD
    ? normalizeEnvValue(process.env.ADMIN_PASSWORD)
    : '',
  disableTwoFactor: process.env.DISABLE_2FA === 'true',
} as const;
