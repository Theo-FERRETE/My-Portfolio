import { NextRequest, NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/data';
import { requireAdmin } from '@/lib/auth';
import { auditActions } from '@/lib/security';
import { getClientIp } from '@/lib/security';
import { projectSchema } from '@/lib/data';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const project = getProjectById(parseInt(id));
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
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = projectSchema.partial().parse(body);

    const project = updateProject(parseInt(id), data);
    if (!project) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    const ip = getClientIp(request);
    await auditActions.updateProject(authResult.user.email, id, ip);

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
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await context.params;
    const deleted = deleteProject(parseInt(id));
    if (!deleted) {
      return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
    }

    const ip = getClientIp(request);
    await auditActions.deleteProject(authResult.user.email, id, ip);

    return NextResponse.json({ message: 'Supprimé' });
  } catch (error) {
    console.error('Erreur DELETE project:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}