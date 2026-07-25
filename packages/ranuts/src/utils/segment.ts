/**
 * 「块序列 + 全局偏移」的坐标换算与区间切分（纯函数，无 DOM，易测）。
 *
 * 适用场景：内容被切成若干块（分页、分片、虚拟列表、日志分段），而标注/高亮/搜索命中
 * 记录的是**拼接后的全局偏移**。把标注存在全局坐标系里而不是「第 N 块第 M 个字」，
 * 重新切块（换字号、改页宽、变分片大小）后标注仍然有效。
 */

/**
 * @description: 每块在拼接坐标系里的全局起始偏移（前缀和）。offsets[i] = 前 i 块长度之和。
 * @param {readonly number[]} lengths 每块的长度
 * @return {number[]} 与入参等长的偏移数组
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
 * @description: 二分查找全局偏移落在第几块——最后一个满足 `offsets[i] <= offset` 的下标。
 * 越界会夹取到 `[0, offsets.length - 1]`，空数组返回 0，故返回值总是可安全索引的。
 * @param {readonly number[]} offsets buildOffsets 的结果（必须非递减）
 * @param {number} offset 全局偏移
 * @return {number} 块下标
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

/** 全局坐标系里的一段标注：`[start, end)` 半开区间 + 任意携带值 */
export interface OffsetRange<T> {
  start: number;
  end: number;
  value: T;
}

/** 切分结果的一段：`value` 为 null 表示没被任何区间覆盖的普通段 */
export interface Segment<T> {
  text: string;
  /** 在全局坐标系里的起点（= chunkStart + 段内偏移） */
  start: number;
  end: number;
  value: T | null;
}

/**
 * @description: 把一块文本按落在其范围内的区间切成「普通段 / 命中段」序列，供分段渲染
 * （高亮划线、标记搜索命中、diff 上色）。
 *
 * 区间按起点排序后单调消费：重叠时后者只接非重叠的尾巴，被完全吞没的直接跳过——
 * 保证切点严格递增、不产生负长度或重复文本。不做区间合并（个人标注极少重叠）。
 *
 * @param {string} text 本块文本
 * @param {number} chunkStart 本块在全局坐标系里的起始偏移（buildOffsets 的结果）
 * @param {readonly OffsetRange<T>[]} ranges 全局坐标系里的区间，可含与本块无关的项
 * @return {Segment<T>[]} 顺序拼接等于 `text`，至少一段
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
      if (range.e <= cursor) continue; // 完全被前一段吞没
      s = cursor; // 只接非重叠尾巴
    }
    if (s > cursor) push(cursor, s, null);
    push(s, range.e, range.value);
    cursor = range.e;
  }
  if (cursor < text.length) push(cursor, text.length, null);
  if (segments.length === 0) push(0, text.length, null);
  return segments;
};
