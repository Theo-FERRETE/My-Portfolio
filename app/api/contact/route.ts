import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createContactMessage, contactSchema } from '@/lib/data';
import { checkRateLimit, getClientIp } from '@/lib/security';

const CONTACT_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
};

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rate = checkRateLimit(`contact:${clientIp}`, CONTACT_RATE_LIMIT);

    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: 'Trop de tentatives. Réessayez plus tard.',
          retryAfter: Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000)),
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const data = contactSchema.parse(body);

    const message = await createContactMessage({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    return NextResponse.json(
      {
        success: true,
        id: message.id,
        message: 'Message envoye avec succes. Merci !',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Données invalides',
          issues: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Format JSON invalide' }, { status: 400 });
    }

    console.error('Erreur POST contact:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
