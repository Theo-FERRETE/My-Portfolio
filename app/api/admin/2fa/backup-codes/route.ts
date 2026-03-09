import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { regenerateBackupCodes } from '@/lib/auth';

/**
 * 🔐 API : Régénérer les codes de secours
 */
export async function POST() {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const userEmail = authResult.user.email;
    const newCodes = await regenerateBackupCodes(userEmail);

    return NextResponse.json({
      success: true,
      backupCodes: newCodes,
      message: 'Codes de secours régénérés. Sauvegardez-les en lieu sûr.',
    });
  } catch (error) {
    console.error('Erreur régénération codes:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
