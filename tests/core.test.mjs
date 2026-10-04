import test from 'node:test';
import assert from 'node:assert/strict';
import {
  answerPayloadError,
  interviewConfigError,
} from '../src/lib/interviews/validation.mjs';

const validConfig = {
  type: 'technical',
  mode: 'written',
  jobRole: 'Software Engineer',
  experienceLevel: 'entry',
  questionCount: 5,
  difficulty: 'balanced',
  focusAreas: ['APIs', 'Testing'],
};

test('accepts a complete interview configuration', () => {
  assert.equal(interviewConfigError(validConfig), null);
});

test('rejects unsupported interview options', () => {
  for (const [field, value] of [
    ['type', 'salary'],
    ['mode', 'video'],
    ['experienceLevel', 'expert'],
    ['difficulty', 'impossible'],
    ['questionCount', 100],
  ]) {
    assert.equal(
      interviewConfigError({ ...validConfig, [field]: value }),
      'Invalid interview settings.',
    );
  }
});

test('enforces job-role boundaries', () => {
  assert.equal(interviewConfigError({ ...validConfig, jobRole: ' ' }), 'Invalid interview settings.');
  assert.equal(interviewConfigError({ ...validConfig, jobRole: 'x'.repeat(121) }), 'Invalid interview settings.');
});

test('enforces focus-area count and item boundaries', () => {
  assert.equal(
    interviewConfigError({ ...validConfig, focusAreas: Array(11).fill('Testing') }),
    'Focus areas must be a list of up to 10 items.',
  );
  assert.equal(
    interviewConfigError({ ...validConfig, focusAreas: [''] }),
    'Each focus area must be between 1 and 80 characters.',
  );
  assert.equal(
    interviewConfigError({ ...validConfig, focusAreas: ['x'.repeat(81)] }),
    'Each focus area must be between 1 and 80 characters.',
  );
});

test('accepts a complete answer payload', () => {
  assert.equal(
    answerPayloadError({ question: 'How do you test an API?', answer: 'I use layered automated tests.', config: validConfig }),
    null,
  );
});

test('enforces question and answer boundaries', () => {
  assert.equal(
    answerPayloadError({ question: '', answer: 'A sufficiently long answer.', config: validConfig }),
    'Question must be between 1 and 2,000 characters.',
  );
  assert.equal(
    answerPayloadError({ question: 'Question?', answer: 'short', config: validConfig }),
    'Answer must be between 10 and 8,000 characters.',
  );
  assert.equal(
    answerPayloadError({ question: 'x'.repeat(2_001), answer: 'A sufficiently long answer.', config: validConfig }),
    'Question must be between 1 and 2,000 characters.',
  );
});

test('answer validation also validates nested interview settings', () => {
  assert.equal(
    answerPayloadError({
      question: 'Question?',
      answer: 'A sufficiently long answer.',
      config: { ...validConfig, difficulty: 'extreme' },
    }),
    'Invalid interview settings.',
  );
});
