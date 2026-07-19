import Link from 'next/link';
import { AuthShell } from '@/components/ui/auth-shell';
import { signUp } from '@/lib/auth/actions';

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <AuthShell title="Create your account" subtitle="Start practicing smarter interviews for free.">
    <form action={signUp} className="mt-7 space-y-4">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-semibold">Full name<input name="fullName" required minLength={2} autoComplete="name" className="input mt-2" /></label>
      <label className="block text-sm font-semibold">Email address<input name="email" required type="email" autoComplete="email" className="input mt-2" /></label>
      <label className="block text-sm font-semibold">Password<input name="password" required minLength={8} type="password" autoComplete="new-password" className="input mt-2" /><span className="mt-1 block text-xs font-normal text-slate-500">Minimum 8 characters.</span></label>
      <button className="btn btn-primary w-full">Create account</button><p className="text-center text-sm text-slate-600">Already registered? <Link className="font-bold text-indigo-600" href="/sign-in">Sign in</Link></p>
    </form>
  </AuthShell>;
}
