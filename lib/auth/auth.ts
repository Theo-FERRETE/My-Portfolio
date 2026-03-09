import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from './password';
import { auditActions } from '@/lib/security';
import { isTwoFactorEnabled, verifyTwoFactorToken } from './two-factor';
import { AUTH_CONFIG } from './auth-config';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        token: { label: '2FA Token', type: 'text' }, // 🔐 Code 2FA optionnel
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const adminEmail = AUTH_CONFIG.adminEmail;
        const adminPasswordHash = AUTH_CONFIG.adminPasswordHash;
        
        // Vérifier l'email
        if (credentials.email !== adminEmail) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Vérifier le mot de passe hashé uniquement (PRODUCTION SAFE)
        console.log('🔍 DEBUG - Email:', credentials.email);
        console.log('🔍 DEBUG - Password:', credentials.password);
        console.log('🔍 DEBUG - Hash:', adminPasswordHash);
        console.log('🔍 DEBUG - Hash length:', adminPasswordHash.length);
        
        const isPasswordValid = await verifyPassword(
          credentials.password,
          adminPasswordHash
        );
        
        console.log('🔍 DEBUG - Password valid?', isPasswordValid);

        if (!isPasswordValid) {
          // Log échec de connexion
          await auditActions.login(credentials.email, 'unknown', false);
          throw new Error('Email ou mot de passe incorrect');
        }

        // 🔐 VÉRIFICATION 2FA si activé
        const twoFactorEnabled = await isTwoFactorEnabled(credentials.email);
        
        if (twoFactorEnabled) {
          // Si 2FA activé, le code est obligatoire
          if (!credentials.token) {
            // Retourner une erreur spéciale pour indiquer que le 2FA est requis
            throw new Error('2FA_REQUIRED');
          }

          // Vérifier le code 2FA
          const twoFactorValid = await verifyTwoFactorToken(credentials.token, credentials.email);
          
          if (!twoFactorValid) {
            await auditActions.login(credentials.email, 'unknown', false);
            throw new Error('Code 2FA invalide');
          }
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
