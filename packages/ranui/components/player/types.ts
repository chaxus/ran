/**
 * Player Component Types
 */

/**
 * Video quality level
 */
export interface Level {
  audioCodec: string;
  bitrate: number;
  height: number;
  width: number;
  name: string;
  url: string;
  videoCodec: string;
}

/**
 * HLS player interface
 */
export interface HlsPlayer {
  startLoad(): () => void;
  off: (s: string, f: Function) => void;
  on: (s: string, f: Function) => void;
  loadSource: (s: string) => void;
  attachMedia: (v: HTMLVideoElement) => void;
  destroy: () => void;
}

/**
 * HLS library interface
 */
export interface Hls {
  Events: {
    MANIFEST_LOADED: 'hlsManifestLoaded';
    ERROR: 'error';
  };
  isSupported: () => boolean;
}

export type HLS = Hls & (new () => HlsPlayer);

/**
 * Player state type
 */
export type PlayerState =
  | 'canplay'
  | 'canplaythrough'
  | 'complete'
  | 'durationchange'
  | 'emptied'
  | 'ended'
  | 'error'
  | 'loadeddata'
  | 'loadedmetadata'
  | 'loadstart'
  | 'pause'
  | 'play'
  | 'playing'
  | 'progress'
  | 'ratechange'
  | 'seeked'
  | 'seeking'
  | 'stalled'
  | 'suspend'
  | 'timeupdate'
  | 'volumechange'
  | 'waiting';

/**
 * Playback speed option
 */
export interface SpeedOption {
  label: string;
  value: number;
}

/**
 * Event detail for player change events
 */
export interface PlayerChangeEventDetail {
  type: string;
  data: unknown;
  currentTime: number;
  duration: number;
  tag: HTMLElement;
}

/**
 * Event detail for HLS manifest loaded
 */
export interface ManifestLoadedEventDetail {
  data: {
    levels: Level[];
    url: string;
  };
}

/**
 * Event detail for HLS error
 */
export interface HlsErrorEventDetail {
  event: unknown;
  data: unknown;
}
