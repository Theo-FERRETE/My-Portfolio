import { NextRequest, NextResponse } from 'next/server';
import { getSkills, createSkill } from '@/lib/data-helpers';
import { requireAdmin } from '@/lib/auth-helpers';
import { skillSchema } from '@/lib/validation';
import { auditActions } from '@/lib/audit-log';
import { getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';

export async function GET() {
  try {
    return NextResponse.json(getSkills());
  } catch (error) {
    console.error('Erreur GET skills:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const data = skillSchema.parse(body);

    const skill = createSkill({
      name: data.name,
      category: data.category,
      icon: data.icon,
      description: data.description,
      order: data.order || 0,
    });

    const ip = getClientIp(request);
    await auditActions.createSkill(authResult.user.email, String(skill.id), ip);

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', issues: error.issues }, { status: 400 });
    }
    console.error('Erreur POST skill:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
