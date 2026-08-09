import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDashAdapter } from '@/components/player/core/adapters/dash';

const handlers: Record<string, Function> = {};
let representations: Array<{ id: string; bitrateInKbit: number; height: number }> = [];

class MockDashPlayer {
  initialize = vi.fn();
  destroy = vi.fn();
  updateSettings = vi.fn();
  setRepresentationForTypeById = vi.fn();
  getRepresentationsByType = vi.fn(() => representations);
  on = vi.fn((event: string, handler: Function) => {
    handlers[event] = handler;
  });
}

let instance: MockDashPlayer;

vi.mock('dashjs', () => {
  const MediaPlayer = vi.fn(() => ({ create: () => instance })) as unknown as {
    (): { create: () => MockDashPlayer };
  } & {
    events: { STREAM_INITIALIZED: string; ERROR: string; MANIFEST_LOADED: string };
  };
  MediaPlayer.events = { STREAM_INITIALIZED: 'streamInitialized', ERROR: 'error', MANIFEST_LOADED: 'manifestLoaded' };
  return { MediaPlayer };
});

describe('createDashAdapter', () => {
  beforeEach(() => {
    instance = new MockDashPlayer();
    representations = [];
    Object.keys(handlers).forEach((key) => delete handlers[key]);
  });

  it('reloadsOnQualityChange is false', () => {
    expect(createDashAdapter().reloadsOnQualityChange).toBe(false);
  });

  it('load() initializes dashjs with autoplay disabled', async () => {
    const adapter = createDashAdapter();
    const video = document.createElement('video');

    await adapter.load(video, 'https://cdn.example.com/manifest.mpd');

    expect(instance.initialize).toHaveBeenCalledWith(video, 'https://cdn.example.com/manifest.mpd', false);
  });

  it('emits levelsready with representations + a synthesized Auto entry on STREAM_INITIALIZED', async () => {
    representations = [
      { id: 'rep-720', bitrateInKbit: 2000, height: 720 },
      { id: 'rep-480', bitrateInKbit: 800, height: 480 },
    ];
    const adapter = createDashAdapter();
    const video = document.createElement('video');
    const onLevelsReady = vi.fn();
    adapter.on('levelsready', onLevelsReady);

    await adapter.load(video, 'https://cdn.example.com/manifest.mpd');
    handlers['streamInitialized']();

    expect(onLevelsReady).toHaveBeenCalledTimes(1);
    const { levels } = onLevelsReady.mock.calls[0][0];
    expect(levels).toEqual([
      { id: 'rep-720', name: '720p', bitrate: 2_000_000, height: 720 },
      { id: 'rep-480', name: '480p', bitrate: 800_000, height: 480 },
      { id: 'auto', name: 'Auto' },
    ]);
    expect(adapter.getQualityLevels()).toEqual(levels);
  });

  it('does not emit levelsready when there are no video representations', async () => {
    representations = [];
    const adapter = createDashAdapter();
    const video = document.createElement('video');
    const onLevelsReady = vi.fn();
    adapter.on('levelsready', onLevelsReady);

    await adapter.load(video, 'https://cdn.example.com/manifest.mpd');
    handlers['streamInitialized']();

    expect(onLevelsReady).not.toHaveBeenCalled();
    expect(adapter.getQualityLevels()).toEqual([]);
  });

  it('emits error with fatal: true on ERROR (dashjs has no fatal/non-fatal distinction)', async () => {
    const adapter = createDashAdapter();
    const video = document.createElement('video');
    const onError = vi.fn();
    adapter.on('error', onError);

    await adapter.load(video, 'https://cdn.example.com/manifest.mpd');
    handlers['error']({ error: 'download failed' });

    expect(onError).toHaveBeenCalledWith({ fatal: true, detail: { error: 'download failed' } });
  });

  it('setQuality(id) disables ABR and selects the representation by id', async () => {
    const adapter = createDashAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://cdn.example.com/manifest.mpd');

    adapter.setQuality('rep-720');

    expect(instance.updateSettings).toHaveBeenCalledWith({
      streaming: { abr: { autoSwitchBitrate: { video: false } } },
    });
    expect(instance.setRepresentationForTypeById).toHaveBeenCalledWith('video', 'rep-720');
  });

  it('setQuality(AUTO_QUALITY_ID) re-enables ABR instead of selecting a representation', async () => {
    const adapter = createDashAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://cdn.example.com/manifest.mpd');

    adapter.setQuality('auto');

    expect(instance.updateSettings).toHaveBeenCalledWith({
      streaming: { abr: { autoSwitchBitrate: { video: true } } },
    });
    expect(instance.setRepresentationForTypeById).not.toHaveBeenCalled();
  });

  it('setQuality() before load() is a safe no-op', () => {
    expect(() => createDashAdapter().setQuality('x')).not.toThrow();
  });

  it('destroy() tears down the underlying dashjs instance', async () => {
    const adapter = createDashAdapter();
    const video = document.createElement('video');
    await adapter.load(video, 'https://cdn.example.com/manifest.mpd');

    adapter.destroy();

    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });

  it('destroy() before load() is a safe no-op', () => {
    expect(() => createDashAdapter().destroy()).not.toThrow();
  });
});
