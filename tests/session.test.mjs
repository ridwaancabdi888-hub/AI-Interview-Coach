import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStoredInterviewSession } from '../src/lib/interviews/session.mjs';

const config = {
  type: 'technical',
  mode: 'written',
  jobRole: 'Software Engineer',
  experienceLevel: 'entry',
  questionCount: 5,
  difficulty: 'balanced',
  focusAreas: ['Testing'],
};

const feedback = {
  score: 82,
  summary: 'A clear answer with a useful example.',
  strengths: ['Specific example'],
  improvements: ['Quantify the result'],
  improvedAnswer: 'An improved interview answer.',
};

const session = {
  id: 'session-123',
  questions: ['Tell me about a project.', 'How do you test your work?'],
  config,
  answers: [],
};

test('restores a valid active interview session', () => {
  assert.deepEqual(parseStoredInterviewSession(JSON.stringify(session), session.id), session);
});

test('restores a valid completed answer', () => {
  const completed = {
    ...session,
    answers: [{ question: session.questions[0], answer: 'I built and tested a booking platform.', feedback }],
  };
  assert.deepEqual(parseStoredInterviewSession(JSON.stringify(completed), session.id), completed);
});

test('rejects invalid JSON and a session stored under the wrong id', () => {
  assert.equal(parseStoredInterviewSession('{broken', session.id), null);
  assert.equal(parseStoredInterviewSession(JSON.stringify(session), 'different-session'), null);
});

test('rejects malformed questions and interview configuration', () => {
  assert.equal(parseStoredInterviewSession(JSON.stringify({ ...session, questions: [''] }), session.id), null);
  assert.equal(
    parseStoredInterviewSession(JSON.stringify({ ...session, config: { ...config, mode: 'video' } }), session.id),
    null,
  );
});

test('rejects malformed or impossible answer history', () => {
  const tooManyAnswers = Array(3).fill({ question: 'Question?', answer: 'A complete answer.', feedback });
  assert.equal(parseStoredInterviewSession(JSON.stringify({ ...session, answers: tooManyAnswers }), session.id), null);
  assert.equal(
    parseStoredInterviewSession(
      JSON.stringify({ ...session, answers: [{ question: 'Question?', answer: 'short', feedback }] }),
      session.id,
    ),
    null,
  );
});
