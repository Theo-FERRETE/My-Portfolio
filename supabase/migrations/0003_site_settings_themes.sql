-- Remplace Porcelain (clair) par 4 nouveaux thèmes sombres : 7 thèmes au total.
alter table public.site_settings drop constraint if exists site_settings_default_theme_check;

alter table public.site_settings
  add constraint site_settings_default_theme_check
  check (default_theme in ('obsidian', 'nebula', 'emerald', 'crimson', 'amber', 'sapphire', 'rose'));

update public.site_settings set default_theme = 'obsidian' where default_theme = 'porcelain';
