/**
 * The security primitives. What is worth asserting here is not the return value — a plain
 * `===` gets those right too — but the properties that are the reason these exist: a
 * comparison that does not short-circuit, and a draw that is uniform and unpredictable.
 */
import { describe, it, expect } from 'vitest';
import { safeEqual, secureRandomString, secureToken, UNAMBIGUOUS_ALPHABET } from '@/utils/secure';

describe('safeEqual', () => {
  it('accepts identical strings and rejects different ones', () => {
    expect(safeEqual('sk-abc123', 'sk-abc123')).toBe(true);
    expect(safeEqual('sk-abc123', 'sk-abc124')).toBe(false);
  });

  it('compares bytes, so it works on digests as well as strings', () => {
    expect(safeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(safeEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
  });

  it('compares a string against its own UTF-8 bytes', () => {
    expect(safeEqual('héllo', new TextEncoder().encode('héllo'))).toBe(true);
  });

  it('rejects different lengths without pretending otherwise', () => {
    // Documented limit, asserted so nobody "fixes" it into padding the secret under test.
    expect(safeEqual('abc', 'abcd')).toBe(false);
  });

  it('does not stop at the first differing byte', () => {
    // The whole point: a compare that returns early leaks the shared prefix length through
    // timing. Timing itself is too noisy to assert, so this checks the observable proxy —
    // an early return would have to read fewer bytes, and a proxy counts the reads.
    let reads = 0;
    const counted = (bytes: number[]): Uint8Array =>
      new Proxy(new Uint8Array(bytes), {
        get(target, key) {
          if (typeof key === 'string' && /^\d+$/.test(key)) reads++;
          return Reflect.get(target, key);
        },
      }) as Uint8Array;

    const differsAtFirst = counted([9, 2, 3, 4, 5, 6, 7, 8]);
    safeEqual(differsAtFirst, new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(reads).toBe(8);
  });
});

describe('secureRandomString', () => {
  it('returns the requested length from the requested alphabet', () => {
    const value = secureRandomString(24, 'abc');
    expect(value).toHaveLength(24);
    expect(value).toMatch(/^[abc]+$/);
  });

  it('leaves out the characters people misread', () => {
    // The default alphabet exists so a pairing code can be read aloud or retyped.
    expect(UNAMBIGUOUS_ALPHABET).not.toMatch(/[01OIl]/);
    expect(secureRandomString(200)).toMatch(/^[A-Z2-9]+$/);
  });

  it('draws uniformly even when the alphabet does not divide 256', () => {
    // The alphabet length is chosen so the bias cannot hide in sampling noise. 256 = 2×100 + 56,
    // so a plain `byte % 100` gives the first 56 characters three chances per byte and the rest
    // only two — they would come up ~50% more often. Rejection sampling is what removes that,
    // and a 6-character alphabet (2.4% bias) is too gentle to notice if someone deletes it.
    const alphabet = Array.from({ length: 100 }, (_, i) => String.fromCharCode(33 + i)).join('');
    const counts = new Map<string, number>(Array.from(alphabet, (c) => [c, 0]));
    const draws = 100_000;
    for (const char of secureRandomString(draws, alphabet)) counts.set(char, counts.get(char)! + 1);

    const overRepresented = counts.get(alphabet[0]!)!;
    const underRepresented = counts.get(alphabet[99]!)!;
    // Under bias this ratio is ~1.5; sampling noise at 1000 expected draws is well under 15%.
    expect(overRepresented / underRepresented).toBeGreaterThan(0.85);
    expect(overRepresented / underRepresented).toBeLessThan(1.15);
  });

  it('draws more characters than one getRandomValues call may return', () => {
    // Web Crypto refuses more than 65,536 bytes per call. A buffer sized straight off the
    // requested length throws QuotaExceededError instead of returning a long value.
    expect(secureRandomString(70_000, 'ab')).toHaveLength(70_000);
  });

  it('does not repeat itself', () => {
    const seen = new Set(Array.from({ length: 200 }, () => secureRandomString(16)));
    expect(seen.size).toBe(200);
  });

  it('returns an empty string for a zero length', () => {
    expect(secureRandomString(0)).toBe('');
  });

  it('refuses inputs it cannot draw from', () => {
    expect(() => secureRandomString(-1)).toThrow(RangeError);
    expect(() => secureRandomString(4, 'a')).toThrow(RangeError);
    expect(() => secureRandomString(4, 'a'.repeat(300))).toThrow(RangeError);
  });
});

describe('secureToken', () => {
  it('returns two hex characters per byte', () => {
    expect(secureToken(16)).toMatch(/^[0-9a-f]{32}$/);
    expect(secureToken()).toHaveLength(64);
  });

  it('pads a byte that needs it', () => {
    // Array.from + toString(16) drops the leading zero of any byte below 0x10; without the
    // pad the token would occasionally be short, which breaks a fixed-width column.
    const tokens = Array.from({ length: 50 }, () => secureToken(8));
    for (const token of tokens) expect(token).toHaveLength(16);
  });

  it('refuses a non-positive size', () => {
    expect(() => secureToken(0)).toThrow(RangeError);
  });
});
