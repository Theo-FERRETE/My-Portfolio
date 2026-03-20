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

export const AUTH_CONFIG = {
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH
    ? normalizeEnvValue(process.env.ADMIN_PASSWORD_HASH)
    : '$2b$10$NPcT4ANVo/0hXH4Q32pdVut1KEr3AR2VuOcU1x8kLacKDrYhqx8wu',
} as const;
