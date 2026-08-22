/**
 * The security primitives. What is worth asserting here is not the return value — a plain
 * `===` gets those right too — but the properties that are the reason these exist: a
 * comparison that does not short-circuit, and a draw that is uniform and unpredictable.
 */
import { describe, it, expect, vi } from 'vitest';
import { safeEqual, secureRandomString, secureToken, UNAMBIGUOUS_ALPHABET } from '@/utils/secure';

/**
 * Runs `draw` against a scripted byte sequence instead of the CSPRNG, repeating the sequence if
 * the draw asks for more. What these functions promise is a mapping from bytes to output, so
 * supplying the bytes turns each promise into an equation. Sampling the real CSPRNG could only
 * ever estimate the same thing, and an estimate tight enough to catch the bias also fails on
 * chance every few thousand runs.
 */
const withBytes = <T>(bytes: readonly number[], draw: () => T): T => {
  let cursor = 0;
  const spy = vi
    .spyOn(globalThis.crypto, 'getRandomValues')
    .mockImplementation(<A extends ArrayBufferView | null>(array: A): A => {
      if (array) {
        const view = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        for (let i = 0; i < view.length; i++) view[i] = bytes[cursor++ % bytes.length]!;
      }
      return array;
    });
  try {
    return draw();
  } finally {
    spy.mockRestore();
  }
};

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

  // A 100-character alphabet is what makes the two halves of uniformity separable: 256 = 2×100 + 56,
  // so bytes 0..199 are the ones that divide evenly and 200..255 are the remainder a plain
  // `byte % 100` would fold back onto the first 56 characters, handing them three chances per
  // byte against everyone else's two.
  const ALPHABET = Array.from({ length: 100 }, (_, i) => String.fromCharCode(33 + i)).join('');

  it('spends the evenly dividing bytes equally across the alphabet', () => {
    const drawn = withBytes(
      Array.from({ length: 200 }, (_, i) => i),
      () => secureRandomString(200, ALPHABET),
    );
    const counts = new Map<string, number>(Array.from(ALPHABET, (c) => [c, 0]));
    for (const char of drawn) counts.set(char, counts.get(char)! + 1);
    expect([...new Set(counts.values())]).toEqual([2]);
  });

  it('discards the leftover bytes rather than folding them onto the first characters', () => {
    // The other half of uniformity, and the half a distribution check reports only as noise.
    // 200 and 255 are above the ceiling and must produce nothing; the draw is satisfied by the
    // two bytes below it, so anything else in the result came from a fold.
    expect(withBytes([200, 255, 0, 99], () => secureRandomString(2, ALPHABET))).toBe(`${ALPHABET[0]}${ALPHABET[99]}`);
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
    // pad the token would be short, which breaks a fixed-width column. Scripted rather than
    // sampled so the byte that needs the pad is present by construction.
    expect(withBytes([0x00, 0x0f, 0x10, 0xff], () => secureToken(4))).toBe('000f10ff');
  });

  it('refuses a non-positive size', () => {
    expect(() => secureToken(0)).toThrow(RangeError);
  });
});
