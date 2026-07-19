'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { InterviewConfig, InterviewMode, InterviewType } from '@/lib/interviews/types';

const types: Array<{ id: InterviewType; title: string; description: string }> = [
  { id: 'technical', title: 'Technical', description: 'Role-specific skills, systems, and problem solving.' },
  { id: 'behavioral', title: 'Behavioral', description: 'STAR stories, teamwork, leadership, and resilience.' },
  { id: 'general', title: 'General', description: 'Introductions, motivation, strengths, and career goals.' },
];

export function InterviewSetupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<InterviewConfig>({ type: 'technical', mode: 'written', jobRole: 'Software Engineer', experienceLevel: 'entry', questionCount: 5, difficulty: 'balanced', focusAreas: [] });
  const [error, setError] = useState('');

  async function start() {
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/interviews/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to start interview');
      sessionStorage.setItem(`interview:${data.id}`, JSON.stringify({ ...data, config, answers: [] }));
      router.push(`/interviews/${data.id}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong'); setLoading(false); }
  }

  return <div className="space-y-7">
    <section><h2 className="text-lg font-bold">1. Interview type</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{types.map((item) => <button type="button" onClick={() => setConfig({ ...config, type: item.id })} key={item.id} className={`card p-5 text-left transition ${config.type === item.id ? 'border-indigo-600 ring-4 ring-indigo-50' : 'hover:border-slate-300'}`}><h3 className="font-bold capitalize">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p></button>)}</div></section>
    <section className="card grid gap-5 p-6 md:grid-cols-2"><label className="text-sm font-semibold">Target job role<input value={config.jobRole} onChange={(e) => setConfig({ ...config, jobRole: e.target.value })} className="input mt-2" /></label><label className="text-sm font-semibold">Experience level<select value={config.experienceLevel} onChange={(e) => setConfig({ ...config, experienceLevel: e.target.value as InterviewConfig['experienceLevel'] })} className="input mt-2"><option value="student">Student</option><option value="entry">Entry level</option><option value="mid">Mid level</option><option value="senior">Senior</option></select></label><label className="text-sm font-semibold">Difficulty<select value={config.difficulty} onChange={(e) => setConfig({ ...config, difficulty: e.target.value as InterviewConfig['difficulty'] })} className="input mt-2"><option value="easy">Easy</option><option value="balanced">Balanced</option><option value="challenging">Challenging</option></select></label><label className="text-sm font-semibold">Questions<select value={config.questionCount} onChange={(e) => setConfig({ ...config, questionCount: Number(e.target.value) })} className="input mt-2"><option value={5}>5 questions</option><option value={8}>8 questions</option><option value={10}>10 questions</option></select></label></section>
    <section><h2 className="text-lg font-bold">2. Answer mode</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">{(['written','voice'] as InterviewMode[]).map((mode) => <button type="button" key={mode} onClick={() => setConfig({ ...config, mode })} className={`card p-5 text-left ${config.mode === mode ? 'border-indigo-600 ring-4 ring-indigo-50' : ''}`}><h3 className="font-bold capitalize">{mode} mode</h3><p className="mt-2 text-sm text-slate-600">{mode === 'voice' ? 'Record your response, review the transcript, and edit before submitting.' : 'Type thoughtful answers in a focused editor.'}</p></button>)}</div></section>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    <button disabled={loading || config.jobRole.trim().length < 2} onClick={start} className="btn btn-primary w-full md:w-auto">{loading ? 'Preparing interview…' : 'Start interview →'}</button>
  </div>;
}
