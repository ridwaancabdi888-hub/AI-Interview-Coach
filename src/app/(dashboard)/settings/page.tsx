import { DashboardShell } from '@/components/layout/dashboard-shell';
import { signOut } from '@/lib/auth/actions';

export default function SettingsPage() {
  return <DashboardShell><div className="max-w-3xl"><h1 className="text-3xl font-extrabold">Settings</h1><section className="card mt-7 p-6"><h2 className="text-lg font-bold">Account</h2><p className="mt-2 text-slate-600">Manage your session and account preferences.</p><form action={signOut} className="mt-5"><button className="btn btn-secondary">Sign out</button></form></section></div></DashboardShell>;
}
