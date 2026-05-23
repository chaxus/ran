import { describe, expect, it } from 'vitest';
import { normalizeProgress, getBufferedPercentage } from '@/components/player/core/progress';

const makeBuffered = (ranges: Array<[number, number]>): TimeRanges => {
  return {
    length: ranges.length,
    start: (i: number) => ranges[i][0],
    end: (i: number) => ranges[i][1],
  } as TimeRanges;
};

const makeVideo = (currentTime: number, buffered: TimeRanges, duration: number): HTMLVideoElement => {
  return { currentTime, buffered, duration } as unknown as HTMLVideoElement;
};

describe('player/core/progress', () => {
  it('normalizeProgress clamps values', () => {
    expect(normalizeProgress(0)).toBe(0);
    expect(normalizeProgress(1)).toBe(1);
    expect(normalizeProgress(0.5)).toBe(0.5);
  });

  it('getBufferedPercentage returns 0 when duration is 0', () => {
    const video = makeVideo(5, makeBuffered([[0, 10]]), 0);
    expect(getBufferedPercentage(video, 0)).toBe(0);
  });

  it('getBufferedPercentage returns 0 when duration is not finite', () => {
    const video = makeVideo(5, makeBuffered([[0, 10]]), Infinity);
    expect(getBufferedPercentage(video, Infinity)).toBe(0);
  });

  it('getBufferedPercentage returns 0 when no buffered ranges', () => {
    const video = makeVideo(5, makeBuffered([]), 100);
    expect(getBufferedPercentage(video, 100)).toBe(0);
  });

  it('getBufferedPercentage uses the range containing currentTime', () => {
    const video = makeVideo(5, makeBuffered([[0, 10]]), 100);
    // currentTime=5 is in [0, 10], bufferedEnd=10
    expect(getBufferedPercentage(video, 100)).toBe(0.1);
  });

  it('getBufferedPercentage tracks max end when currentTime not in range', () => {
    // currentTime=15 is not in [0, 10], so we scan for max end
    const video = makeVideo(15, makeBuffered([[0, 10]]), 100);
    expect(getBufferedPercentage(video, 100)).toBe(0.1);
  });

  it('getBufferedPercentage skips range whose end is not greater than current max', () => {
    // Two ranges: [0, 20] then [25, 15] — second end (15) < bufferedEnd (20)
    const video = makeVideo(30, makeBuffered([[0, 20], [25, 15]]), 100);
    // After first range: bufferedEnd=20. Second range: 15 < 20, no update.
    expect(getBufferedPercentage(video, 100)).toBe(0.2);
  });

  it('getBufferedPercentage uses the largest end across non-matching ranges', () => {
    // currentTime=50 not in any range; first range ends at 10, second at 30
    const video = makeVideo(50, makeBuffered([[0, 10], [15, 30]]), 100);
    expect(getBufferedPercentage(video, 100)).toBe(0.3);
  });
});

