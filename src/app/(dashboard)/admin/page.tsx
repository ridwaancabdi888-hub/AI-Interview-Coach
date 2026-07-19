import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { createClient } from '@/lib/supabase/server';

const users = [
  ['Ridwaan Cabdi', 'user', '14', 'Active'],
  ['Ayaan Ali', 'user', '8', 'Active'],
  ['Admin User', 'admin', '31', 'Active'],
];

export default async function AdminPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/sign-in');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/dashboard');

  return (
    <DashboardShell>
      <span className="badge">Admin workspace</span>
      <h1 className="mt-4 text-3xl font-extrabold">System overview</h1>
      <section className="grid-auto mt-7">
        {[
          ['Total users', '1,248'],
          ['Interviews this month', '3,904'],
          ['AI requests today', '612'],
          ['Completion rate', '78%'],
        ].map(([label, value]) => (
          <article className="card p-5" key={label}>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-extrabold">{value}</p>
          </article>
        ))}
      </section>
      <section className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <div className="card overflow-hidden">
          <div className="border-b p-6"><h2 className="text-xl font-bold">User management</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead className="bg-slate-50"><tr><th className="p-4">User</th><th>Role</th><th>Interviews</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {users.map((row) => (
                  <tr className="border-t" key={row[0]}>
                    {row.map((cell) => <td className="p-4" key={cell}>{cell}</td>)}
                    <td><button className="font-semibold text-indigo-600">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-6">
          <article className="card p-6">
            <h2 className="text-xl font-bold">Question content</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Manage curated prompts, blocked topics, and interview templates.</p>
            <button className="btn btn-secondary mt-5">Open content manager</button>
          </article>
          <article className="card p-6">
            <h2 className="text-xl font-bold">Moderation</h2>
            <p className="mt-2 text-sm text-slate-600">No abuse alerts require action.</p>
            <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">Systems healthy</span>
          </article>
        </div>
      </section>
      <section className="card mt-6 p-6">
        <h2 className="text-xl font-bold">Recent activity logs</h2>
        <ul className="mt-4 divide-y text-sm">
          <li className="py-3">Admin updated the behavioral interview template.</li>
          <li className="py-3">Usage limit policy evaluated successfully.</li>
          <li className="py-3">New user account verified.</li>
        </ul>
      </section>
    </DashboardShell>
  );
}
