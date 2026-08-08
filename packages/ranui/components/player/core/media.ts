import { createEngineAdapter } from './adapters';
import { detectFormat } from './adapters/detect';
import type { EngineAdapter, EngineFormat, EngineQualityLevel } from './adapters/types';

export interface PlayerMediaHandlers {
  onCanplay: (e: Event) => void;
  onCanplaythrough: (e: Event) => void;
  onComplete: (e: Event) => void;
  onDurationchange: (e: Event) => void;
  onEmptied: (e: Event) => void;
  onEnded: (e: Event) => void;
  onError: (e: Event) => void;
  onLoadeddata: (e: Event) => void;
  onLoadedmetadata: (e: Event) => void;
  onLoadstart: (e: Event) => void;
  onPause: (e: Event) => void;
  onPlay: (e: Event) => void;
  onPlaying: (e: Event) => void;
  onProgress: (e: Event) => void;
  onRatechange: (e: Event) => void;
  onSeeked: (e: Event) => void;
  onSeeking: (e: Event) => void;
  onStalled: (e: Event) => void;
  onSuspend: (e: Event) => void;
  onTimeupdate: (e: Event) => void;
  onVolumechange: (e: Event) => void;
  onWaiting: (e: Event) => void;
  onEnterPictureInPicture: (e: Event) => void;
  onLeavePictureInPicture: (e: Event) => void;
}

const MEDIA_EVENT_HANDLER_MAP: Array<[string, keyof PlayerMediaHandlers]> = [
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

export function bindMediaEvents(video: HTMLVideoElement, handlers: PlayerMediaHandlers): void {
  for (const [eventName, handlerName] of MEDIA_EVENT_HANDLER_MAP) {
    video.addEventListener(eventName, handlers[handlerName] as EventListener);
  }
}

export function unbindMediaEvents(video: HTMLVideoElement, handlers: PlayerMediaHandlers): void {
  for (const [eventName, handlerName] of MEDIA_EVENT_HANDLER_MAP) {
    video.removeEventListener(eventName, handlers[handlerName] as EventListener);
  }
}

export interface LoadVideoSourceInput {
  video: HTMLVideoElement;
  src: string;
  /** The player's `format` attribute value — passed straight through as `detectFormat`'s typeHint. */
  format?: string;
  existingEngine?: EngineAdapter;
  onLevelsReady: (levels: EngineQualityLevel[]) => void;
  onEngineError: (payload: { fatal: boolean; detail: unknown }) => void;
  /**
   * Injectable for tests — defaults to the real registry, mirroring how `Hls`
   * was already an injected param rather than a `window.Hls` read inside this
   * function.
   */
  createEngineAdapter?: (format: EngineFormat) => EngineAdapter | undefined;
}

export function loadVideoSource(input: LoadVideoSourceInput): EngineAdapter | undefined {
  const { video, src, format, existingEngine, onLevelsReady, onEngineError } = input;
  const resolveAdapter = input.createEngineAdapter ?? createEngineAdapter;
  existingEngine?.destroy();
  const detected = detectFormat(src, format);
  const adapter = src ? resolveAdapter(detected) : undefined;
  if (!adapter) {
    if (src) video.src = src;
    return undefined;
  }
  adapter.on('levelsready', ({ levels }) => onLevelsReady(levels));
  adapter.on('error', (payload) => onEngineError(payload));
  void adapter.load(video, src);
  return adapter;
}
