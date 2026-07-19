create extension if not exists "pgcrypto";
create type public.user_role as enum ('user','admin');
create type public.interview_type as enum ('technical','behavioral','general');
create type public.interview_mode as enum ('written','voice');
create type public.interview_status as enum ('draft','in_progress','completed','abandoned');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', avatar_url text, target_role text, experience_level text default 'entry', career_goal text,
  role public.user_role not null default 'user', onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, type public.interview_type not null, mode public.interview_mode not null, job_role text not null,
  experience_level text not null, settings jsonb not null default '{}'::jsonb, status public.interview_status not null default 'draft',
  current_question_index int not null default 0, final_score numeric(5,2), category_scores jsonb, strengths text[], weaknesses text[], summary text,
  created_at timestamptz not null default now(), completed_at timestamptz
);
create table public.interview_questions (
  id uuid primary key default gen_random_uuid(), session_id uuid not null references public.interview_sessions(id) on delete cascade,
  position int not null, question text not null, category text, is_follow_up boolean not null default false, created_at timestamptz not null default now(), unique(session_id, position)
);
create table public.interview_answers (
  id uuid primary key default gen_random_uuid(), question_id uuid not null references public.interview_questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade, answer_text text not null, transcript text, audio_path text,
  score numeric(5,2), feedback jsonb, created_at timestamptz not null default now()
);
create table public.usage_events (
  id bigint generated always as identity primary key, user_id uuid references public.profiles(id) on delete cascade,
  event_type text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table public.admin_logs (
  id bigint generated always as identity primary key, admin_id uuid references public.profiles(id), action text not null,
  target_type text, target_id text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id, full_name) values(new.id, coalesce(new.raw_user_meta_data->>'full_name','')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.interview_questions enable row level security;
alter table public.interview_answers enable row level security;
alter table public.usage_events enable row level security;
alter table public.admin_logs enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "sessions_owner_all" on public.interview_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "questions_owner_select" on public.interview_questions for select using (exists(select 1 from public.interview_sessions s where s.id=session_id and s.user_id=auth.uid()));
create policy "answers_owner_all" on public.interview_answers for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "usage_owner_select" on public.usage_events for select using (auth.uid()=user_id);
