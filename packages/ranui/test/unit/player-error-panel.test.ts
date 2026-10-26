import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

const makePlayer = (): any => {
  const player = document.createElement('r-player') as any;
  document.body.appendChild(player);
  player._video = document.createElement('video');
  player.listenEvent();
  return player;
};

/** What a viewer sees and a screen reader hears from the inline error panel. */
const panel = (player: any) => {
  const root = player._shadowDom as ShadowRoot;
  const element = root.querySelector('[part="error"]') as HTMLElement;
  return {
    shown: !element.hidden,
    title: root.querySelector('.ran-player-error-title')!.textContent,
    message: root.querySelector('.ran-player-error-message')!.textContent,
    retry: root.querySelector('[part="error-retry"]') as HTMLButtonElement,
    announced: root.querySelector('[aria-live="polite"]')!.textContent,
  };
};

describe('r-player inline playback error', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('shows the error on the player itself for a fatal hls error, and announces it once', () => {
    const player = makePlayer();
    player.hlsError({ fatal: true, detail: { details: 'bufferStalledError' } });
    const view = panel(player);
    expect(view.shown).toBe(true);
    expect(view.title).toBe('Playback failed');
    expect(view.retry.textContent).toBe('Retry');
    expect(view.announced).toContain('Playback failed');
    expect(document.querySelector('r-modal')).toBeNull();
  });

  it('stays hidden for a non-fatal hls error', () => {
    const player = makePlayer();
    player.hlsError({ fatal: false, detail: { details: 'bufferSeekOverHole' } });
    expect(panel(player).shown).toBe(false);
  });

  it('explains a native media error by its code', () => {
    const player = makePlayer();
    Object.defineProperty(player._video, 'error', { value: { code: 4 }, configurable: true });
    player._video.dispatchEvent(new Event('error'));
    expect(panel(player).message).toBe('This video format or source is not supported.');
  });

  it('stays hidden when disable-error-modal is set', () => {
    const player = makePlayer();
    player.setAttribute('disable-error-modal', '');
    player.hlsError({ fatal: true, detail: {} });
    expect(panel(player).shown).toBe(false);
  });

  it('takes its heading and button from label-error and label-retry', () => {
    const player = makePlayer();
    player.setAttribute('label-error', '播放失败');
    player.setAttribute('label-retry', '重试');
    player.hlsError({ fatal: true, detail: {} });
    expect(panel(player)).toMatchObject({ title: '播放失败', announced: expect.stringContaining('播放失败') });
    expect(panel(player).retry.textContent).toBe('重试');
  });

  it('retry hides the panel, clears the announcement and reloads the player', () => {
    const player = makePlayer();
    const updateSpy = vi.spyOn(player, 'updatePlayer').mockImplementation(() => undefined);
    player.hlsError({ fatal: true, detail: {} });
    panel(player).retry.click();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(panel(player)).toMatchObject({ shown: false, announced: '' });
  });

  it('a second error while one is showing does not replace it', () => {
    const player = makePlayer();
    player.hlsError({ fatal: true, detail: { details: 'first' } });
    const first = panel(player).message;
    Object.defineProperty(player._video, 'error', { value: { code: 4 }, configurable: true });
    player._video.dispatchEvent(new Event('error'));
    expect(panel(player).message).toBe(first);
  });
});
