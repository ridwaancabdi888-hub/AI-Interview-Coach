import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/ai/openai';
import { rateLimit } from '@/lib/rate-limit/memory';
import type { InterviewConfig } from '@/lib/interviews/types';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  const limit = rateLimit(`start:${ip}`, 8, 60_000);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many interview requests. Try again shortly.' }, { status: 429 });
  try {
    const config = await request.json() as InterviewConfig;
    if (!['technical','behavioral','general'].includes(config.type) || !['written','voice'].includes(config.mode) || !config.jobRole?.trim() || ![5,8,10].includes(config.questionCount)) return NextResponse.json({ error: 'Invalid interview settings.' }, { status: 400 });
    const questions = await generateQuestions(config);
    return NextResponse.json({ id: crypto.randomUUID(), questions, createdAt: new Date().toISOString() });
  } catch (error) {
    console.error('start interview error', error);
    return NextResponse.json({ error: 'Could not prepare the interview. Please retry.' }, { status: 500 });
  }
}
