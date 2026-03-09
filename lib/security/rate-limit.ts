interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  api: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
  public: { windowMs: 15 * 60 * 1000, maxRequests: 200 },
};

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMITS.api
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;
  cleanupExpiredEntries();

  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  entry.count++;

  return {
    allowed: entry.count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * 🔒 Récupère l'IP réelle du client de manière sécurisée
 * Protège contre le spoofing d'IP en validant les proxies de confiance
 */
export function getClientIp(request: Request): string {
  // Vérifier si on est derrière un proxy de confiance (Vercel, Netlify, OVH, etc.)
  const isTrustedProxy = process.env.TRUSTED_PROXY === 'true';
  
  if (isTrustedProxy) {
    // Utiliser x-forwarded-for uniquement si on fait confiance au proxy
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      // Prendre la première IP (client réel)
      return forwarded.split(',')[0].trim();
    }
    
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
      return realIp.trim();
    }
  }
  
  // En développement ou sans proxy de confiance, on ne peut pas récupérer l'IP fiable
  // Utiliser un identifiant par défaut pour éviter le bypass
  return 'local-client';
}
