import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

/**
 * While playing, the player repaints its progress bar every frame. Off screen nobody sees
 * it, so the loop stops; back on screen it repaints at once and resumes.
 */
type Entry = { isIntersecting: boolean; target: Element };
let observe: ((entries: Entry[]) => void) | undefined;
let observed: Element | undefined;

beforeEach(() => {
  document.body.innerHTML = '';
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: (entries: Entry[]) => void) {
        observe = callback;
      }
      observe(target: Element) {
        observed = target;
      }
      disconnect() {
        observe = undefined;
      }
      unobserve() {}
      takeRecords() {
        return [];
      }
    },
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  player.setAttribute('disable-error-modal', '');
  document.body.appendChild(player);
  player._video = document.createElement('video');
  player.listenEvent();
  return player;
};
const frames = () => vi.spyOn(window, 'requestAnimationFrame');
const setVisible = (player: any, isIntersecting: boolean) => observe?.([{ isIntersecting, target: player }]);

describe('r-player off screen', () => {
  it('watches its own host', () => {
    const player = makePlayer();
    expect(observed).toBe(player);
  });

  it('starts the progress loop on play while visible', () => {
    const player = makePlayer();
    const spy = frames();
    player._video.dispatchEvent(new Event('play'));
    expect(spy).toHaveBeenCalled();
  });

  it('stops the loop when scrolled away and does not restart it on play', () => {
    const player = makePlayer();
    player._video.dispatchEvent(new Event('play'));
    const cancel = vi.spyOn(window, 'cancelAnimationFrame');
    setVisible(player, false);
    expect(cancel).toHaveBeenCalled();
    const spy = frames();
    player._video.dispatchEvent(new Event('play'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('repaints at once and resumes when it returns while playing', () => {
    const player = makePlayer();
    setVisible(player, false);
    Object.defineProperty(player._video, 'paused', { value: false, configurable: true });
    Object.defineProperty(player._video, 'currentTime', { value: 12, configurable: true });
    const spy = frames();
    setVisible(player, true);
    expect(player.ctx.currentTime).toBe(12);
    expect(spy).toHaveBeenCalled();
  });

  it('stays idle when it returns while paused', () => {
    const player = makePlayer();
    setVisible(player, false);
    const spy = frames();
    setVisible(player, true);
    expect(spy).not.toHaveBeenCalled();
  });
});
