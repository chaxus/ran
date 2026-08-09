import { beforeEach, describe, expect, it, vi } from 'vitest';
import { exitPip, isInPip, isPipSupported, requestPip } from '@/components/player/core/pip';
import '@/components/player';

const withPipEnabled = (enabled: boolean, fn: () => void): void => {
  const original = Object.getOwnPropertyDescriptor(document, 'pictureInPictureEnabled');
  Object.defineProperty(document, 'pictureInPictureEnabled', { value: enabled, configurable: true });
  try {
    fn();
  } finally {
    if (original) Object.defineProperty(document, 'pictureInPictureEnabled', original);
  }
};

describe('core/pip pure functions', () => {
  it('isPipSupported reflects document.pictureInPictureEnabled', () => {
    withPipEnabled(true, () => expect(isPipSupported()).toBe(true));
    withPipEnabled(false, () => expect(isPipSupported()).toBe(false));
  });

  it('isPipSupported is false when the video opts out via disablePictureInPicture', () => {
    withPipEnabled(true, () => {
      const video = document.createElement('video');
      video.disablePictureInPicture = true;
      expect(isPipSupported(video)).toBe(false);
    });
  });

  it('isInPip compares document.pictureInPictureElement against the given video', () => {
    const video = document.createElement('video');
    expect(isInPip(video)).toBe(false);
    Object.defineProperty(document, 'pictureInPictureElement', { value: video, configurable: true });
    expect(isInPip(video)).toBe(true);
    Object.defineProperty(document, 'pictureInPictureElement', { value: null, configurable: true });
  });

  it('requestPip delegates to video.requestPictureInPicture', () => {
    const video = document.createElement('video');
    const spy = vi.fn().mockResolvedValue({});
    video.requestPictureInPicture = spy;
    requestPip(video);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('exitPip delegates to document.exitPictureInPicture only when a PiP element exists', async () => {
    const spy = vi.fn().mockResolvedValue(undefined);
    document.exitPictureInPicture = spy;
    Object.defineProperty(document, 'pictureInPictureElement', { value: null, configurable: true });
    await exitPip();
    expect(spy).not.toHaveBeenCalled();

    const video = document.createElement('video');
    Object.defineProperty(document, 'pictureInPictureElement', { value: video, configurable: true });
    await exitPip();
    expect(spy).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'pictureInPictureElement', { value: null, configurable: true });
  });
});

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  player.listenEvent();
  return player;
};

describe('r-player picture-in-picture', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('hides the PiP button when unsupported and shows it when supported', () => {
    withPipEnabled(false, () => {
      const player = makePlayer();
      player.syncPipButtonVisibility();
      expect(player._playControllerBottomPip.classList.contains('ran-player-controller-bottom-right-pip-hidden')).toBe(
        true,
      );
    });
    withPipEnabled(true, () => {
      const player = makePlayer();
      player.syncPipButtonVisibility();
      expect(player._playControllerBottomPip.classList.contains('ran-player-controller-bottom-right-pip-hidden')).toBe(
        false,
      );
    });
  });

  it('togglePip requests picture-in-picture when not already in it', () => {
    const player = makePlayer();
    const requestSpy = vi.fn().mockResolvedValue({});
    player._video.requestPictureInPicture = requestSpy;
    Object.defineProperty(document, 'pictureInPictureElement', { value: null, configurable: true });

    player._playControllerBottomPip.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(requestSpy).toHaveBeenCalledTimes(1);
  });

  it('togglePip exits picture-in-picture when the player is already the PiP element', () => {
    const player = makePlayer();
    const exitSpy = vi.fn().mockResolvedValue(undefined);
    document.exitPictureInPicture = exitSpy;
    Object.defineProperty(document, 'pictureInPictureElement', { value: player._video, configurable: true });

    player.togglePip();

    expect(exitSpy).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'pictureInPictureElement', { value: null, configurable: true });
  });

  it('emits a pictureinpicture change event on enter/leave from the native video events', () => {
    const player = makePlayer();
    const seen: Array<{ type: string; data: unknown }> = [];
    player.addEventListener('change', (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail.type === 'pictureinpicture') seen.push({ type: detail.type, data: detail.data });
    });

    player._video.dispatchEvent(new Event('enterpictureinpicture'));
    player._video.dispatchEvent(new Event('leavepictureinpicture'));

    expect(seen).toEqual([
      { type: 'pictureinpicture', data: true },
      { type: 'pictureinpicture', data: false },
    ]);
  });
});
