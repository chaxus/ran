/**
 * QoE (Quality of Experience) accumulator — pure computation layered on the
 * `change()` event stream the player already emits, no new UI
 * (`docs/PLAYER_ROADMAP.md` Phase 3). Every transition it needs is already a
 * `change()` call somewhere else in the player; this module never touches the
 * `<video>` or DOM directly.
 */
export interface PlayerMetrics {
  /** Number of `waiting`→`playing` transitions observed since the last `onLoadStart()`. */
  rebufferCount: number;
  /** Total time (ms) spent between a `waiting` and the `playing` that ended it. */
  rebufferDuration: number;
  /** ms from `onLoadStart()` to the first `canplay`/`playing`, or `null` before either has fired. */
  firstFrameMs: number | null;
  /** Number of user-triggered quality switches (`qualityswitch` change events). */
  qualitySwitchCount: number;
  /** Number of `error`/`sourceerror` change events. */
  errorCount: number;
}

export interface PlayerMetricsController {
  /** Resets all counters and starts the first-frame clock — call at the start of every `updatePlayer()`. */
  onLoadStart: () => void;
  /** Feed every `change(name, value)` call through this — unrecognized names are ignored. */
  record: (name: string, value: unknown) => void;
  getMetrics: () => PlayerMetrics;
}

function createDefaultMetrics(): PlayerMetrics {
  return {
    rebufferCount: 0,
    rebufferDuration: 0,
    firstFrameMs: null,
    qualitySwitchCount: 0,
    errorCount: 0,
  };
}

export function createMetricsController(now: () => number = () => performance.now()): PlayerMetricsController {
  let metrics = createDefaultMetrics();
  let loadStartedAt: number | undefined;
  let rebufferStartedAt: number | undefined;

  const markFirstFrame = (): void => {
    if (metrics.firstFrameMs !== null || loadStartedAt === undefined) return;
    metrics.firstFrameMs = now() - loadStartedAt;
  };

  const onLoadStart = (): void => {
    metrics = createDefaultMetrics();
    rebufferStartedAt = undefined;
    loadStartedAt = now();
  };

  const record = (name: string, _value: unknown): void => {
    switch (name) {
      case 'waiting':
        if (rebufferStartedAt === undefined) rebufferStartedAt = now();
        break;
      case 'playing':
        if (rebufferStartedAt !== undefined) {
          metrics.rebufferDuration += now() - rebufferStartedAt;
          metrics.rebufferCount += 1;
          rebufferStartedAt = undefined;
        }
        markFirstFrame();
        break;
      case 'canplay':
        markFirstFrame();
        break;
      case 'qualityswitch':
        metrics.qualitySwitchCount += 1;
        break;
      case 'error':
      case 'sourceerror':
        metrics.errorCount += 1;
        break;
      default:
        break;
    }
  };

  const getMetrics = (): PlayerMetrics => ({ ...metrics });

  return { onLoadStart, record, getMetrics };
}
