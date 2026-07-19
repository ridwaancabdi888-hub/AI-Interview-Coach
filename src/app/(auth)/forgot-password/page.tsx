import Link from 'next/link';
import { AuthShell } from '@/components/ui/auth-shell';
import { requestPasswordReset } from '@/lib/auth/actions';

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const { error, success } = await searchParams;
  return <AuthShell title="Reset your password" subtitle="We will send a secure reset link to your email."><form action={requestPasswordReset} className="mt-7 space-y-4">{success && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-semibold">Email address<input name="email" required type="email" className="input mt-2" /></label><button className="btn btn-primary w-full">Send reset link</button><Link href="/sign-in" className="block text-center text-sm font-bold text-indigo-600">← Back to sign in</Link></form></AuthShell>;
}
