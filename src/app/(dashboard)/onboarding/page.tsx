import { saveProfile } from '@/lib/auth/actions';

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="min-h-screen bg-slate-50 px-4 py-12"><div className="card shadow-soft mx-auto max-w-2xl p-7 md:p-10">
    <span className="badge">Welcome setup</span><h1 className="mt-4 text-3xl font-extrabold">Personalize your interview coach</h1><p className="mt-2 text-slate-600">These details help tailor questions and recommendations.</p>
    <form action={saveProfile} className="mt-8 grid gap-5 md:grid-cols-2">
      {error && <p className="md:col-span-2 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}
      <label className="text-sm font-semibold">Full name<input name="fullName" required className="input mt-2" /></label>
      <label className="text-sm font-semibold">Target job role<input name="targetRole" required className="input mt-2" placeholder="Frontend Developer" /></label>
      <label className="text-sm font-semibold">Experience level<select name="experienceLevel" className="input mt-2"><option value="student">Student</option><option value="entry">Entry level</option><option value="mid">Mid level</option><option value="senior">Senior</option></select></label>
      <label className="text-sm font-semibold md:col-span-2">Career goal<textarea name="careerGoal" className="input mt-2 min-h-28" placeholder="Describe the role or opportunity you are preparing for." /></label>
      <button className="btn btn-primary md:col-span-2">Complete onboarding</button>
    </form>
  </div></main>;
}
