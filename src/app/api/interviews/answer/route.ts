import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/ai/openai';
import { rateLimit } from '@/lib/rate-limit/memory';
import type { InterviewConfig } from '@/lib/interviews/types';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  if (!rateLimit(`answer:${ip}`, 30, 60_000).allowed) return NextResponse.json({ error: 'Too many submissions. Slow down and try again.' }, { status: 429 });
  try {
    const body = await request.json() as { question: string; answer: string; config: InterviewConfig };
    if (!body.question || !body.answer || body.answer.trim().length < 10 || body.answer.length > 8000) return NextResponse.json({ error: 'Answer must be between 10 and 8,000 characters.' }, { status: 400 });
    const feedback = await evaluateAnswer(body.question, body.answer, body.config);
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('answer evaluation error', error);
    return NextResponse.json({ error: 'Feedback is temporarily unavailable. Please retry.' }, { status: 500 });
  }
}
