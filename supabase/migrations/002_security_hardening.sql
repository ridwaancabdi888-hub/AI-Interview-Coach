revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to supabase_auth_admin;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'::public.user_role
  );
$$;
revoke execute on function public.is_admin(uuid) from public, anon;
grant execute on function public.is_admin(uuid) to authenticated;

create policy admin_logs_admin_select
on public.admin_logs
for select
to authenticated
using (public.is_admin(auth.uid()));

create policy admin_logs_admin_insert
on public.admin_logs
for insert
to authenticated
with check (public.is_admin(auth.uid()) and admin_id = auth.uid());

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin(auth.uid()) then
    raise exception 'Only administrators can change user roles';
  end if;
  return new;
end;
$$;
revoke execute on function public.protect_profile_role() from public, anon, authenticated;

drop trigger if exists protect_profile_role_trigger on public.profiles;
create trigger protect_profile_role_trigger
before update on public.profiles
for each row execute function public.protect_profile_role();
