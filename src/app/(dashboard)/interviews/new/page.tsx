import { DashboardShell } from '@/components/layout/dashboard-shell';
import { InterviewSetupForm } from '@/components/interview/setup-form';

export default function NewInterviewPage() {
  return <DashboardShell><div className="mx-auto max-w-5xl"><span className="badge">New practice session</span><h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Build your mock interview</h1><p className="mt-2 max-w-2xl text-slate-600">Choose the role, format, and difficulty. Your coach will create a focused session.</p><div className="mt-9"><InterviewSetupForm /></div></div></DashboardShell>;
}
