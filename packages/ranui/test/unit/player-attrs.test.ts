import { beforeEach, describe, expect, it } from 'vitest';
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

  it('setVolume keeps native video.muted in sync with the 0-100 volume level', () => {
    const player = makePlayer();
    player.updatePlayer();

    player.setVolume(0);
    expect(player._video.muted).toBe(true);

    player.setVolume(40);
    expect(player._video.muted).toBe(false);
  });
});
