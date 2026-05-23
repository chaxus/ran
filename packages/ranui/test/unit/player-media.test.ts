import { describe, expect, it, vi } from 'vitest';
import { bindMediaEvents, unbindMediaEvents, loadVideoSource } from '@/components/player/core/media';
import type { PlayerMediaHandlers, HlsPlayerLike, HlsLikeStatic } from '@/components/player/core/media';

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
});

describe('bindMediaEvents / unbindMediaEvents', () => {
  it('registers all 22 media event listeners on the video element', () => {
    const video = document.createElement('video');
    const addSpy = vi.spyOn(video, 'addEventListener');
    const handlers = makeHandlers();
    bindMediaEvents(video, handlers);
    expect(addSpy).toHaveBeenCalledTimes(22);
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

  it('removes all 22 media event listeners', () => {
    const video = document.createElement('video');
    const removeSpy = vi.spyOn(video, 'removeEventListener');
    const handlers = makeHandlers();
    unbindMediaEvents(video, handlers);
    expect(removeSpy).toHaveBeenCalledTimes(22);
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
    ];

    for (const [event, handler] of pairs) {
      video.dispatchEvent(new Event(event));
      expect(handlers[handler]).toHaveBeenCalledTimes(1);
    }
  });
});

describe('loadVideoSource', () => {
  it('destroys existingHls when provided', () => {
    const video = document.createElement('video');
    const existingHls: HlsPlayerLike = {
      destroy: vi.fn(),
      startLoad: vi.fn() as any,
      off: vi.fn(),
      on: vi.fn(),
      loadSource: vi.fn(),
      attachMedia: vi.fn(),
    };
    loadVideoSource({ video, src: '', existingHls, onManifestLoaded: vi.fn(), onHlsError: vi.fn() });
    expect(existingHls.destroy).toHaveBeenCalledTimes(1);
  });

  it('creates HLS instance and attaches when Hls.isSupported() is true and src is set', () => {
    const video = document.createElement('video');
    const hlsInstance: HlsPlayerLike = {
      destroy: vi.fn(),
      startLoad: vi.fn() as any,
      off: vi.fn(),
      on: vi.fn(),
      loadSource: vi.fn(),
      attachMedia: vi.fn(),
    };
    const onManifestLoaded = vi.fn();
    const onHlsError = vi.fn();
    function MockHls() { return hlsInstance; }
    (MockHls as any).isSupported = () => true;
    (MockHls as any).Events = { MANIFEST_LOADED: 'manifestLoaded', ERROR: 'hlsError' };
    const Hls = MockHls as unknown as HlsLikeStatic<HlsPlayerLike>;

    const result = loadVideoSource({ video, src: 'test.m3u8', Hls, onManifestLoaded, onHlsError });

    expect(hlsInstance.loadSource).toHaveBeenCalledWith('test.m3u8');
    expect(hlsInstance.attachMedia).toHaveBeenCalledWith(video);
    expect(hlsInstance.on).toHaveBeenCalledWith('manifestLoaded', onManifestLoaded);
    expect(hlsInstance.on).toHaveBeenCalledWith('hlsError', onHlsError);
    expect(hlsInstance.off).toHaveBeenCalledWith('manifestLoaded', onManifestLoaded);
    expect(hlsInstance.off).toHaveBeenCalledWith('hlsError', onHlsError);
    expect(result).toBe(hlsInstance);
  });

  it('falls back to video.src when Hls is not supported', () => {
    const video = document.createElement('video');
    const Hls = vi.fn() as unknown as HlsLikeStatic<HlsPlayerLike>;
    (Hls as any).isSupported = vi.fn(() => false);
    (Hls as any).Events = { MANIFEST_LOADED: 'manifestLoaded', ERROR: 'hlsError' };

    const result = loadVideoSource({ video, src: 'video.mp4', Hls, onManifestLoaded: vi.fn(), onHlsError: vi.fn() });
    expect(video.src).toContain('video.mp4');
    expect(result).toBeUndefined();
  });

  it('falls back to video.src when Hls is undefined', () => {
    const video = document.createElement('video');
    const result = loadVideoSource({ video, src: 'video.mp4', onManifestLoaded: vi.fn(), onHlsError: vi.fn() });
    expect(video.src).toContain('video.mp4');
    expect(result).toBeUndefined();
  });

  it('does not set video.src when src is empty and no Hls', () => {
    const video = document.createElement('video');
    const result = loadVideoSource({ video, src: '', onManifestLoaded: vi.fn(), onHlsError: vi.fn() });
    expect(video.src).toBe('');
    expect(result).toBeUndefined();
  });

  it('falls back to native src when HLS constructor throws', () => {
    const video = document.createElement('video');
    function ThrowingHls() { throw new Error('HLS init failed'); }
    (ThrowingHls as any).isSupported = () => true;
    (ThrowingHls as any).Events = { MANIFEST_LOADED: 'manifestLoaded', ERROR: 'hlsError' };
    const Hls = ThrowingHls as unknown as HlsLikeStatic<HlsPlayerLike>;

    const result = loadVideoSource({ video, src: 'stream.m3u8', Hls, onManifestLoaded: vi.fn(), onHlsError: vi.fn() });
    expect(video.src).toContain('stream.m3u8');
    expect(result).toBeUndefined();
  });

  it('destroys existingHls before creating a new HLS instance', () => {
    const video = document.createElement('video');
    const existingHls: HlsPlayerLike = {
      destroy: vi.fn(),
      startLoad: vi.fn() as any,
      off: vi.fn(),
      on: vi.fn(),
      loadSource: vi.fn(),
      attachMedia: vi.fn(),
    };
    const newHlsInstance: HlsPlayerLike = {
      destroy: vi.fn(),
      startLoad: vi.fn() as any,
      off: vi.fn(),
      on: vi.fn(),
      loadSource: vi.fn(),
      attachMedia: vi.fn(),
    };
    function NewMockHls() { return newHlsInstance; }
    (NewMockHls as any).isSupported = () => true;
    (NewMockHls as any).Events = { MANIFEST_LOADED: 'manifestLoaded', ERROR: 'hlsError' };
    const Hls = NewMockHls as unknown as HlsLikeStatic<HlsPlayerLike>;

    const result = loadVideoSource({ video, src: 'new.m3u8', Hls, existingHls, onManifestLoaded: vi.fn(), onHlsError: vi.fn() });
    expect(existingHls.destroy).toHaveBeenCalledTimes(1);
    expect(result).toBe(newHlsInstance);
  });
});
