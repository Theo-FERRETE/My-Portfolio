-- Remplace l'id numérique par un slug dans l'URL publique des projets :
-- l'id de base reste utilisé côté admin, le slug est dérivé du titre et
-- exposé publiquement à la place.
alter table public.projects add column slug text;

update public.projects
set slug = trim(both '-' from regexp_replace(lower(title), '[^a-z0-9]+', '-', 'g'))
where slug is null;

-- Dédoublonne au cas où deux titres produiraient le même slug
with ranked as (
  select id, row_number() over (partition by slug order by id) as rn
  from public.projects
)
update public.projects p
set slug = p.slug || '-' || ranked.rn
from ranked
where p.id = ranked.id and ranked.rn > 1;

alter table public.projects
  alter column slug set not null,
  add constraint projects_slug_key unique (slug);
