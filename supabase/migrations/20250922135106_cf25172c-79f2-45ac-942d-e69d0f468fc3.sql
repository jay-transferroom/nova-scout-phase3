-- Allow recruitment/director to manage shortlist players across all shortlists
-- Insert policy
create policy if not exists "Recruitment and director can insert shortlist players"
on public.shortlist_players
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('recruitment','director')
  )
);

-- Delete policy
create policy if not exists "Recruitment and director can delete shortlist players"
on public.shortlist_players
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('recruitment','director')
  )
);

-- Optionally allow updates if needed in future (kept for completeness)
create policy if not exists "Recruitment and director can update shortlist players"
on public.shortlist_players
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('recruitment','director')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('recruitment','director')
  )
);

-- Allow recruitment/director to update and delete any shortlists (CRUD management)
create policy if not exists "Recruitment and director can update any shortlists"
on public.shortlists
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('recruitment','director')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('recruitment','director')
  )
);

create policy if not exists "Recruitment and director can delete any shortlists"
on public.shortlists
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('recruitment','director')
  )
);
