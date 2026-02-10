/**
 * Minimal fetch helpers used across the app.
 *
 * Goals:
 * - Keep pages small and readable.
 * - Standardize error handling (JSON message when possible, otherwise text).
 * - Keep behavior close to raw fetch to match exam constraints.
 */

/**
 * @param {Response} res
 * @returns {Promise<any>}
 */
async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Reads error message from the response.
 * - If response is JSON, tries to extract `message`, otherwise stringifies the JSON.
 * - If not JSON, returns response text.
 *
 * @param {Response} res
 * @returns {Promise<string>}
 */
export async function readErrorMessage(res) {
  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await parseJsonSafe(res);
    if (!data) return `HTTP ${res.status}`;
    return data?.message || JSON.stringify(data) || `HTTP ${res.status}`;
  }

  const text = await res.text().catch(() => "");
  return text || `HTTP ${res.status}`;
}

/**
 * Fetches JSON and throws a readable Error when the response is not OK.
 *
 * @template T
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<T>}
 */
export async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const message = await readErrorMessage(res);
    throw new Error(message);
  }
  return /** @type {Promise<T>} */ (res.json());
}

/**
 * Like fetchJson, but returns null when request is aborted.
 * Useful in effects where AbortController cancels in-flight requests.
 *
 * @template T
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<T | null>}
 */
export async function fetchJsonOrNullOnAbort(url, options) {
  try {
    return await fetchJson(url, options);
  } catch (e) {
    if (e?.name === "AbortError") return null;
    throw e;
  }
}
