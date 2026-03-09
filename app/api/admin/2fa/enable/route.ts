import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { enableTwoFactor } from '@/lib/auth';
import { auditActions } from '@/lib/security';
import { getClientIp } from '@/lib/security';
import { z } from 'zod';

const enableSchema = z.object({
  secret: z.string().min(1, 'Secret requis'),
  backupCodes: z.array(z.string()).min(1, 'Codes de secours requis'),
  token: z.string().regex(/^\d{6}$/, 'Code à 6 chiffres requis'),
});

/**
 * 🔐 API : Activer le 2FA
 * Vérifie le code et active l'authentification à deux facteurs
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const data = enableSchema.parse(body);

    const userEmail = authResult.user.email;
    
    // Activer le 2FA après vérification du code
    const success = await enableTwoFactor(
      userEmail,
      data.secret,
      data.backupCodes,
      data.token
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Code invalide. Vérifiez votre application Google Authenticator.' },
        { status: 400 }
      );
    }

    // Logger l'activation du 2FA
    const ip = getClientIp(request);
    await auditActions.login(userEmail, ip, true);

    return NextResponse.json({
      success: true,
      message: '2FA activé avec succès',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', issues: error.issues },
        { status: 400 }
      );
    }
    console.error('Erreur activation 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'activation du 2FA' },
      { status: 500 }
    );
  }
}
