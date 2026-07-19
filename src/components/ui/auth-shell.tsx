import { Logo } from "./logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#e0e7ff,transparent_35%)] px-4 py-10">
      <div className="mx-auto mb-8 w-fit"><Logo /></div>
      <div className="card shadow-soft mx-auto max-w-md p-7 md:p-9">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}
