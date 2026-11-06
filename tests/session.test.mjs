import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadInterviewSession,
  parseCompletedInterviewSession,
  parseStoredInterviewSession,
  saveInterviewSession,
} from '../src/lib/interviews/session.mjs';

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

test('restores a report only after every question has been answered', () => {
  const completed = {
    ...session,
    answers: session.questions.map((question) => ({
      question,
      answer: `A complete answer for ${question}`,
      feedback,
    })),
  };

  assert.deepEqual(parseCompletedInterviewSession(JSON.stringify(completed), session.id), completed);
  assert.equal(parseCompletedInterviewSession(JSON.stringify(session), session.id), null);
  assert.equal(
    parseCompletedInterviewSession(JSON.stringify({ ...completed, answers: completed.answers.slice(0, 1) }), session.id),
    null,
  );
});

test('rejects corrupt or mismatched completed-report storage', () => {
  const completed = {
    ...session,
    answers: session.questions.map((question) => ({ question, answer: 'A complete and valid answer.', feedback })),
  };

  assert.equal(parseCompletedInterviewSession('{broken', session.id), null);
  assert.equal(parseCompletedInterviewSession(JSON.stringify(completed), 'different-session'), null);
  assert.equal(
    parseCompletedInterviewSession(
      JSON.stringify({
        ...completed,
        answers: [{ ...completed.answers[0], feedback: { ...feedback, score: 101 } }, completed.answers[1]],
      }),
      session.id,
    ),
    null,
  );
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
  assert.equal(
    parseStoredInterviewSession(
      JSON.stringify({
        ...session,
        answers: [{
          question: 'Question?',
          answer: 'A sufficiently complete answer.',
          feedback: { ...feedback, followUpQuestion: 42 },
        }],
      }),
      session.id,
    ),
    null,
  );
});

test('saves and loads a validated interview through browser storage', () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };

  assert.equal(saveInterviewSession(storage, 'interview:session-123', session), true);
  assert.deepEqual(loadInterviewSession(storage, 'interview:session-123', session.id), session);
});

test('reports blocked or unserializable session writes without throwing', () => {
  const blockedStorage = { setItem: () => { throw new Error('Quota exceeded'); } };
  const circular = {};
  circular.self = circular;

  assert.equal(saveInterviewSession(blockedStorage, 'interview:blocked', session), false);
  assert.equal(saveInterviewSession({ setItem: () => {} }, 'interview:circular', circular), false);
});

test('handles blocked reads and best-effort cleanup of invalid sessions', () => {
  const blockedStorage = { getItem: () => { throw new Error('Storage blocked'); } };
  let removalAttempts = 0;
  const invalidStorage = {
    getItem: () => '{broken',
    removeItem: () => { removalAttempts += 1; throw new Error('Cleanup blocked'); },
  };

  assert.equal(loadInterviewSession(blockedStorage, 'interview:blocked', session.id), null);
  assert.equal(loadInterviewSession(invalidStorage, 'interview:broken', session.id), null);
  assert.equal(removalAttempts, 1);
});

test('loads completed sessions only when every answer is present', () => {
  const completed = {
    ...session,
    answers: session.questions.map((question) => ({ question, answer: 'A complete and valid answer.', feedback })),
  };
  const storage = { getItem: () => JSON.stringify(completed) };

  assert.deepEqual(
    loadInterviewSession(storage, 'interview:session-123', session.id, { completed: true }),
    completed,
  );
});
