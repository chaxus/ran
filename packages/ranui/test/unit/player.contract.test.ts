import { beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDuration } from 'ranuts/utils';
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

  it('exposes the seek bar as an ARIA slider with a live value, not just a bare role', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    expect(player._progress.getAttribute('role')).toBe('slider');
    expect(player._progress.getAttribute('tabindex')).toBe('0');
    expect(player._progress.getAttribute('aria-valuemin')).toBe('0');
    expect(player._progress.getAttribute('aria-valuemax')).toBe('100');

    player.ctx.duration = 120;
    player.syncProgressByPercentage(0.25);
    expect(player._progress.getAttribute('aria-valuenow')).toBe('25');
    expect(player._progress.getAttribute('aria-valuetext')).toBe(formatDuration(30));
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
      volume: 70,
      shouldResume: true,
    };

    player._pendingPlaybackRestore = snapshot;
    player._video.dispatchEvent(new Event('loadedmetadata'));

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

    player._video.dispatchEvent(new Event('waiting'));

    expect(setLoadingStateSpy).toHaveBeenCalledWith(true);
  });

  it('keeps snapshot progress/time on loadeddata during source switch', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    player._isSwitchingSource = true;
    player._pendingPlaybackRestore = {
      currentTime: 42,
      playbackRate: 1,
      volume: 50,
      shouldResume: true,
    };
    vi.spyOn(player, 'getTotalTime').mockReturnValue(100);

    player._video.dispatchEvent(new Event('loadeddata'));

    expect(player._progressWrapValue.style.transform).toBe('scaleX(0.42)');
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
      volume: 50,
      shouldResume: true,
    };

    const getCurrentTimeSpy = vi.spyOn(player, 'getCurrentTime');

    player.updateCurrentProgress();

    expect(player._progressWrapValue.style.transform).toBe('scaleX(0.5)');
    expect(getCurrentTimeSpy).not.toHaveBeenCalled();
  });

  it('destroys hls instance and clears media listeners when disconnected', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);

    const video = document.createElement('video');
    const removeSpy = vi.spyOn(video, 'removeEventListener');
    const destroySpy = vi.fn();

    player._video = video;
    player._engine = {
      destroy: destroySpy,
      setQuality: vi.fn(),
      getQualityLevels: vi.fn(() => []),
      on: vi.fn(),
      load: vi.fn(),
      reloadsOnQualityChange: true,
    };

    document.body.removeChild(player);

    expect(removeSpy).toHaveBeenCalled();
    expect(destroySpy).toHaveBeenCalledTimes(1);
    expect(player._engine).toBeUndefined();
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

  it('updates clarity state when levels become available', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    const createClaritySpy = vi.spyOn(player, 'createClaritySelect').mockImplementation(() => undefined);
    const changeSpy = vi.spyOn(player, 'change').mockImplementation(() => undefined);

    player.manifestLoaded([
      { id: 'https://cdn.example.com/720.m3u8', name: '720p', height: 720 },
      { id: 'https://cdn.example.com/480.m3u8', name: '480k', bitrate: 480_000 },
      { id: 'https://cdn.example.com/master.m3u8', name: 'Auto' },
    ]);

    expect(player.ctx.levels.map((item: { name: string }) => item.name)).toEqual(['720p', '480k', 'Auto']);
    expect(player.ctx.levelMap.get('720p')).toBe('https://cdn.example.com/720.m3u8');
    expect(player.ctx.levelMap.get('Auto')).toBe('https://cdn.example.com/master.m3u8');
    expect(createClaritySpy).toHaveBeenCalled();
    expect(changeSpy).toHaveBeenCalledWith('levelsready', expect.any(Object));
  });

  it('switches clarity by preserving playback state and setting the selected quality', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    const snapshot = { currentTime: 12, playbackRate: 1.25, volume: 60, shouldResume: true };
    const engine = {
      destroy: vi.fn(),
      setQuality: vi.fn(),
      getQualityLevels: vi.fn(() => []),
      on: vi.fn(),
      load: vi.fn(),
      reloadsOnQualityChange: true,
    };
    player.ctx.levelMap.set('720p', 'https://cdn.example.com/720.m3u8');
    player._engine = engine;
    vi.spyOn(player, 'capturePlaybackSnapshot').mockReturnValue(snapshot);
    const loadingSpy = vi.spyOn(player, 'setLoadingState');

    player.changeClarity(new CustomEvent('change', { detail: { value: '720p' } }));

    expect(player.ctx.clarity).toBe('720p');
    expect(player._pendingPlaybackRestore).toBe(snapshot);
    expect(player._isSwitchingSource).toBe(true);
    expect(loadingSpy).toHaveBeenCalledWith(true);
    expect(engine.setQuality).toHaveBeenCalledWith('https://cdn.example.com/720.m3u8');
  });

  it('does not run the reload dance when the engine does not reload on quality change', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    const engine = {
      destroy: vi.fn(),
      setQuality: vi.fn(),
      getQualityLevels: vi.fn(() => []),
      on: vi.fn(),
      load: vi.fn(),
      reloadsOnQualityChange: false,
    };
    player.ctx.levelMap.set('720p', 'dash-quality-0');
    player._engine = engine;
    const loadingSpy = vi.spyOn(player, 'setLoadingState');

    player.changeClarity(new CustomEvent('change', { detail: { value: '720p' } }));

    expect(player._isSwitchingSource).toBe(false);
    expect(player._pendingPlaybackRestore).toBeUndefined();
    expect(loadingSpy).not.toHaveBeenCalled();
    expect(engine.setQuality).toHaveBeenCalledWith('dash-quality-0');
  });

  it('falls back to native src and emits sourceerror when the engine fails', () => {
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

    player.hlsError({ fatal: true, detail: 'error-event' });

    expect(player._isSwitchingSource).toBe(false);
    expect(player._player.classList.contains('ran-player-buffering')).toBe(false);
    expect(player._video.src).toContain('https://cdn.example.com/fallback.mp4');
    expect(detail.type).toBe('sourceerror');
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

    player._playControllerBottomSpeedPopover.dispatchEvent(new CustomEvent('change', { detail: { value: '1.5' } }));

    expect(player.ctx.playbackRate).toBe(1.5);
    expect(player._video.playbackRate).toBe(1.5);
    expect(safePlaySpy).toHaveBeenCalledWith(false);
  });

  it('updates volume from volume progress changes and remembers non-zero volume', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player._video = document.createElement('video');
    player._video.volume = 0.5;

    player._playControllerBottomVolumeProgress.dispatchEvent(new CustomEvent('change', { detail: { value: 80 } }));

    expect(player.ctx.volume).toBe(80);
    expect(player._video.volume).toBe(0.8);
    expect(player._volume).toBe(80);
  });

  it('toggles mute and restores the remembered volume', () => {
    const player = document.createElement('r-player') as any;
    document.body.appendChild(player);
    player._video = document.createElement('video');
    player._video.volume = 0.75;
    player.ctx.volume = 75;
    player._volume = 75;

    player._playControllerBottomVolumeIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(player.ctx.volume).toBe(0);
    expect(player._playControllerBottomVolumeProgress.getAttribute('percent')).toBe('0');
    expect(player._playControllerBottomVolumeIcon.querySelector('r-icon')?.getAttribute('name')).toBe('volume-mute');

    player._playControllerBottomVolumeIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(player.ctx.volume).toBe(75);
    expect(player._video.volume).toBe(0.75);
    expect(player._playControllerBottomVolumeProgress.getAttribute('percent')).toBe('75');
    expect(player._playControllerBottomVolumeIcon.querySelector('r-icon')?.getAttribute('name')).toBe('volume');
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
