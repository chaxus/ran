export interface PlayerContextState<TAction = unknown, TLevel = unknown> {
  action: TAction;
  currentState: string;
  duration: number;
  currentTime: number;
  volume: number;
  playbackRate: number;
  fullScreen: boolean;
  levels: Array<TLevel>;
  url: string;
  levelMap: Map<string, string>;
  clarity: string;
}

export interface PlayerRuntimeState<TPending = unknown> {
  moveProgress: { percentage: number; mouseDown: boolean };
  isSeeking: boolean;
  wasPlayingBeforeSeek: boolean;
  isBuffering: boolean;
  pendingPlaybackRestore?: TPending;
}

export function createDefaultPlayerContext<TAction, TLevel = unknown>(
  action: TAction,
): PlayerContextState<TAction, TLevel> {
  return {
    currentTime: 0,
    duration: 0,
    currentState: '',
    action,
    volume: 0.5,
    playbackRate: 1,
    clarity: '',
    fullScreen: false,
    levels: [],
    url: '',
    levelMap: new Map(),
  };
}

export function resetSourceContextState(ctx: PlayerContextState): void {
  ctx.levels = [];
  ctx.levelMap = new Map();
  ctx.clarity = '';
  ctx.url = '';
}

export function createDefaultRuntimeState<TPending = unknown>(): PlayerRuntimeState<TPending> {
  return {
    moveProgress: {
      percentage: 0,
      mouseDown: false,
    },
    isSeeking: false,
    wasPlayingBeforeSeek: false,
    isBuffering: false,
    pendingPlaybackRestore: undefined,
  };
}

export function resetTransientRuntimeState<TPending>(state: PlayerRuntimeState<TPending>): void {
  state.moveProgress.mouseDown = false;
  state.isSeeking = false;
  state.wasPlayingBeforeSeek = false;
  state.pendingPlaybackRestore = undefined;
}
