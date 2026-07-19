import Link from "next/link";
import { AuthShell } from "@/components/ui/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset your password" subtitle="We will send a secure reset link to your email.">
      <form className="mt-7 space-y-4">
        <label className="block text-sm font-semibold">Email address<input required type="email" className="input mt-2" placeholder="you@example.com" /></label>
        <button className="btn btn-primary w-full">Send reset link</button>
        <Link href="/sign-in" className="block text-center text-sm font-bold text-indigo-600">← Back to sign in</Link>
      </form>
    </AuthShell>
  );
}
