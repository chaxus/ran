import { describe, expect, it } from 'vitest';
import {
  shouldSetLoadingOnSeeking,
  shouldSetLoadingOnWaiting,
  syncPlayButtonState,
  syncCenterPlayVisibility,
} from '@/components/player/core/events';

const makeVideo = (overrides: Partial<HTMLVideoElement> = {}): HTMLVideoElement =>
  ({ paused: false, ended: false, ...overrides }) as any;

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
      el.appendChild(document.createElement('r-icon'));
      return el;
    };

    it('switches the inner r-icon to pause and sets the aria-label when playing', () => {
      const btn = makeButton();
      syncPlayButtonState(btn, true);
      expect(btn.querySelector('r-icon')?.getAttribute('name')).toBe('pause');
      expect(btn.getAttribute('aria-label')).toBe('Pause');
    });

    it('switches the inner r-icon to play and sets the aria-label when not playing', () => {
      const btn = makeButton();
      syncPlayButtonState(btn, false);
      expect(btn.querySelector('r-icon')?.getAttribute('name')).toBe('play');
      expect(btn.getAttribute('aria-label')).toBe('Play');
    });

    it('does not throw when the button has no r-icon child', () => {
      const btn = document.createElement('div');
      expect(() => syncPlayButtonState(btn, true)).not.toThrow();
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
