export type EngineFormat = 'hls' | 'dash' | 'flv' | 'native';

/**
 * Sentinel id for the synthesized "let the engine choose" entry — same meaning
 * across every engine that supports one (HLS: reload the manifest URL; DASH:
 * re-enable dashjs's own ABR). FLV never emits this — it has no adapter-level
 * quality concept at all.
 */
export const AUTO_QUALITY_ID = 'auto';

export interface EngineQualityLevel {
  /**
   * Passed back into `setQuality(id)`, unchanged in meaning per engine:
   * - HLS: a manifest/variant URL — exactly today's `ctx.levelMap` value,
   *   zero behavior change.
   * - DASH: dashjs's numeric quality index, stringified.
   * - Always the literal `AUTO_QUALITY_ID` for the synthesized "Auto" entry.
   */
  id: string;
  name: string;
  bitrate?: number;
  height?: number;
}

export interface EngineAdapterEventMap {
  levelsready: { levels: EngineQualityLevel[] };
  error: { fatal: boolean; detail: unknown };
}

export type EngineAdapterEventName = keyof EngineAdapterEventMap;

export interface EngineAdapter {
  /**
   * True when `setQuality` works by reloading/reattaching the underlying
   * `<video>` (HLS's `loadSource()+startLoad()`) — `core/clarity.ts` only runs
   * its capture/restore-snapshot dance around `setQuality` when this is true.
   */
  readonly reloadsOnQualityChange: boolean;
  /**
   * Always resolves, never rejects — failures are reported via the `error`
   * event, never a thrown/rejected `load()`, so callers never need a
   * `.catch()`. Internally does its own `await import(...)`; the returned
   * promise is intentionally not awaited by `loadVideoSource` (fire-and-
   * forget, same "visible immediately, fills in async" shape as
   * `r-mermaid`/`r-math`).
   */
  load(video: HTMLVideoElement, src: string): Promise<void>;
  destroy(): void;
  getQualityLevels(): EngineQualityLevel[];
  setQuality(id: string): void;
  on<K extends EngineAdapterEventName>(event: K, handler: (payload: EngineAdapterEventMap[K]) => void): void;
}

/**
 * Tiny local pub/sub each adapter uses internally — decouples the adapter's
 * own event vocabulary from whatever event names the wrapped library uses
 * (hls.js's `Hls.Events.MANIFEST_LOADED` string, dashjs's `MediaPlayer.events.*`,
 * mpegts.js's `mpegts.Events.*` never leak past the adapter file that owns
 * them). No `off()` — adapter instances are one-shot (a fresh one is
 * constructed on every `updatePlayer()` call, the old one `.destroy()`ed), so
 * there's no reuse scenario that needs unsubscription.
 */
export function createAdapterEmitter(): {
  on: EngineAdapter['on'];
  emit: <K extends EngineAdapterEventName>(event: K, payload: EngineAdapterEventMap[K]) => void;
} {
  const handlers = new Map<EngineAdapterEventName, Set<(payload: unknown) => void>>();
  return {
    on: (event, handler) => {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event)!.add(handler as (payload: unknown) => void);
    },
    emit: (event, payload) => {
      handlers.get(event)?.forEach((handler) => handler(payload));
    },
  };
}
