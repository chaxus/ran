import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createHlsAdapter } from '@/components/player/core/adapters/hls';

const handlers: Record<string, Function> = {};
const instances: MockHlsInstance[] = [];

class MockHlsInstance {
  destroy = vi.fn();
  loadSource = vi.fn();
  attachMedia = vi.fn();
  startLoad = vi.fn();
  on = vi.fn((event: string, handler: Function) => {
    handlers[event] = handler;
  });
  off = vi.fn();
  constructor() {
    instances.push(this);
  }
}

let supported = true;

vi.mock('hls.js', () => {
  class MockHls extends MockHlsInstance {
    static isSupported = (): boolean => supported;
    static Events = { MANIFEST_LOADED: 'hlsManifestLoaded', ERROR: 'hlsError' };
  }
  return { default: MockHls };
});

describe('createHlsAdapter', () => {
  beforeEach(() => {
    instances.length = 0;
    supported = true;
    Object.keys(handlers).forEach((key) => delete handlers[key]);
  });

  it('reloadsOnQualityChange is true', () => {
    expect(createHlsAdapter().reloadsOnQualityChange).toBe(true);
  });

  it('load() attaches hls.js to the video and loads the source', async () => {
    const adapter = createHlsAdapter();
    const video = document.createElement('video');

    await adapter.load(video, 'https://cdn.example.com/master.m3u8');

    expect(instances).toHaveLength(1);
    expect(instances[0].loadSource).toHaveBeenCalledWith('https://cdn.example.com/master.m3u8');
    expect(instances[0].attachMedia).toHaveBeenCalledWith(video);
  });

  it('falls back to video.src when Hls.isSupported() is false', async () => {
    supported = false;
    const adapter = createHlsAdapter();
    const video = document.createElement('video');

    await adapter.load(video, 'https://cdn.example.com/master.m3u8');

    expect(instances).toHaveLength(0);
    expect(video.src).toContain('master.m3u8');
  });

  it('emits levelsready with deduped levels + a synthesized Auto entry on MANIFEST_LOADED', async () => {
    const adapter = createHlsAdapter();
    const video = document.createElement('video');
    const onLevelsReady = vi.fn();
    adapter.on('levelsready', onLevelsReady);

    await adapter.load(video, 'https://cdn.example.com/master.m3u8');
    handlers['hlsManifestLoaded']('hlsManifestLoaded', {
      url: 'https://cdn.example.com/master.m3u8',
      levels: [
        { height: 720, url: 'https://cdn.example.com/720.m3u8', bitrate: 2_000_000 },
        { bitrate: 480_000, url: 'https://cdn.example.com/480.m3u8' },
      ],
    });

    expect(onLevelsReady).toHaveBeenCalledTimes(1);
    const { levels } = onLevelsReady.mock.calls[0][0];
    expect(levels.map((l: { name: string }) => l.name)).toEqual(['720p', '480k', 'Auto']);
    expect(levels.map((l: { id: string }) => l.id)).toEqual([
      'https://cdn.example.com/720.m3u8',
      'https://cdn.example.com/480.m3u8',
      'https://cdn.example.com/master.m3u8',
    ]);
    expect(adapter.getQualityLevels()).toEqual(levels);
  });

  it('emits error with the fatal flag on ERROR', async () => {
    const adapter = createHlsAdapter();
    const video = document.createElement('video');
    const onError = vi.fn();
    adapter.on('error', onError);

    await adapter.load(video, 'https://cdn.example.com/master.m3u8');
    handlers['hlsError']('hlsError', { fatal: true, type: 'networkError' });

    expect(onError).toHaveBeenCalledWith({ fatal: true, detail: { fatal: true, type: 'networkError' } });
  });

  it('setQuality(id) reloads the source and starts loading', async () => {
    const adapter = createHlsAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://cdn.example.com/master.m3u8');

    adapter.setQuality('https://cdn.example.com/720.m3u8');

    expect(instances[0].loadSource).toHaveBeenCalledWith('https://cdn.example.com/720.m3u8');
    expect(instances[0].startLoad).toHaveBeenCalled();
  });

  it('setQuality() before load() is a safe no-op', () => {
    expect(() => createHlsAdapter().setQuality('x')).not.toThrow();
  });

  it('destroy() tears down the underlying hls.js instance', async () => {
    const adapter = createHlsAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://cdn.example.com/master.m3u8');

    adapter.destroy();

    expect(instances[0].destroy).toHaveBeenCalledTimes(1);
  });

  it('destroy() before load() is a safe no-op', () => {
    expect(() => createHlsAdapter().destroy()).not.toThrow();
  });
});
