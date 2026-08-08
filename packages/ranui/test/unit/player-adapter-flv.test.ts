import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createFlvAdapter } from '@/components/player/core/adapters/flv';

const handlers: Record<string, Function> = {};
let supported = true;

class MockMpegtsPlayer {
  destroy = vi.fn();
  attachMediaElement = vi.fn();
  load = vi.fn();
  on = vi.fn((event: string, handler: Function) => {
    handlers[event] = handler;
  });
}

let instance: MockMpegtsPlayer;
let lastCreatePlayerArgs: unknown;

vi.mock('mpegts.js', () => {
  const mpegts = {
    isSupported: () => supported,
    createPlayer: vi.fn((args: unknown) => {
      lastCreatePlayerArgs = args;
      instance = new MockMpegtsPlayer();
      return instance;
    }),
    Events: { ERROR: 'error' },
  };
  return { default: mpegts };
});

describe('createFlvAdapter', () => {
  beforeEach(() => {
    supported = true;
    lastCreatePlayerArgs = undefined;
    Object.keys(handlers).forEach((key) => delete handlers[key]);
  });

  it('reloadsOnQualityChange is false', () => {
    expect(createFlvAdapter().reloadsOnQualityChange).toBe(false);
  });

  it('getQualityLevels() is always empty — no adapter-level quality concept', () => {
    expect(createFlvAdapter().getQualityLevels()).toEqual([]);
  });

  it('setQuality() is a safe no-op', () => {
    expect(() => createFlvAdapter().setQuality('x')).not.toThrow();
  });

  it('load() creates an mpegts.js player with type "flv" for a .flv source and attaches it', async () => {
    const adapter = createFlvAdapter();
    const video = document.createElement('video');

    await adapter.load(video, 'https://cdn.example.com/live/stream.flv');

    expect(lastCreatePlayerArgs).toEqual({ type: 'flv', isLive: true, url: 'https://cdn.example.com/live/stream.flv' });
    expect(instance.attachMediaElement).toHaveBeenCalledWith(video);
    expect(instance.load).toHaveBeenCalledTimes(1);
  });

  it('load() resolves type "mpegts" for a raw .ts source', async () => {
    const adapter = createFlvAdapter();
    const video = document.createElement('video');

    await adapter.load(video, 'https://cdn.example.com/live/stream.ts?token=abc');

    expect(lastCreatePlayerArgs).toEqual({
      type: 'mpegts',
      isLive: true,
      url: 'https://cdn.example.com/live/stream.ts?token=abc',
    });
  });

  it('falls back to video.src when mpegts.isSupported() is false', async () => {
    supported = false;
    const adapter = createFlvAdapter();
    const video = document.createElement('video');

    await adapter.load(video, 'https://cdn.example.com/live/stream.flv');

    expect(lastCreatePlayerArgs).toBeUndefined();
    expect(video.src).toContain('stream.flv');
  });

  it('emits error with fatal: true on ERROR (mpegts.js has no fatal/non-fatal distinction)', async () => {
    const adapter = createFlvAdapter();
    const video = document.createElement('video');
    const onError = vi.fn();
    adapter.on('error', onError);

    await adapter.load(video, 'https://cdn.example.com/live/stream.flv');
    handlers['error']('NetworkError', 'ConnectingTimeout', { code: 1 });

    expect(onError).toHaveBeenCalledWith({
      fatal: true,
      detail: { errorType: 'NetworkError', errorDetail: 'ConnectingTimeout', errorInfo: { code: 1 } },
    });
  });

  it('destroy() tears down the underlying mpegts.js instance', async () => {
    const adapter = createFlvAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://cdn.example.com/live/stream.flv');

    adapter.destroy();

    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });

  it('destroy() before load() is a safe no-op', () => {
    expect(() => createFlvAdapter().destroy()).not.toThrow();
  });
});
