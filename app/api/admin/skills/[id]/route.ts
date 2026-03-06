import { NextRequest, NextResponse } from 'next/server';
import { getSkillById, updateSkill, deleteSkill } from '@/lib/data-helpers';
import { requireAdmin } from '@/lib/auth-helpers';
import { skillSchema } from '@/lib/validation';
import { auditActions } from '@/lib/audit-log';
import { getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const skill = getSkillById(parseInt(params.id));
    if (!skill) {
      return NextResponse.json({ error: 'Compétence introuvable' }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Erreur GET skill:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const data = skillSchema.partial().parse(body);

    const skill = updateSkill(parseInt(params.id), data);
    if (!skill) {
      return NextResponse.json({ error: 'Compétence introuvable' }, { status: 404 });
    }

    const ip = getClientIp(request);
    await auditActions.updateSkill(authResult.user.email, params.id, ip);

    return NextResponse.json(skill);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', issues: error.issues }, { status: 400 });
    }
    console.error('Erreur PUT skill:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const deleted = deleteSkill(parseInt(params.id));
    if (!deleted) {
      return NextResponse.json({ error: 'Compétence introuvable' }, { status: 404 });
    }

    const ip = getClientIp(request);
    await auditActions.deleteSkill(authResult.user.email, params.id, ip);

    return NextResponse.json({ message: 'Supprimé' });
  } catch (error) {
    console.error('Erreur DELETE skill:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
