import { describe, expect, it, vi } from 'vitest';
import { bindMediaEvents, unbindMediaEvents, loadVideoSource } from '@/components/player/core/media';
import type { PlayerMediaHandlers } from '@/components/player/core/media';
import type { EngineAdapter } from '@/components/player/core/adapters/types';

const makeHandlers = (): PlayerMediaHandlers => ({
  onCanplay: vi.fn(),
  onCanplaythrough: vi.fn(),
  onComplete: vi.fn(),
  onDurationchange: vi.fn(),
  onEmptied: vi.fn(),
  onEnded: vi.fn(),
  onError: vi.fn(),
  onLoadeddata: vi.fn(),
  onLoadedmetadata: vi.fn(),
  onLoadstart: vi.fn(),
  onPause: vi.fn(),
  onPlay: vi.fn(),
  onPlaying: vi.fn(),
  onProgress: vi.fn(),
  onRatechange: vi.fn(),
  onSeeked: vi.fn(),
  onSeeking: vi.fn(),
  onStalled: vi.fn(),
  onSuspend: vi.fn(),
  onTimeupdate: vi.fn(),
  onVolumechange: vi.fn(),
  onWaiting: vi.fn(),
  onEnterPictureInPicture: vi.fn(),
  onLeavePictureInPicture: vi.fn(),
});

describe('bindMediaEvents / unbindMediaEvents', () => {
  it('registers all 24 media event listeners on the video element', () => {
    const video = document.createElement('video');
    const addSpy = vi.spyOn(video, 'addEventListener');
    const handlers = makeHandlers();
    bindMediaEvents(video, handlers);
    expect(addSpy).toHaveBeenCalledTimes(24);
  });

  it('dispatches events to the correct handler after bind', () => {
    const video = document.createElement('video');
    const handlers = makeHandlers();
    bindMediaEvents(video, handlers);
    video.dispatchEvent(new Event('play'));
    expect(handlers.onPlay).toHaveBeenCalledTimes(1);
    video.dispatchEvent(new Event('pause'));
    expect(handlers.onPause).toHaveBeenCalledTimes(1);
    video.dispatchEvent(new Event('timeupdate'));
    expect(handlers.onTimeupdate).toHaveBeenCalledTimes(1);
  });

  it('removes all 24 media event listeners', () => {
    const video = document.createElement('video');
    const removeSpy = vi.spyOn(video, 'removeEventListener');
    const handlers = makeHandlers();
    unbindMediaEvents(video, handlers);
    expect(removeSpy).toHaveBeenCalledTimes(24);
  });

  it('handlers are not called after unbind', () => {
    const video = document.createElement('video');
    const handlers = makeHandlers();
    bindMediaEvents(video, handlers);
    unbindMediaEvents(video, handlers);
    video.dispatchEvent(new Event('play'));
    expect(handlers.onPlay).not.toHaveBeenCalled();
  });

  it('all event types fire their corresponding handler', () => {
    const video = document.createElement('video');
    const handlers = makeHandlers();
    bindMediaEvents(video, handlers);

    const pairs: Array<[string, keyof PlayerMediaHandlers]> = [
      ['canplay', 'onCanplay'],
      ['canplaythrough', 'onCanplaythrough'],
      ['complete', 'onComplete'],
      ['durationchange', 'onDurationchange'],
      ['emptied', 'onEmptied'],
      ['ended', 'onEnded'],
      ['error', 'onError'],
      ['loadeddata', 'onLoadeddata'],
      ['loadedmetadata', 'onLoadedmetadata'],
      ['loadstart', 'onLoadstart'],
      ['pause', 'onPause'],
      ['play', 'onPlay'],
      ['playing', 'onPlaying'],
      ['progress', 'onProgress'],
      ['ratechange', 'onRatechange'],
      ['seeked', 'onSeeked'],
      ['seeking', 'onSeeking'],
      ['stalled', 'onStalled'],
      ['suspend', 'onSuspend'],
      ['timeupdate', 'onTimeupdate'],
      ['volumechange', 'onVolumechange'],
      ['waiting', 'onWaiting'],
      ['enterpictureinpicture', 'onEnterPictureInPicture'],
      ['leavepictureinpicture', 'onLeavePictureInPicture'],
    ];

    for (const [event, handler] of pairs) {
      video.dispatchEvent(new Event(event));
      expect(handlers[handler]).toHaveBeenCalledTimes(1);
    }
  });
});

