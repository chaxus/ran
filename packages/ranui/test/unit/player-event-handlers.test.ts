import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  // Rebind media listeners to the replacement video so dispatched events below
  // actually run through the real handler chain instead of going nowhere.
  player.listenEvent();
  return player;
};

describe('r-player media event handlers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('updates currentState and emits change events for simple media events', () => {
    const player = makePlayer();
    const seenTypes: string[] = [];
    player.addEventListener('change', (event: Event) => {
      seenTypes.push((event as CustomEvent).detail.type);
    });

    const eventNames = ['complete', 'emptied', 'loadstart', 'ratechange', 'stalled', 'suspend', 'timeupdate', 'volumechange'];

    eventNames.forEach((eventName) => {
      player._video.dispatchEvent(new Event(eventName));
      expect(player.ctx.currentState).toBe(eventName);
    });
    expect(seenTypes).toEqual(eventNames);
  });

  it('clears switching and loading state for ready and terminal media events', () => {
    const player = makePlayer();

    ['canplay', 'canplaythrough', 'ended', 'error', 'seeked'].forEach((eventName) => {
      player._isSwitchingSource = true;
      player.setLoadingState(true);
      player._video.dispatchEvent(new Event(eventName));
      expect(player._isSwitchingSource).toBe(false);
      expect(player._player.classList.contains('ran-player-buffering')).toBe(false);
    });
  });

  it('restores pending playback snapshot on loadedmetadata', () => {
    const player = makePlayer();
    const snapshot = { currentTime: 18, playbackRate: 1.25, volume: 0.8, shouldResume: false };
    player._pendingPlaybackRestore = snapshot;
    const pauseSpy = vi.spyOn(player, 'pause').mockImplementation(() => undefined);

    player._video.dispatchEvent(new Event('loadedmetadata'));

    expect(player.getCurrentTime()).toBe(18);
    expect(player.getPlaybackRate()).toBe(1.25);
    expect(player.getVolume()).toBe(0.8);
    expect(pauseSpy).toHaveBeenCalled();
    expect(player._pendingPlaybackRestore).toBeUndefined();
    expect(player._isSwitchingSource).toBe(false);
  });

  it('initializes duration and progress display on loadeddata', () => {
    const player = makePlayer();
    Object.defineProperty(player._video, 'duration', { value: 120, configurable: true });
    player._isSwitchingSource = true;
    player._pendingPlaybackRestore = { currentTime: 30, playbackRate: 1, volume: 1, shouldResume: true };

    player._video.dispatchEvent(new Event('loadeddata'));

    expect(player.ctx.duration).toBe(120);
    expect(player._progressWrapValue.style.transform).toBe('scaleX(0.25)');
    expect(player._playerControllerBottomTimeCurrent.innerText).toBe('00:30');
    expect(player._playerControllerBottomTimeDuration.innerText).toBe('02:00');
  });

  it('updates loading and control state across play, playing, pause and waiting events', () => {
    const player = makePlayer();
    Object.defineProperty(player._video, 'paused', { value: false, configurable: true });
    Object.defineProperty(player._video, 'ended', { value: false, configurable: true });
    vi.spyOn(player, 'requestAnimationFrame').mockImplementation(() => undefined);
    vi.spyOn(player, 'cancelAnimationFrame').mockImplementation(() => undefined);
    vi.spyOn(player, 'showControllerBar').mockImplementation(() => undefined);

    player._video.dispatchEvent(new Event('play'));
    expect(player.ctx.currentState).toBe('play');
    expect(
      player._playerControllerBottomPlayBtn.classList.contains('ran-player-controller-bottom-left-btn-pause'),
    ).toBe(true);

    player._video.dispatchEvent(new Event('playing'));
    expect(player._playerBtn.style.display).toBe('none');

    player._isSeeking = true;
    player._video.dispatchEvent(new Event('pause'));
    expect(player._playerBtn.style.display).toBe('none');
    expect(player._playerController.style.opacity).toBe('1');
    expect(
      player._playerControllerBottomPlayBtn.classList.contains('ran-player-controller-bottom-left-btn-play'),
    ).toBe(true);

    player._isSwitchingSource = true;
    const setLoadingStateSpy = vi.spyOn(player, 'setLoadingState');
    player._video.dispatchEvent(new Event('waiting'));
    expect(setLoadingStateSpy).toHaveBeenLastCalledWith(true);
  });
});
