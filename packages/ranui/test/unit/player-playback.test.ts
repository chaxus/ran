import { describe, expect, it } from 'vitest';
import { shouldResumePlayback, resolveSeekDuration, createPlaybackSnapshot } from '@/components/player/core/playback';

const makeVideo = (overrides: Partial<HTMLVideoElement> = {}): HTMLVideoElement =>
  ({ paused: false, ended: false, ...overrides }) as any;

describe('player/core/playback', () => {
  describe('shouldResumePlayback', () => {
    it('returns false when no video', () => {
      expect(shouldResumePlayback(undefined)).toBe(false);
    });
    it('returns false when paused', () => {
      expect(shouldResumePlayback(makeVideo({ paused: true }))).toBe(false);
    });
    it('returns false when ended', () => {
      expect(shouldResumePlayback(makeVideo({ ended: true }))).toBe(false);
    });
    it('returns true when playing and not ended', () => {
      expect(shouldResumePlayback(makeVideo({ paused: false, ended: false }))).toBe(true);
    });
  });

  describe('resolveSeekDuration', () => {
    it('returns video duration when positive', () => {
      expect(resolveSeekDuration(120, 60)).toBe(120);
    });
    it('falls back to context duration when video duration is 0', () => {
      expect(resolveSeekDuration(0, 60)).toBe(60);
    });
    it('falls back to context duration when video duration is negative', () => {
      expect(resolveSeekDuration(-1, 90)).toBe(90);
    });
  });

  describe('createPlaybackSnapshot', () => {
    it('creates snapshot with all provided fields', () => {
      const snap = createPlaybackSnapshot({
        currentTime: 30,
        playbackRate: 1.5,
        volume: 0.8,
        shouldResume: true,
      });
      expect(snap.currentTime).toBe(30);
      expect(snap.playbackRate).toBe(1.5);
      expect(snap.volume).toBe(0.8);
      expect(snap.shouldResume).toBe(true);
    });

    it('preserves zero and false values', () => {
      const snap = createPlaybackSnapshot({ currentTime: 0, playbackRate: 1, volume: 0, shouldResume: false });
      expect(snap.currentTime).toBe(0);
      expect(snap.volume).toBe(0);
      expect(snap.shouldResume).toBe(false);
    });
  });
});
