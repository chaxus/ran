import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  return player;
};

describe('r-player controls and browser-facing helpers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('captures a playback snapshot from the current video state', () => {
    const player = makePlayer();
    player._video.currentTime = 42;
    player._video.playbackRate = 1.5;
    player._video.volume = 0.7;
    Object.defineProperty(player._video, 'paused', { value: false, configurable: true });
    Object.defineProperty(player._video, 'ended', { value: false, configurable: true });

    expect(player.capturePlaybackSnapshot()).toEqual({
      currentTime: 42,
      playbackRate: 1.5,
      volume: 0.7,
      shouldResume: true,
    });
  });

  it('auto-hides the controller bar while playing', () => {
    vi.useFakeTimers();
    const player = makePlayer();
    player.ctx.currentState = 'play';

    player.showControllerBar();
    expect(player._playerController.style.opacity).toBe('1');

    vi.advanceTimersByTime(2000);
    expect(player._playerController.style.opacity).toBe('0');
    expect(player.controllerBarTimeId).toBeUndefined();
  });

  it('keeps controller visible when hovering the controller itself', () => {
    const player = makePlayer();
    const target = document.createElement('div');
    target.className = 'ran-player-controller';
    player.controllerBarTimeId = setTimeout(() => undefined, 10);

    player.showControllerBar(new MouseEvent('mousemove', { bubbles: true }));
    player.showControllerBar({ target } as unknown as MouseEvent);

    expect(player._playerController.style.opacity).toBe('1');
    expect(player.controllerBarTimeId).toBeUndefined();
  });

  it('uses the player button action to toggle playback state', () => {
    const player = makePlayer();
    const pauseSpy = vi.spyOn(player, 'pause').mockImplementation(() => undefined);
    const playSpy = vi.spyOn(player, 'play').mockImplementation(() => undefined);

    player.ctx.currentState = 'play';
    player.dispatchClickPlayerBtnAction(new MouseEvent('click'));
    expect(pauseSpy).toHaveBeenCalled();
    expect(player._playerBtn.style.display).toBe('block');

    player.ctx.currentState = 'pause';
    player.dispatchClickPlayerBtnAction(new MouseEvent('click'));
    expect(playSpy).toHaveBeenCalled();
    expect(player._playerBtn.style.display).toBe('none');
  });

  it('opens and exits fullscreen through wrapped fullscreen helpers', async () => {
    const player = makePlayer();
    vi.spyOn(player, 'resize').mockImplementation(() => undefined);
    const requestSpy = vi.spyOn(player, 'customRequestFullscreen').mockResolvedValue(undefined);
    const exitSpy = vi.spyOn(player, 'customExitFullscreen').mockResolvedValue(undefined);

    player.openFullScreen();
    await Promise.resolve();
    expect(requestSpy).toHaveBeenCalled();
    expect(player.ctx.fullScreen).toBe(true);

    player.openFullScreen();
    await Promise.resolve();
    expect(exitSpy).toHaveBeenCalled();
    expect(player.ctx.fullScreen).toBe(false);
  });

  it('updates progress on drag move and hides the progress tip on leave', () => {
    const player = makePlayer();
    player.moveProgress.mouseDown = true;
    Object.defineProperty(player._progress, 'offsetWidth', { value: 200, configurable: true });
    player._progress.getBoundingClientRect = vi.fn(() => ({ left: 0 }) as DOMRect);
    const syncSpy = vi.spyOn(player, 'syncProgressByPercentage');

    player.progressDotMouseMove(new MouseEvent('mousemove', { clientX: 109 }));
    expect(syncSpy).toHaveBeenCalledWith(0.5);
    expect(player.moveProgress.percentage).toBe(0.5);

    player._playerTip.style.opacity = '1';
    player.progressMouseLeave(new MouseEvent('mouseleave'));
    expect(player._playerTip.style.opacity).toBe('0');
  });

  it('updates progress hover position on mouse move', () => {
    const player = makePlayer();
    player.ctx.duration = 80;
    Object.defineProperty(player._progress, 'clientWidth', { value: 200, configurable: true });
    player._progress.getBoundingClientRect = vi.fn(() => ({ left: 10 }) as DOMRect);

    player.progressMouseMove(new MouseEvent('mousemove', { clientX: 60 }));

    expect(player._playerTip.style.opacity).toBe('1');
    expect(player._playerTipTime.innerText).toBe('00:20');
  });

  it('resizes the video and hides volume controls on narrow screens', () => {
    const player = makePlayer();
    player._player.getBoundingClientRect = vi.fn(() => ({ width: 320, height: 180 }) as DOMRect);
    Object.defineProperty(document.body, 'clientWidth', { value: 400, configurable: true });
    vi.spyOn(player, 'updateCurrentProgress').mockImplementation(() => undefined);

    player.resize();

    expect(player._video.style.width).toBe('320px');
    expect(player._video.style.height).toBe('180px');
    expect(player._playControllerBottomVolume.style.display).toBe('none');
  });

  it('reads playback values and pauses through the video element', () => {
    const player = makePlayer();
    player._video.playbackRate = 1.25;
    player._video.volume = 0.4;
    const pauseSpy = vi.spyOn(player._video, 'pause').mockImplementation(() => undefined);

    expect(player.getPlaybackRate()).toBe(1.25);
    expect(player.getVolume()).toBe(0.4);
    player.pause();
    expect(pauseSpy).toHaveBeenCalled();
  });
});
