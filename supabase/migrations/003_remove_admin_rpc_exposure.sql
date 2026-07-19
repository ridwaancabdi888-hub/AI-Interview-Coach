drop policy if exists admin_logs_admin_select on public.admin_logs;
drop policy if exists admin_logs_admin_insert on public.admin_logs;

create policy admin_logs_admin_select
on public.admin_logs
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'::public.user_role
  )
);

create policy admin_logs_admin_insert
on public.admin_logs
for insert
to authenticated
with check (
  admin_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'::public.user_role
  )
);

revoke execute on function public.is_admin(uuid) from public, anon, authenticated;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_is_admin boolean;
begin
  if new.role is distinct from old.role then
    select exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'::public.user_role
    ) into caller_is_admin;

    if not caller_is_admin then
      raise exception 'Only administrators can change user roles';
    end if;
  end if;
  return new;
end;
$$;
revoke execute on function public.protect_profile_role() from public, anon, authenticated;
