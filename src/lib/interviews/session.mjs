import { interviewConfigError } from './validation.mjs';

function isStringList(candidate) {
  return Array.isArray(candidate) && candidate.every((item) => typeof item === 'string' && item.trim());
}

export function isAnswerFeedback(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return false;
  const feedback = /** @type {Record<string, unknown>} */ (candidate);
  return (
    typeof feedback.score === 'number' &&
    Number.isFinite(feedback.score) &&
    feedback.score >= 0 &&
    feedback.score <= 100 &&
    typeof feedback.summary === 'string' &&
    feedback.summary.trim().length > 0 &&
    isStringList(feedback.strengths) &&
    isStringList(feedback.improvements) &&
    typeof feedback.improvedAnswer === 'string' &&
    (feedback.followUpQuestion === undefined || typeof feedback.followUpQuestion === 'string')
  );
}

/**
 * Safely restore an interview session from browser storage.
 *
 * @param {string | null} raw
 * @param {string} expectedId
 * @returns {unknown | null}
 */
export function parseStoredInterviewSession(raw, expectedId) {
  if (!raw) return null;

  try {
    const candidate = JSON.parse(raw);
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;

    const session = /** @type {Record<string, unknown>} */ (candidate);
    if (session.id !== expectedId || interviewConfigError(session.config)) return null;
    if (!isStringList(session.questions) || session.questions.length > 10) return null;
    if (!Array.isArray(session.answers) || session.answers.length > session.questions.length) return null;

    const answersAreValid = session.answers.every((item) => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) return false;
      const answer = /** @type {Record<string, unknown>} */ (item);
      return (
        typeof answer.question === 'string' &&
        answer.question.trim().length > 0 &&
        typeof answer.answer === 'string' &&
        answer.answer.trim().length >= 10 &&
        isAnswerFeedback(answer.feedback)
      );
    });

    return answersAreValid ? candidate : null;
  } catch {
    return null;
  }
}

/**
 * Restore a session only when every interview question has a valid answer.
 *
 * @param {string | null} raw
 * @param {string} expectedId
 * @returns {unknown | null}
 */
export function parseCompletedInterviewSession(raw, expectedId) {
  const candidate = parseStoredInterviewSession(raw, expectedId);
  if (!candidate) return null;

  const session = /** @type {{ questions: unknown[]; answers: unknown[] }} */ (candidate);
  return session.answers.length > 0 && session.answers.length === session.questions.length ? candidate : null;
}

/**
 * Read and validate a session without letting blocked browser storage crash
 * the interview UI. Invalid entries are removed on a best-effort basis.
 *
 * @param {Storage} storage
 * @param {string} storageKey
 * @param {string} expectedId
 * @param {{ completed?: boolean }} [options]
 * @returns {unknown | null}
 */
export function loadInterviewSession(storage, storageKey, expectedId, { completed = false } = {}) {
  let raw;
  try {
    raw = storage.getItem(storageKey);
  } catch {
    return null;
  }

  const session = completed
    ? parseCompletedInterviewSession(raw, expectedId)
    : parseStoredInterviewSession(raw, expectedId);

  if (!session && raw) {
    try {
      storage.removeItem(storageKey);
    } catch {
      // Storage cleanup is optional; the invalid value remains unusable.
    }
  }

  return session;
}

/**
 * Persist a session and report failure so the UI can keep the current answer
 * visible instead of navigating away or crashing.
 *
 * @param {Storage} storage
 * @param {string} storageKey
 * @param {unknown} session
 * @returns {boolean}
 */
export function saveInterviewSession(storage, storageKey, session) {
  try {
    const serialized = JSON.stringify(session);
    if (typeof serialized !== 'string') return false;
    storage.setItem(storageKey, serialized);
    return true;
  } catch {
    return false;
  }
}
