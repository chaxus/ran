export interface HlsLikeStatic<TPlayer> {
  Events: {
    MANIFEST_LOADED: string;
    ERROR: string;
  };
  isSupported: () => boolean;
  new (): TPlayer;
}

export interface HlsPlayerLike {
  startLoad(): () => void;
  off: (eventName: string, handler: Function) => void;
  on: (eventName: string, handler: Function) => void;
  loadSource: (src: string) => void;
  attachMedia: (video: HTMLVideoElement) => void;
  destroy: () => void;
}

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

export function loadVideoSource<TPlayer extends HlsPlayerLike>(input: {
  video: HTMLVideoElement;
  src: string;
  Hls?: HlsLikeStatic<TPlayer>;
  existingHls?: TPlayer;
  onManifestLoaded: Function;
  onHlsError: Function;
}): TPlayer | undefined {
  const { video, src, Hls, existingHls, onManifestLoaded, onHlsError } = input;
  if (existingHls) {
    existingHls.destroy();
  }
  if (Hls?.isSupported() && src) {
    try {
      const hls = new Hls();
      hls.off(Hls.Events.MANIFEST_LOADED, onManifestLoaded);
      hls.on(Hls.Events.MANIFEST_LOADED, onManifestLoaded);
      hls.off(Hls.Events.ERROR, onHlsError);
      hls.on(Hls.Events.ERROR, onHlsError);
      hls.loadSource(src);
      hls.attachMedia(video);
      return hls;
    } catch {
      // Fall through to native src binding when HLS initialization fails.
    }
  }
  if (src) {
    // Native binding is the universal fallback for mp4 and browser-supported HLS.
    video.src = src;
  }
  return undefined;
}
