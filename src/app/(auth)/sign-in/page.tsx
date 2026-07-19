import Link from 'next/link';
import { AuthShell } from '@/components/ui/auth-shell';
import { signIn } from '@/lib/auth/actions';

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { error, success } = await searchParams;
  return <AuthShell title="Welcome back" subtitle="Continue your interview preparation journey.">
    <form action={signIn} className="mt-7 space-y-4">
      {success && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-semibold">Email address<input name="email" required type="email" autoComplete="email" className="input mt-2" placeholder="you@example.com" /></label>
      <label className="block text-sm font-semibold">Password<input name="password" required type="password" autoComplete="current-password" className="input mt-2" /></label>
      <div className="text-right"><Link href="/forgot-password" className="text-sm font-semibold text-indigo-600">Forgot password?</Link></div>
      <button className="btn btn-primary w-full">Sign in</button><p className="text-center text-sm text-slate-600">New here? <Link className="font-bold text-indigo-600" href="/sign-up">Create account</Link></p>
    </form>
  </AuthShell>;
}
