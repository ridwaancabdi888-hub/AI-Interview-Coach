"use client";

import { useState } from "react";
import Link from "next/link";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [loading, setLoading] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => setLoading(false), 800);
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      {mode === "sign-up" && <label className="block text-sm font-semibold">Full name<input required className="input mt-2" placeholder="Ridwaan Cabdi" /></label>}
      <label className="block text-sm font-semibold">Email address<input required type="email" className="input mt-2" placeholder="you@example.com" /></label>
      <label className="block text-sm font-semibold">Password<input required minLength={8} type="password" className="input mt-2" placeholder="At least 8 characters" /></label>
      {mode === "sign-in" && <div className="text-right"><Link href="/forgot-password" className="text-sm font-semibold text-indigo-600">Forgot password?</Link></div>}
      <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}</button>
      <p className="text-center text-sm text-slate-600">{mode === "sign-in" ? "New here? " : "Already have an account? "}<Link className="font-bold text-indigo-600" href={mode === "sign-in" ? "/sign-up" : "/sign-in"}>{mode === "sign-in" ? "Create account" : "Sign in"}</Link></p>
    </form>
  );
}
