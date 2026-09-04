-- Remplace la liste de "caractéristiques" identique sur chaque projet par
-- un mini format étude de cas, propre à chaque projet.
alter table public.projects
  add column context   text not null default '',
  add column my_role    text not null default '',
  add column challenge  text not null default '',
  add column result     text not null default '';
