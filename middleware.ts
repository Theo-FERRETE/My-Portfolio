import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/security/rate-limit';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isLoginPage = req.nextUrl.pathname === '/admin/login';
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin') && !isLoginPage;
    const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin');
    const isAuthApi = req.nextUrl.pathname.startsWith('/api/auth');
    
    // 🔒 SÉCURITÉ : Rate limiting sur les routes sensibles
    const clientIp = getClientIp(req);
    
    // Rate limiting strict sur l'authentification
    if (isAuthApi) {
      const rateLimitKey = `auth:${clientIp}`;
      const { allowed, remaining, resetAt } = checkRateLimit(rateLimitKey, RATE_LIMITS.login);
      
      if (!allowed) {
        return NextResponse.json(
          { 
            error: 'Trop de tentatives. Réessayez plus tard.',
            resetAt: new Date(resetAt).toISOString()
          },
          { status: 429 }
        );
      }
      
      // Ajouter les headers de rate limit
      const response = NextResponse.next();
      response.headers.set('X-RateLimit-Limit', String(RATE_LIMITS.login.maxRequests));
      response.headers.set('X-RateLimit-Remaining', String(remaining));
      response.headers.set('X-RateLimit-Reset', String(resetAt));
    }
    
    // Rate limiting modéré sur les APIs admin
    if (isAdminApi && isAuth) {
      const rateLimitKey = `admin-api:${clientIp}`;
      const { allowed, remaining } = checkRateLimit(rateLimitKey, RATE_LIMITS.api);
      
      if (!allowed) {
        return NextResponse.json(
          { error: 'Limite de requêtes atteinte' },
          { status: 429 }
        );
      }
    }

    // Si l'utilisateur est sur la page de login et est déjà authentifié, rediriger vers le dashboard
    if (isLoginPage && isAuth) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Si l'utilisateur n'est pas authentifié et essaie d'accéder à une page admin (sauf login) ou API admin
    if (!isAuth && (isAdminPage || isAdminApi)) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Vérifier le rôle admin pour les routes protégées
    if (isAuth && (isAdminPage || isAdminApi)) {
      if (token.role !== 'admin') {
        if (isAdminApi) {
          return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Cette callback détermine si le middleware doit s'exécuter
        // On retourne true pour toujours exécuter le middleware ci-dessus
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/auth/:path*', // 🔒 Ajouter rate limiting sur auth
  ],
};
