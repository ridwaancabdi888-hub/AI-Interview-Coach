import { AuthShell } from "@/components/ui/auth-shell";
import { AuthForm } from "@/components/ui/auth-form";

export default function SignUpPage() {
  return <AuthShell title="Create your account" subtitle="Start practicing smarter interviews for free."><AuthForm mode="sign-up" /></AuthShell>;
}
