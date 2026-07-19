import type { AnswerFeedback, InterviewConfig } from '@/lib/interviews/types';

const fallbackQuestions: Record<string, string[]> = {
  technical: [
    'Explain a recent technical project and the architecture decisions you made.',
    'How do you debug a production issue that you cannot reproduce locally?',
    'Describe how you would improve the performance and reliability of a web application.',
    'How do you balance delivery speed with code quality and security?',
    'Walk me through how you would design a scalable feature for many concurrent users.',
  ],
  behavioral: [
    'Tell me about a time you handled a difficult challenge.',
    'Describe a disagreement with a teammate and how you resolved it.',
    'Give an example of a mistake you made and what you learned.',
    'Tell me about a time you demonstrated leadership without formal authority.',
    'Describe a situation where priorities changed suddenly.',
  ],
  general: [
    'Tell me about yourself and why this role interests you.',
    'What are your greatest professional strengths?',
    'What is one area you are actively improving?',
    'Why should we choose you for this opportunity?',
    'Where do you hope to grow over the next three years?',
  ],
};

async function callOpenAI(messages: Array<{ role: 'system' | 'user'; content: string }>) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', messages, response_format: { type: 'json_object' }, temperature: 0.6 }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`AI service returned ${response.status}`);
  const data = await response.json();
  return JSON.parse(data.choices?.[0]?.message?.content || '{}');
}

export async function generateQuestions(config: InterviewConfig): Promise<string[]> {
  const result = await callOpenAI([
    { role: 'system', content: 'You are a professional interview coach. Return strict JSON with a questions array only.' },
    { role: 'user', content: `Create ${config.questionCount} ${config.difficulty} ${config.type} interview questions for a ${config.experienceLevel} ${config.jobRole}. Focus areas: ${config.focusAreas.join(', ') || 'balanced fundamentals'}. Avoid duplicates.` },
  ]);
  if (Array.isArray(result?.questions) && result.questions.length) return result.questions.slice(0, config.questionCount);
  const base = fallbackQuestions[config.type] || fallbackQuestions.general;
  return Array.from({ length: config.questionCount }, (_, index) => base[index % base.length]);
}

export async function evaluateAnswer(question: string, answer: string, config: InterviewConfig): Promise<AnswerFeedback> {
  const result = await callOpenAI([
    { role: 'system', content: 'Evaluate interview answers fairly. Return strict JSON: score 0-100, summary, strengths array, improvements array, improvedAnswer, optional followUpQuestion.' },
    { role: 'user', content: `Role: ${config.jobRole}. Level: ${config.experienceLevel}. Type: ${config.type}. Question: ${question}\nAnswer: ${answer}` },
  ]);
  if (result?.score !== undefined) return {
    score: Math.max(0, Math.min(100, Number(result.score))),
    summary: String(result.summary || ''),
    strengths: Array.isArray(result.strengths) ? result.strengths.map(String) : [],
    improvements: Array.isArray(result.improvements) ? result.improvements.map(String) : [],
    improvedAnswer: String(result.improvedAnswer || answer),
    followUpQuestion: result.followUpQuestion ? String(result.followUpQuestion) : undefined,
  };
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const score = Math.max(40, Math.min(88, 42 + Math.round(words * 0.55)));
  return {
    score,
    summary: words < 40 ? 'Your answer has a clear starting point but needs more evidence and structure.' : 'Your answer communicates relevant experience with a useful level of detail.',
    strengths: ['Directly addresses the question', 'Uses clear and understandable language'],
    improvements: words < 40 ? ['Add a specific example', 'Explain your actions and measurable result'] : ['Make the result more measurable', 'Tighten the opening sentence'],
    improvedAnswer: answer,
    followUpQuestion: config.type === 'behavioral' ? 'What measurable result came from your actions?' : undefined,
  };
}
