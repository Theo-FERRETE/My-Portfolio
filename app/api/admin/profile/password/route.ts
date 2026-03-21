import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin, verifyPassword, hashPassword, requireStrongPassword, getAuthConfig, saveAdminPasswordHash } from '@/lib/auth';
import { addAuditLog, getClientIp } from '@/lib/security';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z.string().min(1, 'Nouveau mot de passe requis'),
  confirmPassword: z.string().min(1, 'Confirmation requise'),
});

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const data = passwordSchema.parse(body);

    if (data.newPassword !== data.confirmPassword) {
      return NextResponse.json(
        { error: 'La confirmation du mot de passe ne correspond pas' },
        { status: 400 }
      );
    }

    requireStrongPassword(data.newPassword);

    const authConfig = getAuthConfig();

    const isCurrentPasswordValid = await verifyPassword(data.currentPassword, authConfig.adminPasswordHash);
    const isCurrentPlainPasswordValid =
      !isCurrentPasswordValid && authConfig.adminPasswordPlain
        ? data.currentPassword === authConfig.adminPasswordPlain
        : false;

    if (!isCurrentPasswordValid && !isCurrentPlainPasswordValid) {
      return NextResponse.json(
        { error: 'Mot de passe actuel incorrect' },
        { status: 401 }
      );
    }

    const isSameAsCurrent = await verifyPassword(data.newPassword, authConfig.adminPasswordHash);
    if (isSameAsCurrent) {
      return NextResponse.json(
        { error: 'Le nouveau mot de passe doit etre different de l\'ancien' },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(data.newPassword);
    saveAdminPasswordHash(newHash);

    const ip = getClientIp(request);
    await addAuditLog({
      userId: authResult.user.email,
      action: 'UPDATE_PASSWORD',
      resource: 'auth',
      ip,
      success: true,
      details: {
        updatedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Donnees invalides', issues: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.startsWith('Mot de passe invalide')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('Erreur update password:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
