import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { signOut } from '@/lib/auth/actions';
import { DesktopNavigation, MobileNavigation } from '@/components/layout/dashboard-navigation';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="desktop-only border-r border-slate-200 bg-white p-6">
        <Logo />
        <DesktopNavigation />
        <div className="mt-10 rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-200">
          <p className="text-xs font-bold tracking-widest text-indigo-300">WEEKLY GOAL</p>
          <p className="mt-2 font-bold">3 of 5 sessions</p>
          <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 w-3/5 rounded-full bg-indigo-400" /></div>
          <Link href="/analytics" className="mt-4 inline-block text-xs font-bold text-indigo-200 hover:text-white">View progress →</Link>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-3 backdrop-blur lg:px-8">
          <div className="lg:hidden"><Logo /></div>
          <p className="desktop-only text-sm font-medium text-slate-500">Your focused practice workspace</p>
          <div className="flex items-center gap-3">
            <Link aria-label="Open settings" href="/settings" className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white transition hover:border-indigo-300 hover:bg-indigo-50">⚙</Link>
            <Link aria-label="Open profile" href="/profile" className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 font-bold text-white shadow-md shadow-indigo-200">RC</Link>
            <form action={signOut} className="desktop-only"><button className="text-sm font-semibold text-slate-500 hover:text-slate-900">Sign out</button></form>
          </div>
        </header>
        <main id="main-content" className="p-5 pb-28 lg:p-8">{children}</main>
        <MobileNavigation />
      </div>
    </div>
  );
}
