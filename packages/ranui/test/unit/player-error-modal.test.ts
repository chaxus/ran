import { beforeEach, describe, expect, it, vi } from 'vitest';
import Modal from '@/components/modal';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  player.listenEvent();
  return player;
};

describe('r-player error + retry modal', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('shows the error modal for a fatal hls error', async () => {
    const player = makePlayer();
    const errorSpy = vi.spyOn(Modal, 'error').mockResolvedValue({ action: 'dismiss', trigger: 'program' });

    player.hlsError({}, { fatal: true, details: 'bufferStalledError' });
    await Promise.resolve();
    await Promise.resolve();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0]).toMatchObject({ title: 'Playback failed', okText: 'Retry' });
  });

  it('does not show the modal for a non-fatal hls error', async () => {
    const player = makePlayer();
    const errorSpy = vi.spyOn(Modal, 'error').mockResolvedValue({ action: 'dismiss', trigger: 'program' });

    player.hlsError({}, { fatal: false, details: 'bufferSeekOverHole' });
    await Promise.resolve();
    await Promise.resolve();

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('shows the modal for a native media error with a code-derived message', async () => {
    const player = makePlayer();
    const errorSpy = vi.spyOn(Modal, 'error').mockResolvedValue({ action: 'dismiss', trigger: 'program' });
    Object.defineProperty(player._video, 'error', { value: { code: 4 }, configurable: true });

    player._video.dispatchEvent(new Event('error'));
    await Promise.resolve();
    await Promise.resolve();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0]).toMatchObject({ content: 'This video format or source is not supported.' });
  });

  it('does not show the modal when disable-error-modal is set', async () => {
    const player = makePlayer();
    player.setAttribute('disable-error-modal', '');
    const errorSpy = vi.spyOn(Modal, 'error').mockResolvedValue({ action: 'dismiss', trigger: 'program' });

    player.hlsError({}, { fatal: true });
    await Promise.resolve();
    await Promise.resolve();

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('does not stack a second modal while one is already showing', async () => {
    const player = makePlayer();
    const errorSpy = vi.spyOn(Modal, 'error').mockReturnValue(new Promise(() => undefined) as any);

    // The guard (`_isShowingErrorModal`) is set synchronously before the lazy
    // import even starts, so the second call bails out immediately regardless
    // of how far the first call's dynamic import has progressed.
    player.hlsError({}, { fatal: true });
    player.hlsError({}, { fatal: true });
    await Promise.resolve();
    await Promise.resolve();

    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('retrying (onConfirm) resets the guard and reloads the player', async () => {
    const player = makePlayer();
    const updateSpy = vi.spyOn(player, 'updatePlayer').mockImplementation(() => undefined);
    let capturedOnConfirm: (() => unknown) | undefined;
    vi.spyOn(Modal, 'error').mockImplementation((options: any) => {
      capturedOnConfirm = options.onConfirm;
      return Promise.resolve({ action: 'confirm', trigger: 'program' });
    });

    player.hlsError({}, { fatal: true });
    await Promise.resolve();
    await Promise.resolve();

    expect(capturedOnConfirm).toBeInstanceOf(Function);
    capturedOnConfirm?.();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(player._isShowingErrorModal).toBe(false);
  });
});
