import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/data/data-helpers';

export async function GET() {
  try {
    return NextResponse.json(getProjects());
  } catch (error) {
    console.error('Erreur GET projects:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
