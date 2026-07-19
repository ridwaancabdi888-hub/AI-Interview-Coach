import { AuthShell } from "@/components/ui/auth-shell";
import { AuthForm } from "@/components/ui/auth-form";

export default function SignInPage() {
  return <AuthShell title="Welcome back" subtitle="Continue your interview preparation journey."><AuthForm mode="sign-in" /></AuthShell>;
}
