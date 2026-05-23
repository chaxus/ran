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

  it('destroys hls instance and clears media listeners when disconnected', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    const video = document.createElement('video');
    const removeSpy = vi.spyOn(video, 'removeEventListener');
    const destroySpy = vi.fn();

    player._video = video;
    player._hls = { destroy: destroySpy };

    document.body.removeChild(player);

    expect(removeSpy).toHaveBeenCalled();
    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(player._hls).toBeUndefined();
  });

  it('syncs currentTime and playbackRate attribute changes to the video element', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player._video = document.createElement('video');

    player.setAttribute('currentTime', '25');
    player.setAttribute('playbackRate', '1.5');

    expect(player._video.currentTime).toBe(25);
    expect(player.ctx.currentTime).toBe(25);
    expect(player._video.playbackRate).toBe(1.5);
    expect(player.ctx.playbackRate).toBe(1.5);
  });

  it('normalizes manifest levels and updates clarity state', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    const createClaritySpy = vi.spyOn(player, 'createClaritySelect').mockImplementation(() => undefined);
    const changeSpy = vi.spyOn(player, 'change').mockImplementation(() => undefined);

    player.manifestLoaded('hlsManifestLoaded', {
      url: 'https://cdn.example.com/master.m3u8',
      levels: [
        { height: 720, url: 'https://cdn.example.com/720.m3u8' },
        { bitrate: 480_000, url: 'https://cdn.example.com/480.m3u8' },
      ],
    });

    expect(player.ctx.levels.map((item: { name: string }) => item.name)).toEqual(['720p', '480k', 'Auto']);
    expect(player.ctx.levelMap.get('720p')).toBe('https://cdn.example.com/720.m3u8');
    expect(player.ctx.levelMap.get('Auto')).toBe('https://cdn.example.com/master.m3u8');
    expect(createClaritySpy).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalledWith('hlsManifestLoaded', expect.any(Object));
  });

  it('switches clarity by preserving playback state and loading the selected URL', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    const snapshot = { currentTime: 12, playbackRate: 1.25, volume: 0.6, shouldResume: true };
    const hls = { destroy: vi.fn(), loadSource: vi.fn(), startLoad: vi.fn() };
    player.ctx.levelMap.set('720p', 'https://cdn.example.com/720.m3u8');
    player._hls = hls;
    vi.spyOn(player, 'capturePlaybackSnapshot').mockReturnValue(snapshot);
    const loadingSpy = vi.spyOn(player, 'setLoadingState');

    player.changeClarity(new CustomEvent('change', { detail: { value: '720p' } }));

    expect(player.ctx.clarity).toBe('720p');
    expect(player._pendingPlaybackRestore).toBe(snapshot);
    expect(player._isSwitchingSource).toBe(true);
    expect(loadingSpy).toHaveBeenCalledWith(true);
    expect(hls.loadSource).toHaveBeenCalledWith('https://cdn.example.com/720.m3u8');
    expect(hls.startLoad).toHaveBeenCalled();
  });

  it('falls back to native src and emits hlsError when hls fails', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player.setAttribute('src', 'https://cdn.example.com/fallback.mp4');
    player._video = document.createElement('video');
    player._isSwitchingSource = true;
    player.setLoadingState(true);
    let detail: any;
    player.addEventListener('change', (event: Event) => {
      detail = (event as CustomEvent).detail;
    });

    player.hlsError('error-event', { fatal: true });

    expect(player._isSwitchingSource).toBe(false);
    expect(player._player.classList.contains('ran-player-buffering')).toBe(false);
    expect(player._video.src).toContain('https://cdn.example.com/fallback.mp4');
    expect(detail.type).toBe('hlsError');
  });

  it('updates playback rate and resumes when changing speed while playing', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    const video = document.createElement('video');
    Object.defineProperty(video, 'paused', { value: false, configurable: true });
    Object.defineProperty(video, 'ended', { value: false, configurable: true });
    vi.spyOn(video, 'play').mockReturnValue(Promise.resolve() as any);
    player._video = video;
    const safePlaySpy = vi.spyOn(player, 'safePlay');

    player.changeSpeed(new CustomEvent('change', { detail: { value: '1.5' } }));

    expect(player.ctx.playbackRate).toBe(1.5);
    expect(player._video.playbackRate).toBe(1.5);
    expect(safePlaySpy).toHaveBeenCalledWith(false);
  });

  it('updates volume from volume progress changes and remembers non-zero volume', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player._video = document.createElement('video');
    player._video.volume = 0.5;

    player.changeVolumeProgress(new CustomEvent('change', { detail: { value: 80 } }));

    expect(player.ctx.volume).toBe(0.8);
    expect(player._video.volume).toBe(0.8);
    expect(player._volume).toBe(0.8);
  });

  it('toggles mute and restores the remembered volume', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player._video = document.createElement('video');
    player._video.volume = 0.75;
    player.ctx.volume = 0.75;
    player._volume = 0.75;

    player.changePlayerVolume();
    expect(player.ctx.volume).toBe(0);
    expect(player._playControllerBottomVolumeProgress.getAttribute('percent')).toBe('0');

    player.changePlayerVolume();
    expect(player.ctx.volume).toBe(0.75);
    expect(player._video.volume).toBe(0.75);
    expect(player._playControllerBottomVolumeProgress.getAttribute('percent')).toBe('0.75');
  });

  it('seeks by normalized percentage using available duration', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player._video = document.createElement('video');
    Object.defineProperty(player._video, 'duration', { value: 200, configurable: true });

    player.seekToPercentage(0.25);

    expect(player._video.currentTime).toBe(50);
    expect(player.ctx.currentTime).toBe(50);
  });
});
