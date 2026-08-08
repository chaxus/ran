import type Mpegts from 'mpegts.js';
import { createAdapterEmitter, type EngineAdapter } from './types';

/**
 * `mpegts.js` demuxes two distinct containers under one library — FLV and raw
 * MPEG-TS — and needs to be told which one via `type`. The player's own
 * `EngineFormat`/`detectFormat` collapse both into a single `'flv'` engine
 * (there's nothing quality-switching-relevant that differs between them), so
 * this adapter re-derives the specific container type from the URL itself.
 */
const resolveMediaType = (src: string): 'flv' | 'mpegts' => {
  const withoutQuery = src.split(/[?#]/)[0];
  const ext = withoutQuery.split('.').pop()?.toLowerCase();
  return ext === 'ts' || ext === 'm2ts' ? 'mpegts' : 'flv';
};

/**
 * FLV/MPEG-TS playback — typically single-bitrate live streams, so unlike
 * HLS/DASH there is no adapter-level quality concept at all:
 * `getQualityLevels()` always returns `[]`, which makes `core/clarity.ts`'s
 * existing `if (levels.length <= 0) return;` guard in `createClaritySelect`
 * naturally skip rendering the clarity selector — correct, since there's
 * nothing to switch.
 */
export function createFlvAdapter(): EngineAdapter {
  const emitter = createAdapterEmitter();
  let player: Mpegts.Player | undefined;

  // mpegts.js (like its flv.js ancestor) has no fatal/non-fatal error
  // distinction in its public API — every ERROR event stops playback, so
  // every one is treated as fatal here, same rationale as core/adapters/dash.ts.
  const handleError = (errorType: unknown, errorDetail: unknown, errorInfo: unknown): void => {
    emitter.emit('error', { fatal: true, detail: { errorType, errorDetail, errorInfo } });
  };

  return {
    reloadsOnQualityChange: false,
    load: async (video, src) => {
      const { default: mpegts } = await import('mpegts.js');
      if (!mpegts.isSupported() || !src) {
        if (src) video.src = src;
        return;
      }
      player = mpegts.createPlayer({ type: resolveMediaType(src), isLive: true, url: src });
      player.on(mpegts.Events.ERROR, handleError);
      player.attachMediaElement(video);
      player.load();
    },
    destroy: () => {
      player?.destroy();
      player = undefined;
    },
    getQualityLevels: () => [],
    setQuality: () => undefined,
    on: emitter.on,
  };
}
