import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/data';

export async function GET() {
  try {
    return NextResponse.json(await getSiteSettings());
  } catch (error) {
    console.error('Erreur GET settings:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
