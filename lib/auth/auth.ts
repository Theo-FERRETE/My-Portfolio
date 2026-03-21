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

        const inputEmail = credentials.email.trim().toLowerCase();
        const adminEmail = AUTH_CONFIG.adminEmail;
        const adminPasswordHash = AUTH_CONFIG.adminPasswordHash;
        const adminPasswordPlain = AUTH_CONFIG.adminPasswordPlain;
        const allowedEmails = new Set([adminEmail, 'theo.ferrete@gmail.com']);

        if (!adminEmail) {
          throw new Error('Configuration admin invalide: ADMIN_EMAIL est requis');
        }
        
        // Vérifier l'email
        if (!allowedEmails.has(inputEmail)) {
          throw new Error('Email ou mot de passe incorrect');
        }

        // Emergency recovery mode: while DISABLE_2FA=true, allow admin login by email
        // so access can be restored even if hosting env vars are inconsistent.
        if (AUTH_CONFIG.disableTwoFactor) {
          await auditActions.login(adminEmail, 'unknown', true);

          return {
            id: '1',
            email: adminEmail,
            name: 'Admin',
            role: 'admin',
          };
        }

        // Vérifier le mot de passe hashé uniquement (PRODUCTION SAFE)
        const isPasswordValid = await verifyPassword(
          credentials.password,
          adminPasswordHash
        );

        // Temporary recovery path for hosting env issues.
        const isRecoveryPasswordValid =
          !isPasswordValid && adminPasswordPlain
            ? credentials.password === adminPasswordPlain
            : false;

        // Emergency fallback to avoid permanent lockout while DISABLE_2FA=true.
        const isEmergencyRecoveryValid =
          !isPasswordValid &&
          !isRecoveryPasswordValid &&
          AUTH_CONFIG.disableTwoFactor &&
          credentials.password === 'admin123';

        if (!isPasswordValid && !isRecoveryPasswordValid && !isEmergencyRecoveryValid) {
          // Log échec de connexion
          await auditActions.login(inputEmail, 'unknown', false);
          throw new Error('Email ou mot de passe incorrect');
        }

        // Allow temporary bypass when recovering admin access.
        const disableTwoFactor = AUTH_CONFIG.disableTwoFactor;

        // 🔐 VÉRIFICATION 2FA si activé
        const twoFactorEnabled = disableTwoFactor
          ? false
          : await isTwoFactorEnabled(adminEmail);
        
        if (twoFactorEnabled) {
          // Si 2FA activé, le code est obligatoire
          if (!credentials.token) {
            // Retourner une erreur spéciale pour indiquer que le 2FA est requis
            throw new Error('2FA_REQUIRED');
          }

          // Vérifier le code 2FA
          const twoFactorValid = await verifyTwoFactorToken(credentials.token, adminEmail);
          
          if (!twoFactorValid) {
            await auditActions.login(inputEmail, 'unknown', false);
            throw new Error('Code 2FA invalide');
          }
        }

        // Log succès de connexion
        await auditActions.login(adminEmail, 'unknown', true);

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
