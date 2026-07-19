import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ProtectedDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect('/sign-in');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  return children;
}
