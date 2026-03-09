// Configuration d'authentification
// Ce fichier contient le hash bcrypt car .env interprète les $ comme des variables

export const AUTH_CONFIG = {
  adminEmail: 'admin@portfolio.com',
  // Hash bcrypt pour "admin123"
  adminPasswordHash: '$2b$10$NPcT4ANVo/0hXH4Q32pdVut1KEr3AR2VuOcU1x8kLacKDrYhqx8wu',
} as const;
