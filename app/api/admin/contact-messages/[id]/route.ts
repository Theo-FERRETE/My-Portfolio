import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { getContactMessageById, updateContactMessage } from '@/lib/data';

const updateMessageSchema = z.object({
  status: z.enum(['new', 'read', 'replied']).optional(),
  replyMessage: z.string().trim().max(4000, 'Reponse trop longue').optional(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const params = await context.params;
    const id = Number(params.id);

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 });
    }

    const existing = await getContactMessageById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Message introuvable' }, { status: 404 });
    }

    const body = await request.json();
    const data = updateMessageSchema.parse(body);

    const updated = await updateContactMessage(id, {
      status: data.status ?? existing.status,
      replyMessage: data.replyMessage ?? existing.replyMessage,
      repliedAt:
        data.status === 'replied'
          ? new Date().toISOString()
          : existing.repliedAt,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Impossible de mettre a jour le message' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Donnees invalides', issues: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Format JSON invalide' }, { status: 400 });
    }

    console.error('Erreur PATCH contact-message:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
