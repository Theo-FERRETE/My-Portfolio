import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { generateTwoFactorSecret } from '@/lib/auth';

/**
 * 🔐 API : Générer un nouveau secret 2FA
 * Génère un QR code et des codes de secours pour configurer Google Authenticator
 */
export async function POST() {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const userEmail = authResult.user.email;
    const twoFactorData = await generateTwoFactorSecret(userEmail);

    return NextResponse.json({
      qrCode: twoFactorData.qrCode,
      secret: twoFactorData.secret,
      backupCodes: twoFactorData.backupCodes,
    });
  } catch (error) {
    console.error('Erreur génération 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du secret 2FA' },
      { status: 500 }
    );
  }
}
