import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '@/lib/password';
import { auditActions } from '@/lib/audit-log';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
        
        // Vérifier l'email
        if (credentials.email !== adminEmail) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Vérifier le mot de passe (hash ou clair)
        let isPasswordValid = false;
        
        // Priorité au hash (recommandé)
        if (process.env.ADMIN_PASSWORD_HASH) {
          isPasswordValid = await verifyPassword(
            credentials.password,
            process.env.ADMIN_PASSWORD_HASH
          );
        } 
        // Fallback sur mot de passe en clair (dev uniquement)
        else if (process.env.ADMIN_PASSWORD) {
          isPasswordValid = credentials.password === process.env.ADMIN_PASSWORD;
          console.warn('⚠️  Utilisation de ADMIN_PASSWORD en clair - utilisez ADMIN_PASSWORD_HASH en production!');
        } else {
          throw new Error('Configuration d\'authentification manquante');
        }

        if (!isPasswordValid) {
          // Log échec de connexion
          await auditActions.login(credentials.email, 'unknown', false);
          throw new Error('Email ou mot de passe incorrect');
        }

        // Log succès de connexion
        await auditActions.login(credentials.email, 'unknown', true);

        return {
          id: '1',
          email: adminEmail,
          name: 'Admin',
          role: 'admin',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      // Log déconnexion
      if (token?.email) {
        await auditActions.logout(token.email as string, 'unknown');
      }
      console.log('Session détruite pour:', token?.email);
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 heures
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 heures
  },
  secret: process.env.NEXTAUTH_SECRET,
};
