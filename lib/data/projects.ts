import { cache } from 'react';
import { getSupabaseClient } from '@/lib/supabase';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;
  featured: boolean;
  createdAt: string;
  /** Mini étude de cas, propre à chaque projet — vide tant que non renseignée. */
  context: string;
  myRole: string;
  challenge: string;
  result: string;
}

interface ProjectRow {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;
  featured: boolean;
  created_at: string;
  context: string;
  my_role: string;
  challenge: string;
  result: string;
}

function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    tags: row.tags,
    link: row.link,
    github: row.github,
    featured: row.featured,
    createdAt: row.created_at,
    context: row.context,
    myRole: row.my_role,
    challenge: row.challenge,
    result: row.result,
  };
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapProjectRow);
}

export const getProjectById = cache(async (id: number): Promise<Project | undefined> => {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProjectRow(data) : undefined;
});

export async function createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .insert({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags,
      link: project.link,
      github: project.github ?? '',
      featured: project.featured,
      context: project.context ?? '',
      my_role: project.myRole ?? '',
      challenge: project.challenge ?? '',
      result: project.result ?? '',
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapProjectRow(data);
}

export async function updateProject(id: number, updates: Partial<Project>): Promise<Project | null> {
  const { id: _id, createdAt: _createdAt, myRole, ...rest } = updates;
  const payload: Record<string, unknown> = { ...rest };
  if (myRole !== undefined) payload.my_role = myRole;

  const { data, error } = await getSupabaseClient()
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? mapProjectRow(data) : null;
}

export async function deleteProject(id: number): Promise<boolean> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .delete()
    .eq('id', id)
    .select('id');
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
