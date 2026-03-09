import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/data';
import { requireAdmin } from '@/lib/auth';
import { auditActions } from '@/lib/security';
import { getClientIp } from '@/lib/security';
import { projectSchema } from '@/lib/data';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = getProjectById(parseInt(params.id));
    if (!project) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur GET project:', error);
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
    const data = projectSchema.partial().parse(body);

    const project = updateProject(parseInt(params.id), data);
    if (!project) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    const ip = getClientIp(request);
    await auditActions.updateProject(authResult.user.email, params.id, ip);

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', issues: error.issues }, { status: 400 });
    }
    console.error('Erreur PUT project:', error);
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
    const deleted = deleteProject(parseInt(params.id));
    if (!deleted) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    const ip = getClientIp(request);
    await auditActions.deleteProject(authResult.user.email, params.id, ip);

    return NextResponse.json({ message: 'Supprimé' });
  } catch (error) {
    console.error('Erreur DELETE project:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
