import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  return player;
};

describe('r-player interaction methods', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('clicking the player container toggles play and pause state', () => {
    const player = makePlayer();
    const event = new MouseEvent('click');
    const pauseSpy = vi.spyOn(player, 'pause').mockImplementation(() => undefined);
    const playSpy = vi.spyOn(player, 'play').mockImplementation(() => undefined);

    player.ctx.currentState = 'play';
    player.dispatchClickPlayerContainerAction(event);
    expect(pauseSpy).toHaveBeenCalled();
    expect(player._playerBtn.style.display).toBe('block');

    player.ctx.currentState = 'pause';
    player.dispatchClickPlayerContainerAction(event);
    expect(playSpy).toHaveBeenCalled();
    expect(player._playerBtn.style.display).toBe('none');
  });

  it('keyboard arrows seek by five seconds within duration bounds', () => {
    const player = makePlayer();
    player.ctx.currentTime = 10;
    player.ctx.duration = 20;
    const setCurrentTimeSpy = vi.spyOn(player, 'setCurrentTime');
    const playSpy = vi.spyOn(player, 'play').mockImplementation(() => undefined);

    player.SpaceKeyDown(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    expect(setCurrentTimeSpy).toHaveBeenLastCalledWith(5);
    expect(playSpy).toHaveBeenCalled();

    player.ctx.currentTime = 18;
    player.SpaceKeyDown(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    expect(setCurrentTimeSpy).toHaveBeenLastCalledWith(20);
  });

  it('progress click seeks using progress geometry', () => {
    const player = makePlayer();
    player._video = document.createElement('video');
    Object.defineProperty(player._video, 'duration', { value: 100, configurable: true });
    Object.defineProperty(player._progress, 'offsetWidth', { value: 200, configurable: true });
    player._progressWrap.getBoundingClientRect = vi.fn(() => ({ left: 10 }) as DOMRect);

    player.progressClick(new MouseEvent('click', { clientX: 60 }));

    expect(player._video.currentTime).toBe(25);
    expect(player.ctx.currentTime).toBe(25);
  });

  it('dragging the progress dot updates preview progress and resumes playback on mouseup', () => {
    const player = makePlayer();
    player._video = document.createElement('video');
    Object.defineProperty(player._video, 'duration', { value: 100, configurable: true });
    Object.defineProperty(player._video, 'paused', { value: false, configurable: true });
    Object.defineProperty(player._video, 'ended', { value: false, configurable: true });
    Object.defineProperty(player._progress, 'offsetWidth', { value: 200, configurable: true });
    player._progress.getBoundingClientRect = vi.fn(() => ({ left: 0 }) as DOMRect);
    vi.spyOn(player._video, 'play').mockReturnValue(Promise.resolve() as any);

    player.progressDotMouseDown();
    player.progressDotMouseMoveDocument(new MouseEvent('mousemove', { clientX: 109 }));
    player.progressDotMouseUp();

    expect(player.moveProgress.mouseDown).toBe(false);
    expect(player.ctx.currentTime).toBe(50);
    expect(player._video.currentTime).toBe(50);
  });

  it('progress hover updates tip position and formatted time', () => {
    const player = makePlayer();
    player.ctx.duration = 100;
    Object.defineProperty(player._progress, 'clientWidth', { value: 200, configurable: true });
    player._progress.getBoundingClientRect = vi.fn(() => ({ left: 0 }) as DOMRect);

    player.progressMouseEnter(new MouseEvent('mouseenter', { clientX: 50 }));

    expect(player._playerTip.style.opacity).toBe('1');
    expect(player._playerTipTime.innerText).toBe('00:25');
  });

  it('fullscreen change emits state and updates context', () => {
    const player = makePlayer();
    let detail: any;
    player.addEventListener('change', (event: Event) => {
      detail = (event as CustomEvent).detail;
    });
    Object.defineProperty(document, 'fullscreenElement', { value: player._player, configurable: true });

    player.fullScreenChange();

    expect(player.ctx.fullScreen).toBe(true);
    expect(detail.type).toBe('fullscreen');
    expect(detail.data).toBe(true);
  });

  it('play with a start time updates current time before playing', () => {
    const player = makePlayer();
    player._video = document.createElement('video');
    const playSpy = vi.spyOn(player._video, 'play').mockReturnValue(Promise.resolve() as any);

    player.play(12);

    expect(player._video.currentTime).toBe(12);
    expect(player.ctx.currentTime).toBe(12);
    expect(playSpy).toHaveBeenCalled();
  });
});
