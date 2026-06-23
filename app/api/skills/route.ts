import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/data/data-helpers';

export async function GET() {
  try {
    return NextResponse.json(await getSkills());
  } catch (error) {
    console.error('Erreur GET skills:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
