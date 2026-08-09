import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isRemotePlaybackSupported, requestRemotePlayback } from '@/components/player/core/remote-playback';
import '@/components/player';

describe('core/remote-playback pure functions', () => {
  it('isRemotePlaybackSupported is false with no video', () => {
    expect(isRemotePlaybackSupported(undefined)).toBe(false);
  });

  it('isRemotePlaybackSupported is false when neither API exists', () => {
    const video = document.createElement('video');
    expect(isRemotePlaybackSupported(video)).toBe(false);
  });

  it('isRemotePlaybackSupported is true when the standard remote.prompt exists', () => {
    const video = document.createElement('video') as unknown as { remote: { prompt: () => Promise<void> } };
    video.remote = { prompt: vi.fn().mockResolvedValue(undefined) };
    expect(isRemotePlaybackSupported(video as unknown as HTMLVideoElement)).toBe(true);
  });

  it('isRemotePlaybackSupported is true when the AirPlay picker exists', () => {
    const video = document.createElement('video') as unknown as { webkitShowPlaybackTargetPicker: () => void };
    video.webkitShowPlaybackTargetPicker = vi.fn();
    expect(isRemotePlaybackSupported(video as unknown as HTMLVideoElement)).toBe(true);
  });

  it('requestRemotePlayback prefers the standard remote.prompt when both exist', async () => {
    const prompt = vi.fn().mockResolvedValue(undefined);
    const picker = vi.fn();
    const video = document.createElement('video') as unknown as {
      remote: { prompt: () => Promise<void> };
      webkitShowPlaybackTargetPicker: () => void;
    };
    video.remote = { prompt };
    video.webkitShowPlaybackTargetPicker = picker;

    await requestRemotePlayback(video as unknown as HTMLVideoElement);

    expect(prompt).toHaveBeenCalledTimes(1);
    expect(picker).not.toHaveBeenCalled();
  });

  it('requestRemotePlayback falls back to the AirPlay picker', async () => {
    const picker = vi.fn();
    const video = document.createElement('video') as unknown as { webkitShowPlaybackTargetPicker: () => void };
    video.webkitShowPlaybackTargetPicker = picker;

    await requestRemotePlayback(video as unknown as HTMLVideoElement);

    expect(picker).toHaveBeenCalledTimes(1);
  });

  it('requestRemotePlayback rejects when neither API is available', async () => {
    const video = document.createElement('video');
    await expect(requestRemotePlayback(video)).rejects.toThrow();
  });
});

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  player.listenEvent();
  return player;
};

describe('r-player cast/AirPlay button', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('hides the remote button when unsupported and shows it when supported', () => {
    const unsupported = makePlayer();
    unsupported.syncRemoteButtonVisibility();
    expect(
      unsupported._playControllerBottomRemote.classList.contains('ran-player-controller-bottom-right-remote-hidden'),
    ).toBe(true);

    const supported = makePlayer();
    (supported._video as unknown as { remote: { prompt: () => Promise<void> } }).remote = {
      prompt: vi.fn().mockResolvedValue(undefined),
    };
    supported.syncRemoteButtonVisibility();
    expect(
      supported._playControllerBottomRemote.classList.contains('ran-player-controller-bottom-right-remote-hidden'),
    ).toBe(false);
  });

  it('clicking the remote button opens the picker', () => {
    const player = makePlayer();
    const prompt = vi.fn().mockResolvedValue(undefined);
    (player._video as unknown as { remote: { prompt: () => Promise<void> } }).remote = { prompt };

    player._playControllerBottomRemote.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it('shows the button after a real connect in a supporting browser — no manual re-sync', () => {
    // Regression test: connectedCallback() used to call syncRemoteButtonVisibility()
    // before updatePlayer() had created `_video`, so isRemotePlaybackSupported(undefined)
    // always returned false and the button stayed hidden forever, even here where the
    // browser genuinely supports it. Stubbing the prototype (not an instance) and never
    // calling syncRemoteButtonVisibility() by hand is what makes this exercise the real
    // connectedCallback lifecycle instead of masking the ordering bug.
    const original = Object.getOwnPropertyDescriptor(HTMLVideoElement.prototype, 'remote');
    Object.defineProperty(HTMLVideoElement.prototype, 'remote', {
      configurable: true,
      get: () => ({ prompt: vi.fn().mockResolvedValue(undefined) }),
    });
    try {
      const player = document.createElement('r-player') as any;
      document.body.appendChild(player);

      expect(
        player._playControllerBottomRemote.classList.contains('ran-player-controller-bottom-right-remote-hidden'),
      ).toBe(false);
    } finally {
      if (original) {
        Object.defineProperty(HTMLVideoElement.prototype, 'remote', original);
      } else {
        delete (HTMLVideoElement.prototype as any).remote;
      }
    }
  });
});
