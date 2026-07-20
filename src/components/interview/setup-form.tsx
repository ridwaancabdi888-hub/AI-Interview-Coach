'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { InterviewConfig, InterviewMode, InterviewType } from '@/lib/interviews/types';

const types: Array<{ id: InterviewType; title: string; description: string; icon: string }> = [
  { id: 'technical', title: 'Technical', description: 'Role-specific skills, systems, and problem solving.', icon: '⌘' },
  { id: 'behavioral', title: 'Behavioral', description: 'STAR stories, teamwork, leadership, and resilience.', icon: '◎' },
  { id: 'general', title: 'General', description: 'Introductions, motivation, strengths, and career goals.', icon: '✦' },
];

export function InterviewSetupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<InterviewConfig>({
    type: 'technical',
    mode: 'written',
    jobRole: 'Software Engineer',
    experienceLevel: 'entry',
    questionCount: 5,
    difficulty: 'balanced',
    focusAreas: [],
  });
  const [error, setError] = useState('');

  async function start() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to start interview');
      sessionStorage.setItem(`interview:${data.id}`, JSON.stringify({ ...data, config, answers: [] }));
      router.push(`/interviews/${data.id}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Something went wrong');
      setLoading(false);
    }
  }

  const selectionClass = (selected: boolean) =>
    `relative overflow-hidden rounded-3xl border p-5 text-left transition-all duration-200 ${
      selected
        ? 'border-indigo-600 bg-indigo-50/70 shadow-xl shadow-indigo-100 ring-2 ring-indigo-500'
        : 'border-slate-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg'
    }`;

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold">1. Interview type</h2>
          <span className="text-sm font-semibold text-slate-400">Choose one</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {types.map((item) => {
            const selected = config.type === item.id;
            return (
              <button type="button" onClick={() => setConfig({ ...config, type: item.id })} key={item.id} className={selectionClass(selected)} aria-pressed={selected}>
                {selected && <span className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">✓</span>}
                <span className={`grid h-11 w-11 place-items-center rounded-2xl text-lg font-bold ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>{item.icon}</span>
                <h3 className="mt-4 text-lg font-extrabold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-extrabold">Interview details</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold">Target job role<input value={config.jobRole} onChange={(event) => setConfig({ ...config, jobRole: event.target.value })} className="input mt-2" placeholder="e.g. Frontend Developer" /></label>
          <label className="text-sm font-semibold">Experience level<select value={config.experienceLevel} onChange={(event) => setConfig({ ...config, experienceLevel: event.target.value as InterviewConfig['experienceLevel'] })} className="input mt-2"><option value="student">Student</option><option value="entry">Entry level</option><option value="mid">Mid level</option><option value="senior">Senior</option></select></label>
          <label className="text-sm font-semibold">Difficulty<select value={config.difficulty} onChange={(event) => setConfig({ ...config, difficulty: event.target.value as InterviewConfig['difficulty'] })} className="input mt-2"><option value="easy">Easy</option><option value="balanced">Balanced</option><option value="challenging">Challenging</option></select></label>
          <label className="text-sm font-semibold">Questions<select value={config.questionCount} onChange={(event) => setConfig({ ...config, questionCount: Number(event.target.value) })} className="input mt-2"><option value={5}>5 questions</option><option value={8}>8 questions</option><option value={10}>10 questions</option></select></label>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-extrabold">2. Answer mode</h2>
          <span className="text-sm font-semibold text-slate-400">Change anytime later</span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(['written', 'voice'] as InterviewMode[]).map((mode) => {
            const selected = config.mode === mode;
            return (
              <button type="button" key={mode} onClick={() => setConfig({ ...config, mode })} className={selectionClass(selected)} aria-pressed={selected}>
                {selected && <span className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white">✓</span>}
                <h3 className="text-lg font-extrabold capitalize">{mode} mode</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{mode === 'voice' ? 'Record your response, review the transcript, and edit before submitting.' : 'Type thoughtful answers in a focused editor.'}</p>
              </button>
            );
          })}
        </div>
      </section>

      {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 font-medium text-red-700">{error}</p>}

      <button disabled={loading || config.jobRole.trim().length < 2} onClick={start} className="btn btn-primary w-full py-4 text-base shadow-lg shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-60">
        {loading ? 'Preparing interview…' : 'Start interview →'}
      </button>
    </div>
  );
}
