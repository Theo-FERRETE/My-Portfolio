import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data';

export async function GET() {
  try {
    return NextResponse.json(await getProjects());
  } catch (error) {
    console.error('Erreur GET projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
