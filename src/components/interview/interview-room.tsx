'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { VoiceRecorder } from './voice-recorder';
import type { AnswerFeedback, InterviewConfig } from '@/lib/interviews/types';

type Session = { id: string; questions: string[]; config: InterviewConfig; answers: Array<{ question: string; answer: string; feedback: AnswerFeedback }> };

export function InterviewRoom({ id }: { id: string }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [answer, setAnswer] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState(''); const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  useEffect(() => { const raw = sessionStorage.getItem(`interview:${id}`); if (raw) setSession(JSON.parse(raw)); }, [id]);
  if (!session) return <div className="card p-8 text-center"><h2 className="text-xl font-bold">Interview session not found</h2><p className="mt-2 text-slate-600">Start a new interview to continue.</p><button onClick={() => router.push('/interviews/new')} className="btn btn-primary mt-5">Create interview</button></div>;
  const index = session.answers.length; const question = session.questions[index]; const complete = index >= session.questions.length;
  if (complete) { sessionStorage.setItem(`interview:${id}`, JSON.stringify(session)); router.replace(`/interviews/${id}/results`); return <p>Preparing your results…</p>; }

  async function submit() {
    if (answer.trim().length < 10) { setError('Please provide a more complete answer.'); return; }
    setLoading(true); setError('');
    try { const response = await fetch('/api/interviews/answer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, answer, config: session!.config }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setFeedback(data.feedback); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to evaluate answer'); }
    finally { setLoading(false); }
  }
  function next() { if (!feedback) return; const updated = { ...session!, answers: [...session!.answers, { question, answer, feedback }] }; sessionStorage.setItem(`interview:${id}`, JSON.stringify(updated)); setSession(updated); setAnswer(''); setFeedback(null); }

  return <div className="mx-auto max-w-4xl"><div className="mb-6 flex items-center justify-between gap-4"><div><span className="badge capitalize">{session.config.type} · {session.config.mode}</span><p className="mt-3 text-sm font-semibold text-slate-500">Question {index + 1} of {session.questions.length}</p></div><div className="h-2 w-40 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-indigo-600" style={{ width: `${(index / session.questions.length) * 100}%` }} /></div></div>
    <section className="card shadow-soft p-6 md:p-9"><h1 className="text-2xl font-extrabold leading-snug md:text-3xl">{question}</h1>{session.config.mode === 'voice' && <div className="mt-6"><VoiceRecorder value={answer} onChange={setAnswer} /></div>}<label className="mt-6 block text-sm font-semibold">Your answer<textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="input mt-2 min-h-56 resize-y" placeholder="Use a clear structure, specific actions, and measurable outcomes." maxLength={8000} /></label><div className="mt-2 text-right text-xs text-slate-500">{answer.length}/8000</div>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-red-700">{error}</p>}{!feedback && <button onClick={submit} disabled={loading} className="btn btn-primary mt-5">{loading ? 'Analyzing answer…' : 'Submit answer'}</button>}
      {feedback && <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Instant feedback</h2><span className="text-2xl font-extrabold text-indigo-700">{feedback.score}/100</span></div><p className="mt-3 leading-7 text-slate-700">{feedback.summary}</p><div className="mt-5 grid gap-5 md:grid-cols-2"><div><h3 className="font-bold text-emerald-700">Strengths</h3><ul className="mt-2 space-y-2 text-sm">{feedback.strengths.map((item) => <li key={item}>✓ {item}</li>)}</ul></div><div><h3 className="font-bold text-amber-700">Improve next</h3><ul className="mt-2 space-y-2 text-sm">{feedback.improvements.map((item) => <li key={item}>→ {item}</li>)}</ul></div></div>{feedback.followUpQuestion && <p className="mt-5 rounded-xl bg-white p-4 text-sm"><strong>Coach follow-up:</strong> {feedback.followUpQuestion}</p>}<button onClick={next} className="btn btn-primary mt-6">{index + 1 === session.questions.length ? 'View final results' : 'Next question →'}</button></div>}
    </section></div>;
}