const makeFakeAdapter = (): EngineAdapter => ({
  reloadsOnQualityChange: true,
  load: vi.fn().mockResolvedValue(undefined),
  destroy: vi.fn(),
  getQualityLevels: vi.fn(() => []),
  setQuality: vi.fn(),
  on: vi.fn(),
});

describe('loadVideoSource', () => {
  it('destroys existingEngine when provided', () => {
    const video = document.createElement('video');
    const existingEngine = makeFakeAdapter();
    loadVideoSource({
      video,
      src: '',
      existingEngine,
      onLevelsReady: vi.fn(),
      onEngineError: vi.fn(),
      createEngineAdapter: () => makeFakeAdapter(),
    });
    expect(existingEngine.destroy).toHaveBeenCalledTimes(1);
  });

  it('detects the format, resolves an adapter through the injected factory, and loads it', () => {
    const video = document.createElement('video');
    const adapter = makeFakeAdapter();
    const createEngineAdapter = vi.fn(() => adapter);

    const result = loadVideoSource({
      video,
      src: 'test.m3u8',
      onLevelsReady: vi.fn(),
      onEngineError: vi.fn(),
      createEngineAdapter,
    });

    expect(createEngineAdapter).toHaveBeenCalledWith('hls');
    expect(adapter.on).toHaveBeenCalledWith('levelsready', expect.any(Function));
    expect(adapter.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(adapter.load).toHaveBeenCalledWith(video, 'test.m3u8');
    expect(result).toBe(adapter);
  });

  it('forwards levelsready/error adapter events to onLevelsReady/onEngineError', () => {
    const video = document.createElement('video');
    const handlers = new Map<string, (payload: unknown) => void>();
    const adapter: EngineAdapter = {
      ...makeFakeAdapter(),
      on: vi.fn((event, handler) => handlers.set(event, handler as (payload: unknown) => void)),
    };
    const onLevelsReady = vi.fn();
    const onEngineError = vi.fn();

    loadVideoSource({
      video,
      src: 'test.m3u8',
      onLevelsReady,
      onEngineError,
      createEngineAdapter: () => adapter,
    });

    handlers.get('levelsready')?.({ levels: [{ id: 'a', name: 'a' }] });
    expect(onLevelsReady).toHaveBeenCalledWith([{ id: 'a', name: 'a' }]);
    handlers.get('error')?.({ fatal: true, detail: 'boom' });
    expect(onEngineError).toHaveBeenCalledWith({ fatal: true, detail: 'boom' });
  });

  it('falls back to video.src when the format has no registered adapter', () => {
    const video = document.createElement('video');
    const result = loadVideoSource({
      video,
      src: 'video.mp4',
      onLevelsReady: vi.fn(),
      onEngineError: vi.fn(),
      createEngineAdapter: () => undefined,
    });
    expect(video.src).toContain('video.mp4');
    expect(result).toBeUndefined();
  });

  it('does not set video.src when src is empty', () => {
    const video = document.createElement('video');
    const result = loadVideoSource({
      video,
      src: '',
      onLevelsReady: vi.fn(),
      onEngineError: vi.fn(),
      createEngineAdapter: () => makeFakeAdapter(),
    });
    expect(video.src).toBe('');
    expect(result).toBeUndefined();
  });

  it('resolves the real hls/dash/flv registry by default when no factory is injected', () => {
    const video = document.createElement('video');
    const result = loadVideoSource({ video, src: 'video.mp4', onLevelsReady: vi.fn(), onEngineError: vi.fn() });
    expect(video.src).toContain('video.mp4');
    expect(result).toBeUndefined();
  });
});
