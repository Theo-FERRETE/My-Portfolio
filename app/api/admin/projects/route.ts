import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/data-helpers';
import { requireAdmin } from '@/lib/auth-helpers';
import { projectSchema } from '@/lib/validation';
import { auditActions } from '@/lib/audit-log';
import { getClientIp } from '@/lib/rate-limit';
import { z } from 'zod';

export async function GET() {
  try {
    return NextResponse.json(getProjects());
  } catch (error) {
    console.error('Erreur GET projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    const project = createProject({
      title: data.title,
      description: data.description,
      image: data.image || '',
      tags: data.tags,
      link: data.link || '',
      featured: data.featured || false,
    });

    const ip = getClientIp(request);
    await auditActions.createProject(authResult.user.email, String(project.id), ip);

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides', issues: error.issues }, { status: 400 });
    }
    console.error('Erreur POST project:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
