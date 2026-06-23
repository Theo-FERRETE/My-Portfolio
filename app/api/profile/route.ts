import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/data/data-helpers';

export async function GET() {
  try {
    return NextResponse.json(await getProfile());
  } catch (error) {
    console.error('Erreur GET profile:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
