import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/player';

describe('r-player contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('recovers drag state when mouseup happens on document', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player.ctx.duration = 120;
    player.moveProgress.mouseDown = true;
    player.moveProgress.percentage = 0.25;
    player._wasPlayingBeforeSeek = true;

    const setCurrentTimeSpy = vi.spyOn(player, 'setCurrentTime');
    const playSpy = vi.spyOn(player, 'play').mockImplementation(() => undefined);
    const rafSpy = vi.spyOn(player, 'requestAnimationFrame').mockImplementation(() => undefined);

    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(setCurrentTimeSpy).toHaveBeenCalledWith(30);
    expect(playSpy).toHaveBeenCalled();
    expect(rafSpy).toHaveBeenCalled();
    expect(player.moveProgress.mouseDown).toBe(false);
  });

  it('keeps paused state after drag seek when video was paused', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player.ctx.duration = 120;
    player.moveProgress.mouseDown = true;
    player.moveProgress.percentage = 0.5;
    player._wasPlayingBeforeSeek = false;

    const playSpy = vi.spyOn(player, 'play').mockImplementation(() => undefined);
    const pauseSpy = vi.spyOn(player, 'pause').mockImplementation(() => undefined);

    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(playSpy).not.toHaveBeenCalled();
    expect(pauseSpy).toHaveBeenCalled();
    expect(player.moveProgress.mouseDown).toBe(false);
  });

  it('updates buffered track from buffered ranges', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player._video = {
      duration: 100,
      currentTime: 30,
      buffered: {
        length: 2,
        start: (index: number) => (index === 0 ? 0 : 20),
        end: (index: number) => (index === 0 ? 10 : 60),
      },
    };

    player.updateBufferedProgress();

    expect(player._progressWrapBuffer.style.transform).toBe('scaleX(0.6)');
  });

  it('restores playback snapshot on loadedmetadata after quality switch', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    const restoreSpy = vi.spyOn(player, 'restorePlaybackSnapshot');
    const snapshot = {
      currentTime: 15,
      playbackRate: 1.5,
      volume: 0.7,
      shouldResume: true,
    };

    player._pendingPlaybackRestore = snapshot;
    player.onLoadedmetadata(new Event('loadedmetadata'));

    expect(restoreSpy).toHaveBeenCalledWith(snapshot);
    expect(player._pendingPlaybackRestore).toBeUndefined();
  });
});
