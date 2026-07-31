import { getSupabaseClient } from '@/lib/supabase';

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  updatedAt: string;
}

interface ProfileRow {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  updated_at: string;
}

function mapProfileRow(row: ProfileRow): Profile {
  return {
    name: row.name,
    title: row.title,
    bio: row.bio,
    email: row.email,
    phone: row.phone,
    location: row.location,
    github: row.github,
    linkedin: row.linkedin,
    twitter: row.twitter,
    updatedAt: row.updated_at,
  };
}

export async function getProfile(): Promise<Profile> {
  const { data, error } = await getSupabaseClient()
    .from('profile')
    .select('*')
    .eq('id', true)
    .single();
  if (error) throw error;
  return mapProfileRow(data);
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const { updatedAt: _updatedAt, ...rest } = updates;
  const { data, error } = await getSupabaseClient()
    .from('profile')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', true)
    .select('*')
    .single();
  if (error) throw error;
  return mapProfileRow(data);
}
