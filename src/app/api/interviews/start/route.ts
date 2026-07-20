import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/ai/openai';
import { rateLimit } from '@/lib/rate-limit/memory';
import type { InterviewConfig } from '@/lib/interviews/types';

const fallbackQuestions: Record<InterviewConfig['type'], string[]> = {
  technical: [
    'Tell me about a technical project you are proud of and the decisions you made.',
    'How would you investigate and fix a production bug?',
    'How do you improve the performance of a web application?',
    'How do you keep code secure, maintainable, and easy to test?',
    'Describe how you would design a feature for many concurrent users.',
  ],
  behavioral: [
    'Tell me about a difficult challenge and how you handled it.',
    'Describe a disagreement with a teammate and how you resolved it.',
    'Tell me about a mistake you made and what you learned.',
    'Give an example of a time you demonstrated leadership.',
    'Describe a time priorities changed suddenly and what you did.',
  ],
  general: [
    'Tell me about yourself and why this role interests you.',
    'What are your strongest professional qualities?',
    'What skill are you currently improving?',
    'Why should an employer choose you?',
    'Where would you like your career to grow in the next three years?',
  ],
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'local';
  const limit = rateLimit(`start:${ip}`, 8, 60_000);
  if (!limit.allowed) return NextResponse.json({ error: 'Too many interview requests. Try again shortly.' }, { status: 429 });

  try {
    const config = await request.json() as InterviewConfig;
    if (!['technical', 'behavioral', 'general'].includes(config.type) || !['written', 'voice'].includes(config.mode) || !config.jobRole?.trim() || ![5, 8, 10].includes(config.questionCount)) {
      return NextResponse.json({ error: 'Invalid interview settings.' }, { status: 400 });
    }

    let questions: string[];
    let usingFallback = false;

    try {
      questions = await generateQuestions(config);
    } catch (error) {
      console.error('AI question generation failed; using fallback questions', error);
      usingFallback = true;
      const base = fallbackQuestions[config.type];
      questions = Array.from({ length: config.questionCount }, (_, index) => base[index % base.length]);
    }

    return NextResponse.json({
      id: crypto.randomUUID(),
      questions,
      createdAt: new Date().toISOString(),
      usingFallback,
    });
  } catch (error) {
    console.error('start interview error', error);
    return NextResponse.json({ error: 'The interview settings could not be processed. Please check the fields and retry.' }, { status: 500 });
  }
}
