import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isLoginPage = req.nextUrl.pathname === '/admin/login';
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin') && !isLoginPage;
    const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin');

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
  ],
};
