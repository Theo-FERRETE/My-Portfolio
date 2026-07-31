import { getSupabaseClient } from '@/lib/supabase';

export interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  description?: string;
  order: number;
}

interface SkillRow {
  id: number;
  name: string;
  category: string;
  icon: string;
  description?: string | null;
  order: number;
}

function mapSkillRow(row: SkillRow): Skill {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    icon: row.icon,
    description: row.description ?? undefined,
    order: row.order,
  };
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await getSupabaseClient()
    .from('skills')
    .select('*')
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapSkillRow);
}

export async function getSkillById(id: number): Promise<Skill | undefined> {
  const { data, error } = await getSupabaseClient()
    .from('skills')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapSkillRow(data) : undefined;
}

export async function createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
  const { data, error } = await getSupabaseClient()
    .from('skills')
    .insert({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      description: skill.description ?? null,
      order: skill.order,
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapSkillRow(data);
}

export async function updateSkill(id: number, updates: Partial<Skill>): Promise<Skill | null> {
  const { id: _id, ...rest } = updates;
  const { data, error } = await getSupabaseClient()
    .from('skills')
    .update(rest)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? mapSkillRow(data) : null;
}

export async function deleteSkill(id: number): Promise<boolean> {
  const { data, error } = await getSupabaseClient()
    .from('skills')
    .delete()
    .eq('id', id)
    .select('id');
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
