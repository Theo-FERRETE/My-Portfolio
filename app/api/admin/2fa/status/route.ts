import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { isTwoFactorEnabled, getBackupCodes } from '@/lib/auth';
import { AUTH_CONFIG } from '@/lib/auth';

/**
 * 🔐 API : Statut du 2FA
 * Retourne si le 2FA est activé et le nombre de codes de secours restants
 */
export async function GET() {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const userEmail = authResult.user.email;
    const policyDisabled = AUTH_CONFIG.disableTwoFactor;
    const enabled = policyDisabled ? false : await isTwoFactorEnabled(userEmail);
    const backupCodes = enabled ? await getBackupCodes(userEmail) : [];

    return NextResponse.json({
      enabled,
      policyDisabled,
      backupCodesCount: backupCodes.length,
    });
  } catch (error) {
    console.error('Erreur statut 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut 2FA' },
      { status: 500 }
    );
  }
}
