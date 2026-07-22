import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="container flex h-18 items-center justify-between">
        <Logo />
        <nav aria-label="Main navigation" className="desktop-only flex items-center gap-7 text-sm font-semibold text-slate-600">
          <a href="#features">Features</a><a href="#how">How it works</a><a href="#faq">FAQ</a><a href="#get-started">Get started</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="btn btn-secondary desktop-only" href="/sign-in">Sign in</Link>
          <Link className="btn btn-primary" href="/sign-up">Get started</Link>
        </div>
      </div>
    </header>
  );
}
