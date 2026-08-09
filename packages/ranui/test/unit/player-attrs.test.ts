import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  return player;
};

describe('r-player poster/autoplay/loop/muted', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects poster/autoplay/loop/muted properties to attributes', () => {
    const player = makePlayer();

    player.poster = 'https://example.com/poster.jpg';
    expect(player.getAttribute('poster')).toBe('https://example.com/poster.jpg');

    player.autoplay = true;
    expect(player.hasAttribute('autoplay')).toBe(true);
    player.autoplay = false;
    expect(player.hasAttribute('autoplay')).toBe(false);

    player.loop = true;
    expect(player.hasAttribute('loop')).toBe(true);

    player.muted = true;
    expect(player.hasAttribute('muted')).toBe(true);
  });

  it('applies poster/autoplay/loop to the built video element', () => {
    const player = makePlayer();
    player.setAttribute('poster', 'https://example.com/poster.jpg');
    player.setAttribute('autoplay', '');
    player.setAttribute('loop', '');

    player.updatePlayer();

    expect(player._video.poster).toContain('poster.jpg');
    expect(player._video.autoplay).toBe(true);
    expect(player._video.loop).toBe(true);
  });

  it('starts muted (volume 0, video.muted true) when the muted attribute is set', () => {
    const player = makePlayer();
    player.setAttribute('muted', '');

    player.updatePlayer();

    expect(player.ctx.volume).toBe(0);
    expect(player._video.muted).toBe(true);
  });

  it('updates poster/autoplay/loop live without a src change', () => {
    const player = makePlayer();
    player.updatePlayer();

    player.setAttribute('poster', 'https://example.com/live-poster.jpg');
    player.setAttribute('autoplay', '');
    player.setAttribute('loop', '');

    expect(player._video.poster).toContain('live-poster.jpg');
    expect(player._video.autoplay).toBe(true);
    expect(player._video.loop).toBe(true);
  });

  it('toggling the muted attribute live mutes and restores volume', () => {
    const player = makePlayer();
    player.updatePlayer();
    player._volume = 65;
    player.setVolume(65);

    player.setAttribute('muted', '');
    expect(player.ctx.volume).toBe(0);
    expect(player._video.muted).toBe(true);

    player.removeAttribute('muted');
    expect(player.ctx.volume).toBe(65);
    expect(player._video.muted).toBe(false);
  });

  it('setting src before connecting calls updatePlayer exactly once (not twice)', () => {
    // Reproduces the exact sequence that used to double-fire `updatePlayer()`
    // — once from `attributeChangedCallback('src', ...)` while still
    // disconnected, once again from `connectedCallback` right after — which
    // created two `Hls` instances (the first only sometimes actually
    // destroyed before its in-flight manifest fetch resolved) and, on real
    // streams, two clarity/quality `<r-select>`s with one leaked as an
    // orphaned, invisible dropdown panel. `document.createElement` +
    // `setAttribute` + `appendChild` (this test) and plain parsed HTML both
    // hit this same path — see the comment on `_didInitialConnect`.
    const player = document.createElement('r-player') as any;
    const spy = vi.spyOn(player, 'updatePlayer');

    player.setAttribute('src', 'https://example.com/video.m3u8');
    expect(spy, 'must not fire before the element has ever connected').not.toHaveBeenCalled();

    document.body.appendChild(player);
    expect(spy, 'connectedCallback must be the only thing that fires it for the initial load').toHaveBeenCalledTimes(1);
  });

  it('changing src on an already-connected player still calls updatePlayer', () => {
    const player = makePlayer();
    const spy = vi.spyOn(player, 'updatePlayer');

    player.setAttribute('src', 'https://example.com/video.m3u8');
    expect(spy, 'a source change on a live player must still reload').toHaveBeenCalledTimes(1);

    player.setAttribute('src', 'https://example.com/other.m3u8');
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('setVolume keeps native video.muted in sync with the 0-100 volume level', () => {
    const player = makePlayer();
    player.updatePlayer();

    player.setVolume(0);
    expect(player._video.muted).toBe(true);

    player.setVolume(40);
    expect(player._video.muted).toBe(false);
  });
});
