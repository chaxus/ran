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
    const safePlaySpy = vi.spyOn(player, 'safePlay').mockImplementation(() => undefined);
    const rafSpy = vi.spyOn(player, 'requestAnimationFrame').mockImplementation(() => undefined);

    document.dispatchEvent(new MouseEvent('mouseup'));

    expect(setCurrentTimeSpy).toHaveBeenCalledWith(30);
    expect(safePlaySpy).toHaveBeenCalled();
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

  it('falls back to native src when Hls is unavailable', () => {
    const originalHls = (window as any).Hls;
    (window as any).Hls = undefined;

    const player = document.createElement('r-player') as any;
    player.setAttribute('src', 'https://example.com/video.mp4');
    document.body.appendChild(player);
    player.updatePlayer();

    expect(player._video.src).toContain('https://example.com/video.mp4');

    (window as any).Hls = originalHls;
  });

  it('forces loading state while source is switching', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player._isSwitchingSource = true;
    const setLoadingStateSpy = vi.spyOn(player, 'setLoadingState');

    player.onWaiting(new Event('waiting'));

    expect(setLoadingStateSpy).toHaveBeenCalledWith(true);
  });

  it('keeps snapshot progress/time on loadeddata during source switch', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player._isSwitchingSource = true;
    player._pendingPlaybackRestore = {
      currentTime: 42,
      playbackRate: 1,
      volume: 0.5,
      shouldResume: true,
    };
    vi.spyOn(player, 'getTotalTime').mockReturnValue(100);
    const syncProgressSpy = vi.spyOn(player, 'syncProgressByPercentage');

    player.onLoadeddata(new Event('loadeddata'));

    expect(syncProgressSpy).toHaveBeenCalledWith(0.42);
    expect(player._playerControllerBottomTimeCurrent.innerText).toBe('00:42');
  });

  it('freezes progress rendering while source is switching', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player.ctx.duration = 100;
    player._isSwitchingSource = true;
    player._pendingPlaybackRestore = {
      currentTime: 50,
      playbackRate: 1,
      volume: 0.5,
      shouldResume: true,
    };

    const syncProgressSpy = vi.spyOn(player, 'syncProgressByPercentage');
    const getCurrentTimeSpy = vi.spyOn(player, 'getCurrentTime');

    player.updateCurrentProgress();

    expect(syncProgressSpy).toHaveBeenCalledWith(0.5);
    expect(getCurrentTimeSpy).not.toHaveBeenCalled();
  });
});
