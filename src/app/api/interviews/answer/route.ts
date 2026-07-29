import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/ai/openai';
import { enforceRateLimit } from '@/lib/rate-limit/distributed';
import { createClient } from '@/lib/supabase/server';
import type { InterviewConfig } from '@/lib/interviews/types';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Authentication is temporarily unavailable.' }, { status: 503 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limited = await enforceRateLimit(
    supabase,
    'interview:answer',
    'Too many submissions. Slow down and try again.',
  );
  if (limited) return limited;

  try {
    const body = await request.json() as { question: string; answer: string; config: InterviewConfig };
    if (!body.question || !body.answer || body.answer.trim().length < 10 || body.answer.length > 8000) {
      return NextResponse.json({ error: 'Answer must be between 10 and 8,000 characters.' }, { status: 400 });
    }
    const feedback = await evaluateAnswer(body.question, body.answer, body.config);
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('answer evaluation error', error);
    return NextResponse.json({ error: 'Feedback is temporarily unavailable. Please retry.' }, { status: 500 });
  }
}
