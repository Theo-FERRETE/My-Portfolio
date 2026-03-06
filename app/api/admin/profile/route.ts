import { NextRequest, NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/data-helpers';
import { requireAdmin } from '@/lib/auth-helpers';
import { profileSchema } from '@/lib/validation';
import { auditActions } from '@/lib/audit-log';
import { getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';

export async function GET() {
  try {
    return NextResponse.json(getProfile());
  } catch (error) {
    console.error('Erreur GET profile:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const data = profileSchema.partial().parse(body);
    
    const profile = updateProfile(data);

    const ip = getClientIp(request);
    await auditActions.updateProfile(authResult.user.email, ip);

    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', issues: error.issues }, { status: 400 });
    }
    console.error('Erreur PUT profile:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
