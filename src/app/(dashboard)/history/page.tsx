import Link from 'next/link';
import { DashboardShell } from '@/components/layout/dashboard-shell';

const sessions = [
  { role: 'Frontend Developer', type: 'Technical', date: 'Jul 18, 2026', score: 82, mode: 'Written' },
  { role: 'Software Engineer Intern', type: 'Behavioral', date: 'Jul 15, 2026', score: 76, mode: 'Voice' },
  { role: 'General Practice', type: 'General', date: 'Jul 12, 2026', score: 74, mode: 'Written' },
];
export default function HistoryPage() { return <DashboardShell><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-extrabold">Interview history</h1><p className="mt-2 text-slate-600">Review past sessions and identify recurring patterns.</p></div><Link className="btn btn-primary" href="/interviews/new">New interview</Link></div><div className="card mt-7 overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left"><thead className="bg-slate-50 text-sm text-slate-500"><tr><th className="p-4">Role</th><th>Type</th><th>Mode</th><th>Date</th><th>Score</th><th></th></tr></thead><tbody>{sessions.map((item) => <tr className="border-t" key={item.role}><td className="p-4 font-semibold">{item.role}</td><td>{item.type}</td><td>{item.mode}</td><td>{item.date}</td><td><span className="badge">{item.score}%</span></td><td><button className="font-semibold text-indigo-600">View report</button></td></tr>)}</tbody></table></div></div></DashboardShell>; }
