import { AuthShell } from '@/components/ui/auth-shell';
import { updatePassword } from '@/lib/auth/actions';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <AuthShell title="Choose a new password" subtitle="Use at least eight characters.">
    <form action={updatePassword} className="mt-7 space-y-4">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-semibold">New password<input name="password" required minLength={8} type="password" className="input mt-2" /></label>
      <button className="btn btn-primary w-full">Update password</button>
    </form>
  </AuthShell>;
}
