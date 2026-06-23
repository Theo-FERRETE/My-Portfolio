import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getContactMessages } from '@/lib/data';

export async function GET() {
  const authResult = await requireAdmin();
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const messages = (await getContactMessages()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Erreur GET contact-messages:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
