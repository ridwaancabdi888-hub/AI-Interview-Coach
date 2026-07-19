import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const navigation = ["Dashboard", "New Interview", "Interview History", "Reports", "Progress", "Resume", "Settings"];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="desktop-only border-r bg-white p-6">
        <Logo />
        <nav className="mt-9 space-y-2">{navigation.map((item, index) => <Link key={item} href={index === 0 ? "/dashboard" : "#"} className={`block rounded-xl px-4 py-3 text-sm font-semibold ${index === 0 ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}`}>{item}</Link>)}</nav>
        <div className="mt-10 rounded-2xl bg-slate-950 p-5 text-white"><p className="text-xs font-bold text-indigo-300">WEEKLY GOAL</p><p className="mt-2 font-bold">3 of 5 sessions</p><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-2 w-3/5 rounded-full bg-indigo-400" /></div></div>
      </aside>
      <div>
        <header className="flex h-18 items-center justify-between border-b bg-white px-5 lg:px-8"><div className="lg:hidden"><Logo /></div><p className="desktop-only text-sm text-slate-500">Sunday, July 19</p><div className="flex items-center gap-3"><button className="grid h-10 w-10 place-items-center rounded-full border">🔔</button><div className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 font-bold text-white">RC</div></div></header>
        <main className="p-5 pb-24 lg:p-8">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-4 border-t bg-white p-2 text-center text-xs font-semibold lg:hidden"><Link className="rounded-lg bg-indigo-50 p-2 text-indigo-700" href="/dashboard">Home</Link><Link className="p-2" href="#">Practice</Link><Link className="p-2" href="#">History</Link><Link className="p-2" href="#">More</Link></nav>
      </div>
    </div>
  );
}
