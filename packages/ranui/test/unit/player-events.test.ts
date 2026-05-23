import { describe, expect, it, vi } from 'vitest';
import {
  shouldSetLoadingOnSeeking,
  shouldSetLoadingOnWaiting,
  syncPlayButtonState,
  syncCenterPlayVisibility,
} from '@/components/player/core/events';

const makeVideo = (overrides: Partial<HTMLVideoElement> = {}): HTMLVideoElement =>
  ({ paused: false, ended: false, ...overrides } as any);

describe('player/core/events', () => {
  describe('shouldSetLoadingOnSeeking', () => {
    it('returns false when dragging progress', () => {
      expect(shouldSetLoadingOnSeeking({ isDraggingProgress: true, video: makeVideo() })).toBe(false);
    });
    it('returns false when no video', () => {
      expect(shouldSetLoadingOnSeeking({ isDraggingProgress: false, video: undefined })).toBe(false);
    });
    it('returns false when video is paused', () => {
      expect(shouldSetLoadingOnSeeking({ isDraggingProgress: false, video: makeVideo({ paused: true }) })).toBe(false);
    });
    it('returns true when not dragging and video playing', () => {
      expect(shouldSetLoadingOnSeeking({ isDraggingProgress: false, video: makeVideo({ paused: false }) })).toBe(true);
    });
  });

  describe('shouldSetLoadingOnWaiting', () => {
    it('returns false when no video', () => {
      expect(shouldSetLoadingOnWaiting({ isSeeking: false, video: undefined })).toBe(false);
    });
    it('returns false when video is paused', () => {
      expect(shouldSetLoadingOnWaiting({ isSeeking: false, video: makeVideo({ paused: true }) })).toBe(false);
    });
    it('returns false when video has ended', () => {
      expect(shouldSetLoadingOnWaiting({ isSeeking: false, video: makeVideo({ ended: true }) })).toBe(false);
    });
    it('returns false when seeking', () => {
      expect(shouldSetLoadingOnWaiting({ isSeeking: true, video: makeVideo() })).toBe(false);
    });
    it('returns true when video playing and not seeking', () => {
      expect(shouldSetLoadingOnWaiting({ isSeeking: false, video: makeVideo() })).toBe(true);
    });
  });

  describe('syncPlayButtonState', () => {
    const makeButton = () => {
      const el = document.createElement('div');
      return el;
    };

    it('adds pause class and removes play class when playing', () => {
      const btn = makeButton();
      btn.classList.add('ran-player-controller-bottom-left-btn-play');
      syncPlayButtonState(btn, true);
      expect(btn.classList.contains('ran-player-controller-bottom-left-btn-pause')).toBe(true);
      expect(btn.classList.contains('ran-player-controller-bottom-left-btn-play')).toBe(false);
    });

    it('adds play class and removes pause class when not playing', () => {
      const btn = makeButton();
      btn.classList.add('ran-player-controller-bottom-left-btn-pause');
      syncPlayButtonState(btn, false);
      expect(btn.classList.contains('ran-player-controller-bottom-left-btn-play')).toBe(true);
      expect(btn.classList.contains('ran-player-controller-bottom-left-btn-pause')).toBe(false);
    });
  });

  describe('syncCenterPlayVisibility', () => {
    it('sets display to block when visible', () => {
      const el = document.createElement('div');
      syncCenterPlayVisibility(el, true);
      expect(el.style.display).toBe('block');
    });

    it('sets display to none when not visible', () => {
      const el = document.createElement('div');
      syncCenterPlayVisibility(el, false);
      expect(el.style.display).toBe('none');
    });
  });
});
