import { getSupabaseClient } from '@/lib/supabase';

// Projects
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
}

function mapProjectRow(row: any): Project {
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

export async function getProjectById(id: number): Promise<Project | undefined> {
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProjectRow(data) : undefined;
}

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
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapProjectRow(data);
}

export async function updateProject(id: number, updates: Partial<Project>): Promise<Project | null> {
  const { id: _id, createdAt: _createdAt, ...rest } = updates;
  const { data, error } = await getSupabaseClient()
    .from('projects')
    .update(rest)
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

// Skills
export interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  description?: string;
  order: number;
}

function mapSkillRow(row: any): Skill {
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

// Profile
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

function mapProfileRow(row: any): Profile {
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

// Contact messages
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  replyMessage?: string;
  repliedAt?: string;
  createdAt: string;
}

function mapContactMessageRow(row: any): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    status: row.status,
    replyMessage: row.reply_message ?? undefined,
    repliedAt: row.replied_at ?? undefined,
    createdAt: row.created_at,
  };
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapContactMessageRow);
}

export async function createContactMessage(
  input: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>
): Promise<ContactMessage> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .insert({
      name: input.name,
      email: input.email,
      message: input.message,
      status: 'new',
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapContactMessageRow(data);
}

export async function getContactMessageById(id: number): Promise<ContactMessage | undefined> {
  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapContactMessageRow(data) : undefined;
}

export async function updateContactMessage(
  id: number,
  updates: Partial<ContactMessage>
): Promise<ContactMessage | null> {
  const { id: _id, ...rest } = updates;
  const patch: Record<string, unknown> = { ...rest };
  if ('replyMessage' in rest) {
    patch.reply_message = rest.replyMessage;
    delete patch.replyMessage;
  }
  if ('repliedAt' in rest) {
    patch.replied_at = rest.repliedAt;
    delete patch.repliedAt;
  }

  const { data, error } = await getSupabaseClient()
    .from('contact_messages')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data ? mapContactMessageRow(data) : null;
}

// Site settings
export type DefaultTheme = 'obsidian' | 'nebula' | 'emerald' | 'crimson' | 'amber' | 'sapphire' | 'rose';

export interface SiteSettings {
  defaultTheme: DefaultTheme;
  updatedAt: string;
}

function mapSiteSettingsRow(row: any): SiteSettings {
  return {
    defaultTheme: row.default_theme,
    updatedAt: row.updated_at,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await getSupabaseClient()
    .from('site_settings')
    .select('*')
    .eq('id', true)
    .single();
  if (error) throw error;
  return mapSiteSettingsRow(data);
}

export async function updateSiteSettings(defaultTheme: DefaultTheme): Promise<SiteSettings> {
  const { data, error } = await getSupabaseClient()
    .from('site_settings')
    .update({ default_theme: defaultTheme, updated_at: new Date().toISOString() })
    .eq('id', true)
    .select('*')
    .single();
  if (error) throw error;
  return mapSiteSettingsRow(data);
}
