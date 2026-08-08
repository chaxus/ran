import type { MediaPlayerClass, Representation } from 'dashjs';
import { AUTO_QUALITY_ID, createAdapterEmitter, type EngineAdapter, type EngineQualityLevel } from './types';

const deriveLevelName = (representation: Representation): string =>
  representation.height ? `${representation.height}p` : `${Math.round(representation.bitrateInKbit)}k`;

/**
 * DASH rendition switching — unlike HLS, `dashjs` keeps every bitrate inside
 * the one already-loaded manifest/session, so quality switching never
 * reloads the `<video>` (`reloadsOnQualityChange: false`, see
 * `core/clarity.ts`'s `changeClarity`).
 */
export function createDashAdapter(): EngineAdapter {
  const emitter = createAdapterEmitter();
  let player: MediaPlayerClass | undefined;
  let levels: EngineQualityLevel[] = [];

  const handleStreamInitialized = (): void => {
    if (!player) return;
    const representations = player.getRepresentationsByType('video');
    if (representations.length <= 0) return;
    levels = [
      ...representations.map((representation) => ({
        id: representation.id,
        name: deriveLevelName(representation),
        bitrate: Math.round(representation.bitrateInKbit * 1000),
        height: representation.height,
      })),
      { id: AUTO_QUALITY_ID, name: 'Auto' },
    ];
    emitter.emit('levelsready', { levels });
  };

  // dashjs's public API has no fatal/non-fatal distinction the way hls.js
  // does — every ERROR event is treated as fatal here, matching the more
  // conservative default of surfacing the retry dialog rather than staying
  // silent on an error class dashjs itself doesn't tell us is recoverable.
  const handleError = (event: unknown): void => {
    emitter.emit('error', { fatal: true, detail: event });
  };

  return {
    reloadsOnQualityChange: false,
    load: async (video, src) => {
      const { MediaPlayer } = await import('dashjs');
      player = MediaPlayer().create();
      player.on(MediaPlayer.events.STREAM_INITIALIZED, handleStreamInitialized);
      player.on(MediaPlayer.events.ERROR, handleError);
      player.initialize(video, src, false);
    },
    destroy: () => {
      player?.destroy();
      player = undefined;
    },
    getQualityLevels: () => levels,
    setQuality: (id) => {
      if (!player) return;
      if (id === AUTO_QUALITY_ID) {
        player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } });
        return;
      }
      player.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } });
      player.setRepresentationForTypeById('video', id);
    },
    on: emitter.on,
  };
}
