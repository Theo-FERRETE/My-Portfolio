import { getSupabaseClient } from '@/lib/supabase';

export type DefaultTheme = 'obsidian' | 'nebula' | 'emerald' | 'crimson' | 'amber' | 'sapphire' | 'rose';

export interface SiteSettings {
  defaultTheme: DefaultTheme;
  updatedAt: string;
}

interface SiteSettingsRow {
  default_theme: DefaultTheme;
  updated_at: string;
}

function mapSiteSettingsRow(row: SiteSettingsRow): SiteSettings {
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
