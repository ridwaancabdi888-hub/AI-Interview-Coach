'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function messagePath(path: string, message: string, type: 'error' | 'success' = 'error') {
  return `${path}?${type}=${encodeURIComponent(message)}`;
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect(messagePath('/sign-up', 'Supabase is not configured.'));
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const fullName = String(formData.get('fullName') || '').trim();
  if (!email || password.length < 8 || fullName.length < 2) redirect(messagePath('/sign-up', 'Enter a valid name, email, and 8-character password.'));
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${origin}/auth/callback` } });
  if (error) redirect(messagePath('/sign-up', error.message));
  redirect(messagePath('/sign-in', 'Check your email to verify your account.', 'success'));
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect(messagePath('/sign-in', 'Supabase is not configured.'));
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(messagePath('/sign-in', error.message));
  redirect('/dashboard');
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect(messagePath('/forgot-password', 'Supabase is not configured.'));
  const email = String(formData.get('email') || '').trim();
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` });
  if (error) redirect(messagePath('/forgot-password', error.message));
  redirect(messagePath('/forgot-password', 'Password reset instructions were sent.', 'success'));
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect(messagePath('/reset-password', 'Supabase is not configured.'));
  const password = String(formData.get('password') || '');
  if (password.length < 8) redirect(messagePath('/reset-password', 'Password must be at least 8 characters.'));
  const { error } = await supabase.auth.updateUser({ password });
  if (error) redirect(messagePath('/reset-password', error.message));
  redirect(messagePath('/sign-in', 'Password updated. You can sign in now.', 'success'));
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect('/sign-in');
}

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) redirect('/onboarding?error=Supabase%20is%20not%20configured');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/sign-in');
  const profile = {
    id: user.id,
    full_name: String(formData.get('fullName') || '').trim(),
    target_role: String(formData.get('targetRole') || '').trim(),
    experience_level: String(formData.get('experienceLevel') || 'entry'),
    career_goal: String(formData.get('careerGoal') || '').trim(),
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('profiles').upsert(profile);
  if (error) redirect(`/onboarding?error=${encodeURIComponent(error.message)}`);
  redirect('/dashboard');
}
