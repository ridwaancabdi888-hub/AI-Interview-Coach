import { isAnswerFeedback } from './session.mjs';

function isRecord(candidate) {
  return Boolean(candidate) && typeof candidate === 'object' && !Array.isArray(candidate);
}

function isStringList(candidate) {
  return Array.isArray(candidate) && candidate.every((item) => typeof item === 'string' && item.trim());
}

async function readJsonObject(response, fallbackMessage) {
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(fallbackMessage);
  }

  if (!isRecord(payload)) throw new Error(fallbackMessage);

  const data = /** @type {Record<string, unknown>} */ (payload);
  if (!response.ok) {
    const serverMessage = typeof data.error === 'string' ? data.error.trim() : '';
    throw new Error(serverMessage || fallbackMessage);
  }

  return data;
}

/**
 * Read and validate the successful response from the interview start endpoint.
 *
 * @param {{ ok: boolean, json: () => Promise<unknown> }} response
 * @param {string} fallbackMessage
 */
export async function readInterviewStartResponse(response, fallbackMessage) {
  const data = await readJsonObject(response, fallbackMessage);
  if (
    typeof data.id !== 'string' ||
    !data.id.trim() ||
    !isStringList(data.questions) ||
    data.questions.length === 0 ||
    data.questions.length > 10
  ) {
    throw new Error(fallbackMessage);
  }

  return data;
}

/**
 * Read and validate the successful response from the answer endpoint.
 *
 * @param {{ ok: boolean, json: () => Promise<unknown> }} response
 * @param {string} fallbackMessage
 */
export async function readInterviewFeedbackResponse(response, fallbackMessage) {
  const data = await readJsonObject(response, fallbackMessage);
  if (!isAnswerFeedback(data.feedback)) throw new Error(fallbackMessage);
  return data;
}
