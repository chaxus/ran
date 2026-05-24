import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
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

    const handlers: Array<[string, string]> = [
      ['onComplete', 'complete'],
      ['onEmptied', 'emptied'],
      ['onLoadstart', 'loadstart'],
      ['onRatechange', 'ratechange'],
      ['onStalled', 'stalled'],
      ['onSuspend', 'suspend'],
      ['onTimeupdate', 'timeupdate'],
      ['onVolumechange', 'volumechange'],
    ];

    handlers.forEach(([handlerName, eventName]) => {
      player[handlerName](new Event(eventName));
      expect(player.ctx.currentState).toBe(eventName);
    });
    expect(seenTypes).toEqual(handlers.map(([, eventName]) => eventName));
  });

  it('clears switching and loading state for ready and terminal media events', () => {
    const player = makePlayer();
    const loadingSpy = vi.spyOn(player, 'setLoadingState');
    vi.spyOn(player, 'resize').mockImplementation(() => undefined);

    ['onCanplay', 'onCanplaythrough', 'onEnded', 'onError', 'onSeeked'].forEach((handlerName) => {
      player._isSwitchingSource = true;
      player[handlerName](new Event(handlerName.replace('on', '').toLowerCase()));
      expect(player._isSwitchingSource).toBe(false);
    });

    expect(loadingSpy).toHaveBeenCalledWith(false);
  });

  it('restores pending playback snapshot on loadedmetadata', () => {
    const player = makePlayer();
    const snapshot = { currentTime: 18, playbackRate: 1.25, volume: 0.8, shouldResume: false };
    player._pendingPlaybackRestore = snapshot;
    vi.spyOn(player, 'updateBufferedProgress').mockImplementation(() => undefined);
    vi.spyOn(player, 'pause').mockImplementation(() => undefined);
    const restoreSpy = vi.spyOn(player, 'restorePlaybackSnapshot');

    player.onLoadedmetadata(new Event('loadedmetadata'));

    expect(restoreSpy).toHaveBeenCalledWith(snapshot);
    expect(player._pendingPlaybackRestore).toBeUndefined();
    expect(player._isSwitchingSource).toBe(false);
  });

  it('initializes duration and progress display on loadeddata', () => {
    const player = makePlayer();
    Object.defineProperty(player._video, 'duration', { value: 120, configurable: true });
    player._isSwitchingSource = true;
    player._pendingPlaybackRestore = { currentTime: 30, playbackRate: 1, volume: 1, shouldResume: true };
    vi.spyOn(player, 'updateBufferedProgress').mockImplementation(() => undefined);
    const syncProgressSpy = vi.spyOn(player, 'syncProgressByPercentage');

    player.onLoadeddata(new Event('loadeddata'));

    expect(player.ctx.duration).toBe(120);
    expect(syncProgressSpy).toHaveBeenCalledWith(0.25);
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
    const loadingSpy = vi.spyOn(player, 'setLoadingState');

    player.onPlay(new Event('play'));
    expect(player.ctx.currentState).toBe('play');
    expect(
      player._playerControllerBottomPlayBtn.classList.contains('ran-player-controller-bottom-left-btn-pause'),
    ).toBe(true);

    player.onPlaying(new Event('playing'));
    expect(player._playerBtn.style.display).toBe('none');

    player._isSeeking = true;
    player.onPause(new Event('pause'));
    expect(player._playerBtn.style.display).toBe('none');
    expect(player._playerController.style.opacity).toBe('1');

    player._isSwitchingSource = true;
    player.onWaiting(new Event('waiting'));
    expect(loadingSpy).toHaveBeenLastCalledWith(true);
  });
});
