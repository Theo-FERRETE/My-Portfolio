export const AUTH_CONFIG = {
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() || '',
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '$2b$10$NPcT4ANVo/0hXH4Q32pdVut1KEr3AR2VuOcU1x8kLacKDrYhqx8wu',
} as const;
