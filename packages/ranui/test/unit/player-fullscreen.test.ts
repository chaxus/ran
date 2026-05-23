import { describe, expect, it, vi } from 'vitest';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  return player;
};

describe('r-player fullscreen compatibility', () => {
  it('uses prefixed element fullscreen API when standard requestFullscreen is unavailable', async () => {
    const player = makePlayer();
    const webkitRequestFullscreen = vi.fn(() => Promise.resolve());
    player._player.requestFullscreen = undefined;
    player._player.webkitRequestFullscreen = webkitRequestFullscreen;

    await player.customRequestFullscreen();

    expect(webkitRequestFullscreen).toHaveBeenCalledTimes(1);
  });

  it('uses prefixed document fullscreen exit API when standard exitFullscreen is unavailable', async () => {
    const player = makePlayer();
    const webkitExitFullscreen = vi.fn(() => Promise.resolve());
    Object.defineProperty(document, 'exitFullscreen', { value: undefined, configurable: true });
    Object.defineProperty(document, 'webkitExitFullscreen', { value: webkitExitFullscreen, configurable: true });

    await player.customExitFullscreen();

    expect(webkitExitFullscreen).toHaveBeenCalledTimes(1);
  });
});
