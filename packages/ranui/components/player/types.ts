/**
 * Player component types
 */

// 播放器状态
export type PlayerState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error'
  | 'buffering';

// 播放器配置
export interface PlayerConfig {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  poster?: string;
}

// 事件详情类型
export interface PlayerEventDetail {
  currentTime: number;
  duration: number;
  state: PlayerState;
  volume: number;
  playbackRate: number;
}

// 事件类型
export type PlayerEventType =
  | 'play'
  | 'pause'
  | 'playing'
  | 'ended'
  | 'timeupdate'
  | 'volumechange'
  | 'ratechange'
  | 'loadstart'
  | 'loadeddata'
  | 'canplay'
  | 'error'
  | 'seeking'
  | 'seeked'
  | 'fullscreenchange'
  | 'qualitychange'
  | 'statechange';

// HLS 相关类型
export interface HlsPlayer {
  startLoad(): () => void;
  off: (s: string, f: Function) => void;
  on: (s: string, f: Function) => void;
  loadSource: (s: string) => void;
  attachMedia: (v: HTMLVideoElement) => void;
  destroy: () => void;
}

export interface Level {
  audioCodec: string;
  bitrate: number;
  height: number;
  width: number;
  name: string;
  url: string;
  videoCodec: string;
}

// 控制栏配置
export interface ControlsConfig {
  showProgress?: boolean;
  showVolume?: boolean;
  showSpeed?: boolean;
  showClarity?: boolean;
  showFullscreen?: boolean;
}

// 内部上下文（用于管理器间通信）
export interface PlayerContext {
  currentTime: number;
  duration: number;
  currentState: string;
  volume: number;
  playbackRate: number;
  fullScreen: boolean;
  levels: Partial<Level>[];
  url: string;
  levelMap: Map<string, string>;
  clarity: string;
}
