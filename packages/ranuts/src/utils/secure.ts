/**
 * Primitives whose correctness depends on *how* they compute, not just what they return:
 * comparisons that must not leak their answer through timing, and randomness that must not
 * be predictable.
 *
 * Kept apart from `str.ts` deliberately. `randomString` and `getRandomString` there are
 * `Math.random()` based — fine for a DOM id or a message correlation key, unsafe for anything
 * an attacker would want to guess. Someone reaching for a token generator should land here.
 *
 * Uses the Web Crypto global, which exists in browsers, Node >= 19, Deno, Workers and
 * service workers alike.
 */

/** The subset of Web Crypto used here, resolved at call time so a missing global is a clear error. */
const webCrypto = (): Crypto => {
  const value = (globalThis as { crypto?: Crypto }).crypto;
  if (!value?.getRandomValues) {
    throw new Error('ranuts/secure: Web Crypto is unavailable (needs a browser, Node >= 19, Deno or a Worker)');
  }
  return value;
};

/**
 * @description: Compare two secrets in time that does not depend on where they first differ.
 *
 * A plain `a === b` returns as soon as it finds a mismatch, so the time it takes reveals how
 * long a shared prefix was — enough to recover a token one character at a time across many
 * requests. Use this whenever one side of the comparison is attacker-supplied: access keys,
 * session tokens, HMAC digests, pairing codes.
 *
 * **It hides the contents, not the length.** Inputs of different lengths return `false`
 * immediately, because comparing to a fixed length would either truncate or pad the very data
 * under test. Length is rarely the secret; when it is, compare fixed-width digests instead.
 *
 * @param {string | Uint8Array} a
 * @param {string | Uint8Array} b
 * @return {boolean} whether the two are byte-for-byte equal
 */
export const safeEqual = (a: string | Uint8Array, b: string | Uint8Array): boolean => {
  const encoder = new TextEncoder();
  const left = typeof a === 'string' ? encoder.encode(a) : a;
  const right = typeof b === 'string' ? encoder.encode(b) : b;
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i]! ^ right[i]!;
  return diff === 0;
};

/** Unambiguous by design: no `0`/`O`, no `1`/`l`/`I`. For codes a human reads aloud or retypes. */
export const UNAMBIGUOUS_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * @description: A random string drawn from `alphabet` using the platform CSPRNG.
 *
 * Unlike `randomString` / `getRandomString` in `str.ts`, this is safe for values an attacker
 * must not be able to predict: device-pairing codes, one-time tokens, invite links.
 *
 * The draw is rejection-sampled, so every character is uniform no matter what the alphabet
 * length is. A plain `byte % alphabet.length` is biased toward the first
 * `256 % alphabet.length` characters — small enough to ignore for a short-lived,
 * rate-limited code, and not small enough to reason about again every time someone reuses
 * this for something longer-lived.
 *
 * @param {number} length how many characters to draw
 * @param {string} alphabet characters to draw from; defaults to an unambiguous set
 * @return {string}
 */
export const secureRandomString = (length: number, alphabet: string = UNAMBIGUOUS_ALPHABET): string => {
  if (!Number.isInteger(length) || length < 0)
    throw new RangeError('secureRandomString: length must be a whole number');
  if (alphabet.length < 2) throw new RangeError('secureRandomString: alphabet needs at least two characters');
  if (alphabet.length > 256) throw new RangeError('secureRandomString: alphabet must fit in one byte');
  if (length === 0) return '';

  const crypto = webCrypto();
  // The largest multiple of the alphabet that fits in a byte; draws at or above it are
  // rejected, which is what keeps the distribution uniform.
  const ceiling = Math.floor(256 / alphabet.length) * alphabet.length;
  let out = '';
  // Over-draw a little so the common case needs one call even with a few rejections, but stay
  // under the 65,536-byte ceiling `getRandomValues` enforces per call — a buffer sized off an
  // unbounded `length` throws QuotaExceededError on any long draw.
  const DRAW_LIMIT = 4096;
  const buffer = new Uint8Array(Math.min(Math.max(length, 16), DRAW_LIMIT));
  let cursor = buffer.length;

  while (out.length < length) {
    if (cursor >= buffer.length) {
      crypto.getRandomValues(buffer);
      cursor = 0;
    }
    const byte = buffer[cursor++]!;
    if (byte < ceiling) out += alphabet[byte % alphabet.length];
  }
  return out;
};

/**
 * @description: A random hex token of `bytes` bytes, from the platform CSPRNG.
 *
 * The default of 32 bytes is 256 bits — the usual floor for a bearer token that is not
 * expected to expire soon.
 *
 * @param {number} bytes how many random bytes to draw
 * @return {string} lowercase hex, twice as long as `bytes`
 */
export const secureToken = (bytes: number = 32): string => {
  if (!Number.isInteger(bytes) || bytes < 1) throw new RangeError('secureToken: bytes must be a positive whole number');
  const data = new Uint8Array(bytes);
  webCrypto().getRandomValues(data);
  return Array.from(data, (byte) => byte.toString(16).padStart(2, '0')).join('');
};
