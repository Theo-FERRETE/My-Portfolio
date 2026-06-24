-- ============================================================
-- site_settings (single-row table — thème par défaut du site)
-- ============================================================
create table public.site_settings (
  id             boolean primary key default true check (id),
  default_theme  text not null default 'obsidian' check (default_theme in ('obsidian', 'porcelain', 'nebula', 'emerald')),
  updated_at     timestamptz not null default now()
);

alter table public.site_settings enable row level security;

insert into public.site_settings (id, default_theme) values (true, 'obsidian');
