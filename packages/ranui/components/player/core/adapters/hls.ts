import type Hls from 'hls.js';
import type { ErrorData, LevelParsed, ManifestLoadedData } from 'hls.js';
import { buildManifestLevels } from '../levels';
import { createAdapterEmitter, type EngineAdapter, type EngineQualityLevel } from './types';

/**
 * HLS-shaped rendition switching — quality = a different manifest/variant
 * URL, switched by reloading the `<video>` source (`loadSource()+startLoad()`,
 * exactly today's `changeClarity` behavior, just moved one layer down).
 */
export function createHlsAdapter(): EngineAdapter {
  const emitter = createAdapterEmitter();
  let hls: Hls | undefined;
  let levelMap = new Map<string, string>();
  let levels: EngineQualityLevel[] = [];

  const handleManifestLoaded = (_event: string, data: ManifestLoadedData): void => {
    const normalized = buildManifestLevels<LevelParsed>({
      levels: data.levels,
      manifestUrl: data.url,
      existingLevelMap: levelMap,
    });
    if (normalized.levels.length <= 0) return;
    normalized.levelMapEntries.forEach(([name, url]) => levelMap.set(name, url));
    levels = normalized.levels.map((level) => ({
      id: level.url,
      name: level.name,
      bitrate: level.bitrate,
      height: level.height,
    }));
    emitter.emit('levelsready', { levels });
  };

  const handleError = (_event: string, data: ErrorData): void => {
    emitter.emit('error', { fatal: !!data.fatal, detail: data });
  };

  return {
    reloadsOnQualityChange: true,
    load: async (video, src) => {
      const { default: HlsCtor } = await import('hls.js');
      if (!HlsCtor.isSupported() || !src) {
        if (src) video.src = src;
        return;
      }
      hls = new HlsCtor();
      hls.off(HlsCtor.Events.MANIFEST_LOADED, handleManifestLoaded);
      hls.on(HlsCtor.Events.MANIFEST_LOADED, handleManifestLoaded);
      hls.off(HlsCtor.Events.ERROR, handleError);
      hls.on(HlsCtor.Events.ERROR, handleError);
      hls.loadSource(src);
      hls.attachMedia(video);
    },
    destroy: () => {
      hls?.destroy();
      hls = undefined;
    },
    getQualityLevels: () => levels,
    setQuality: (id) => {
      if (!hls) return;
      hls.loadSource(id);
      hls.startLoad();
    },
    on: emitter.on,
  };
}
