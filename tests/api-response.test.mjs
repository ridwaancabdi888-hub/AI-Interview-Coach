import test from 'node:test';
import assert from 'node:assert/strict';
import {
  readInterviewFeedbackResponse,
  readInterviewStartResponse,
} from '../src/lib/interviews/api-response.mjs';

const validFeedback = {
  score: 84,
  summary: 'A focused answer with a concrete example.',
  strengths: ['Clear context'],
  improvements: ['Quantify the outcome'],
  improvedAnswer: 'A stronger version of the answer.',
};

function response({ ok = true, payload, jsonError }) {
  return {
    ok,
    async json() {
      if (jsonError) throw jsonError;
      return payload;
    },
  };
}

test('accepts valid start and feedback responses', async () => {
  const started = await readInterviewStartResponse(
    response({ payload: { id: 'interview-123', questions: ['Tell me about a project.'] } }),
    'Unable to start interview',
  );
  const evaluated = await readInterviewFeedbackResponse(
    response({ payload: { feedback: validFeedback } }),
    'Unable to evaluate answer',
  );

  assert.equal(started.id, 'interview-123');
  assert.deepEqual(evaluated.feedback, validFeedback);
});

test('preserves a useful JSON error returned by the server', async () => {
  await assert.rejects(
    readInterviewStartResponse(
      response({ ok: false, payload: { error: 'Too many interview requests. Try again shortly.' } }),
      'Unable to start interview',
    ),
    /Too many interview requests/,
  );
});

test('uses the fallback for non-JSON and empty server errors', async () => {
  await assert.rejects(
    readInterviewFeedbackResponse(
      response({ ok: false, jsonError: new SyntaxError('Unexpected end of JSON input') }),
      'Unable to evaluate answer',
    ),
    /Unable to evaluate answer/,
  );
  await assert.rejects(
    readInterviewFeedbackResponse(response({ ok: false, payload: { error: '   ' } }), 'Unable to evaluate answer'),
    /Unable to evaluate answer/,
  );
});

test('rejects malformed successful responses before they reach UI state', async () => {
  await assert.rejects(
    readInterviewStartResponse(response({ payload: { id: '', questions: [] } }), 'Unable to start interview'),
    /Unable to start interview/,
  );
  await assert.rejects(
    readInterviewFeedbackResponse(
      response({ payload: { feedback: { ...validFeedback, score: 140 } } }),
      'Unable to evaluate answer',
    ),
    /Unable to evaluate answer/,
  );
});
