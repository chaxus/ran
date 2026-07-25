/**
 * Coordinate maths and range splitting over a "chunk sequence + global offset" model
 * (pure functions, no DOM, easy to test).
 *
 * The use case: content is cut into chunks (pagination, sharding, a virtual list, log
 * segments) while annotations / highlights / search hits are recorded as **offsets into
 * the concatenated whole**. Storing an annotation in global coordinates rather than as
 * "chunk N, character M" keeps it valid after re-chunking (a different font size, page
 * width or shard size).
 */

/**
 * @description: The global start offset of every chunk in the concatenated coordinate
 * space (a prefix sum). `offsets[i]` = the summed length of the first `i` chunks.
 * @param {readonly number[]} lengths length of each chunk
 * @return {number[]} offset array, same length as the input
 * @example
 * ```ts
 * buildOffsets([3, 5, 2]); // [0, 3, 8]
 * buildOffsets(pages.map((p) => p.text.length));
 * ```
 */
export const buildOffsets = (lengths: readonly number[]): number[] => {
  const offsets: number[] = Array.from({ length: lengths.length });
  let acc = 0;
  for (let i = 0; i < lengths.length; i++) {
    offsets[i] = acc;
    acc += lengths[i] || 0;
  }
  return offsets;
};

/**
 * @description: Binary-search which chunk a global offset falls into — the last index
 * satisfying `offsets[i] <= offset`. Out-of-range values are clamped to
 * `[0, offsets.length - 1]` and an empty array returns 0, so the result is always safe to
 * index with.
 * @param {readonly number[]} offsets the result of buildOffsets (must be non-decreasing)
 * @param {number} offset global offset
 * @return {number} chunk index
 */
export const indexForOffset = (offsets: readonly number[], offset: number): number => {
  if (offsets.length === 0) return 0;
  let lo = 0;
  let hi = offsets.length - 1;
  let ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (offsets[mid] <= offset) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
};

/** An annotation in global coordinates: the half-open interval `[start, end)` plus any payload */
export interface OffsetRange<T> {
  start: number;
  end: number;
  value: T;
}

/** One piece of the split result: `value === null` marks a plain span covered by no range */
export interface Segment<T> {
  text: string;
  /** Start in global coordinates (= chunkStart + the offset inside the chunk) */
  start: number;
  end: number;
  value: T | null;
}

/**
 * @description: Split one chunk of text into a sequence of plain / matched spans according
 * to the ranges falling inside it, ready for span-by-span rendering (highlights,
 * underlines, search hits, diff colouring).
 *
 * Ranges are sorted by start and consumed monotonically: on overlap the later range only
 * takes its non-overlapping tail, and a fully swallowed range is skipped — so cut points
 * strictly increase and no negative-length or duplicated text is produced. Ranges are not
 * merged (personal annotations rarely overlap).
 *
 * @param {string} text this chunk's text
 * @param {number} chunkStart this chunk's start offset in global coordinates (from buildOffsets)
 * @param {readonly OffsetRange<T>[]} ranges ranges in global coordinates, may include unrelated items
 * @return {Segment<T>[]} spans that concatenate back to `text`; always at least one
 */
export const segmentByRanges = <T>(
  text: string,
  chunkStart: number,
  ranges: readonly OffsetRange<T>[],
): Segment<T>[] => {
  const chunkEnd = chunkStart + text.length;
  const local = ranges
    .map((r) => ({
      value: r.value,
      s: Math.max(r.start, chunkStart) - chunkStart,
      e: Math.min(r.end, chunkEnd) - chunkStart,
    }))
    .filter((r) => r.e > r.s)
    .sort((a, b) => a.s - b.s || a.e - b.e);

  const segments: Segment<T>[] = [];
  const push = (from: number, to: number, value: T | null): void => {
    segments.push({ text: text.slice(from, to), start: chunkStart + from, end: chunkStart + to, value });
  };

  let cursor = 0;
  for (const range of local) {
    let s = range.s;
    if (s < cursor) {
      if (range.e <= cursor) continue; // fully swallowed by the previous span
      s = cursor; // take only the non-overlapping tail
    }
    if (s > cursor) push(cursor, s, null);
    push(s, range.e, range.value);
    cursor = range.e;
  }
  if (cursor < text.length) push(cursor, text.length, null);
  if (segments.length === 0) push(0, text.length, null);
  return segments;
};
