import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const stats = [
  ["Readiness score", "82%", "+6% this month"],
  ["Average score", "78", "Across 14 interviews"],
  ["Practice streak", "7 days", "Personal best"],
  ["Hours practiced", "12.5h", "This month"],
];

export default function DashboardPage() {
  return (
    <DashboardShell>
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="font-semibold text-indigo-600">Good morning, Ridwaan 👋</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">Ready for your next opportunity?</h1><p className="mt-2 text-slate-600">Keep your momentum going with a focused practice session.</p></div>
        <Link href="#" className="btn btn-primary">＋ Start new interview</Link>
      </section>
      <section className="grid-auto mt-8">{stats.map(([label, value, detail]) => <article className="card p-5" key={label}><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p><p className="mt-2 text-sm text-emerald-600">{detail}</p></article>)}</section>
      <section className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">
        <article className="card p-6"><h2 className="text-xl font-bold">Performance trend</h2><p className="text-sm text-slate-500">Your last six interview scores</p><div className="mt-8 flex h-52 items-end justify-between gap-3 border-b border-l px-4">{[58,66,63,72,76,82].map((score, index) => <div key={index} className="flex h-full flex-1 items-end"><div className="w-full rounded-t-lg bg-indigo-500/90" style={{ height: `${score}%` }} title={`${score}%`} /></div>)}</div></article>
        <article className="card p-6"><h2 className="text-xl font-bold">Recommended next</h2><div className="mt-5 rounded-2xl bg-indigo-50 p-5"><span className="badge">Behavioral</span><h3 className="mt-4 text-lg font-bold">STAR method practice</h3><p className="mt-2 text-sm leading-6 text-slate-600">Improve structure and clarity in experience-based answers.</p><button className="btn btn-primary mt-5 w-full">Start 15-min practice</button></div></article>
      </section>
      <section className="card mt-8 overflow-hidden"><div className="border-b p-6"><h2 className="text-xl font-bold">Recent interviews</h2><p className="text-sm text-slate-500">Review feedback and continue improving.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-slate-50 text-sm text-slate-500"><tr><th className="p-4">Role</th><th>Date</th><th>Type</th><th>Score</th><th>Status</th></tr></thead><tbody>{[["Frontend Developer","Jul 18","Technical","82%"],["Software Engineer Intern","Jul 15","Behavioral","76%"],["General Practice","Jul 12","General","74%"]].map((row) => <tr className="border-t" key={row[0]}>{row.map((cell) => <td className="p-4" key={cell}>{cell}</td>)}<td className="p-4 text-emerald-600">Completed</td></tr>)}</tbody></table></div></section>
    </DashboardShell>
  );
}
