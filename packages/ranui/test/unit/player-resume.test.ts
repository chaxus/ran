import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadResumePosition, saveResumePosition, shouldResumeAt } from '@/components/player/core/resume';
import '@/components/player';

describe('core/resume pure functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shouldResumeAt rejects zero/negative positions and positions within 2s of the end', () => {
    expect(shouldResumeAt(0, 100)).toBe(false);
    expect(shouldResumeAt(-1, 100)).toBe(false);
    expect(shouldResumeAt(99, 100)).toBe(false);
    expect(shouldResumeAt(98.5, 100)).toBe(false);
    expect(shouldResumeAt(50, 100)).toBe(true);
  });

  it('shouldResumeAt rejects an unknown/invalid duration', () => {
    expect(shouldResumeAt(50, 0)).toBe(false);
    expect(shouldResumeAt(50, NaN)).toBe(false);
    expect(shouldResumeAt(50, Infinity)).toBe(false);
  });

  it('round-trips a saved position through loadResumePosition', () => {
    expect(loadResumePosition('https://cdn.example.com/a.mp4')).toBe(0);
    saveResumePosition('https://cdn.example.com/a.mp4', 42);
    expect(loadResumePosition('https://cdn.example.com/a.mp4')).toBe(42);
    // Keyed by src — a different URL doesn't see the same position.
    expect(loadResumePosition('https://cdn.example.com/b.mp4')).toBe(0);
  });
});

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  player.listenEvent();
  return player;
};

describe('r-player resume playback (integration)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('does nothing when remember-position is not set', () => {
    const player = makePlayer();
    player.setAttribute('src', 'https://cdn.example.com/x.mp4');
    Object.defineProperty(player._video, 'currentTime', { value: 30, writable: true, configurable: true });

    player._video.dispatchEvent(new Event('pause'));

    expect(loadResumePosition('https://cdn.example.com/x.mp4')).toBe(0);
  });

  it('saves the current position on pause when remember-position is set', () => {
    const player = makePlayer();
    player.setAttribute('remember-position', '');
    player.setAttribute('src', 'https://cdn.example.com/x.mp4');
    Object.defineProperty(player._video, 'currentTime', { value: 30, writable: true, configurable: true });

    player._video.dispatchEvent(new Event('pause'));

    expect(loadResumePosition('https://cdn.example.com/x.mp4')).toBe(30);
  });

  it('saves the current position when the page becomes hidden', () => {
    const player = makePlayer();
    player.setAttribute('remember-position', '');
    player.setAttribute('src', 'https://cdn.example.com/x.mp4');
    Object.defineProperty(player._video, 'currentTime', { value: 55, writable: true, configurable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });

    document.dispatchEvent(new Event('visibilitychange'));

    expect(loadResumePosition('https://cdn.example.com/x.mp4')).toBe(55);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  });

  it('restores a saved position on loadedmetadata and emits a resume change event', () => {
    const player = makePlayer();
    player.setAttribute('remember-position', '');
    player.setAttribute('src', 'https://cdn.example.com/x.mp4');
    saveResumePosition('https://cdn.example.com/x.mp4', 40);
    Object.defineProperty(player._video, 'duration', { value: 100, configurable: true });
    const setCurrentTimeSpy = vi.spyOn(player, 'setCurrentTime');
    let resumeDetail: any;
    player.addEventListener('change', (e: CustomEvent) => {
      if (e.detail.type === 'resume') resumeDetail = e.detail;
    });

    player._video.dispatchEvent(new Event('loadedmetadata'));

    expect(setCurrentTimeSpy).toHaveBeenCalledWith(40);
    expect(resumeDetail?.data).toBe(40);
  });

  it('does not restore a position within 2s of the end', () => {
    const player = makePlayer();
    player.setAttribute('remember-position', '');
    player.setAttribute('src', 'https://cdn.example.com/x.mp4');
    saveResumePosition('https://cdn.example.com/x.mp4', 99);
    Object.defineProperty(player._video, 'duration', { value: 100, configurable: true });
    const setCurrentTimeSpy = vi.spyOn(player, 'setCurrentTime');

    player._video.dispatchEvent(new Event('loadedmetadata'));

    expect(setCurrentTimeSpy).not.toHaveBeenCalled();
  });

  it('clears the saved position when playback ends', () => {
    const player = makePlayer();
    player.setAttribute('remember-position', '');
    player.setAttribute('src', 'https://cdn.example.com/x.mp4');
    saveResumePosition('https://cdn.example.com/x.mp4', 40);

    player._video.dispatchEvent(new Event('ended'));

    expect(loadResumePosition('https://cdn.example.com/x.mp4')).toBe(0);
  });

  it('does not restore during a quality-switch reload (_isSwitchingSource)', () => {
    const player = makePlayer();
    player.setAttribute('remember-position', '');
    player.setAttribute('src', 'https://cdn.example.com/x.mp4');
    saveResumePosition('https://cdn.example.com/x.mp4', 40);
    Object.defineProperty(player._video, 'duration', { value: 100, configurable: true });
    player._isSwitchingSource = true;
    const setCurrentTimeSpy = vi.spyOn(player, 'setCurrentTime');

    player._video.dispatchEvent(new Event('loadedmetadata'));

    expect(setCurrentTimeSpy).not.toHaveBeenCalled();
  });
});
