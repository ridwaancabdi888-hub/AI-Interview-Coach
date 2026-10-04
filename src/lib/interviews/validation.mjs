const interviewTypes = new Set(['technical', 'behavioral', 'general']);
const interviewModes = new Set(['written', 'voice']);
const experienceLevels = new Set(['student', 'entry', 'mid', 'senior']);
const difficulties = new Set(['easy', 'balanced', 'challenging']);
const questionCounts = new Set([5, 8, 10]);

/**
 * Return a user-facing error when interview configuration is malformed.
 * Keeping this validation independent from the route makes it reusable by
 * every endpoint that accepts an InterviewConfig.
 *
 * @param {unknown} candidate
 * @returns {string | null}
 */
export function interviewConfigError(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return 'Invalid interview settings.';
  }

  const config = /** @type {Record<string, unknown>} */ (candidate);
  const jobRole = typeof config.jobRole === 'string' ? config.jobRole.trim() : '';
  if (
    !interviewTypes.has(config.type) ||
    !interviewModes.has(config.mode) ||
    !experienceLevels.has(config.experienceLevel) ||
    !difficulties.has(config.difficulty) ||
    !questionCounts.has(config.questionCount) ||
    jobRole.length < 2 ||
    jobRole.length > 120
  ) {
    return 'Invalid interview settings.';
  }

  if (!Array.isArray(config.focusAreas) || config.focusAreas.length > 10) {
    return 'Focus areas must be a list of up to 10 items.';
  }
  if (
    config.focusAreas.some(
      (area) => typeof area !== 'string' || area.trim().length === 0 || area.trim().length > 80,
    )
  ) {
    return 'Each focus area must be between 1 and 80 characters.';
  }

  return null;
}

/**
 * Validate the complete answer-evaluation payload before it reaches the AI.
 *
 * @param {unknown} candidate
 * @returns {string | null}
 */
export function answerPayloadError(candidate) {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
    return 'Invalid answer submission.';
  }

  const body = /** @type {Record<string, unknown>} */ (candidate);
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const answer = typeof body.answer === 'string' ? body.answer.trim() : '';

  if (question.length < 1 || question.length > 2_000) {
    return 'Question must be between 1 and 2,000 characters.';
  }
  if (answer.length < 10 || answer.length > 8_000) {
    return 'Answer must be between 10 and 8,000 characters.';
  }

  return interviewConfigError(body.config);
}
