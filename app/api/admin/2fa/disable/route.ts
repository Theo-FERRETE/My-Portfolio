import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { disableTwoFactor } from '@/lib/auth';
import { auditActions } from '@/lib/security';
import { getClientIp } from '@/lib/security';

/**
 * 🔐 API : Désactiver le 2FA
 */
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const userEmail = authResult.user.email;
    
    await disableTwoFactor(userEmail);

    // Logger la désactivation
    const ip = getClientIp(request);
    await auditActions.login(userEmail, ip, true);

    return NextResponse.json({
      success: true,
      message: '2FA désactivé avec succès',
    });
  } catch (error) {
    console.error('Erreur désactivation 2FA:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la désactivation du 2FA' },
      { status: 500 }
    );
  }
}
