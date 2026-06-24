import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data';
import { requireAdmin } from '@/lib/auth';
import { settingsSchema } from '@/lib/data';
import { auditActions } from '@/lib/security';
import { getClientIp } from '@/lib/security';
import { z } from 'zod';

export async function GET() {
  try {
    return NextResponse.json(await getSiteSettings());
  } catch (error) {
    console.error('Erreur GET settings:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const { defaultTheme } = settingsSchema.parse(body);

    const settings = await updateSiteSettings(defaultTheme);

    const ip = getClientIp(request);
    await auditActions.updateSettings(authResult.user.email, ip);

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', issues: error.issues }, { status: 400 });
    }
    console.error('Erreur PUT settings:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
