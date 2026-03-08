export interface PlaybackSnapshot {
  currentTime: number;
  playbackRate: number;
  volume: number;
  shouldResume: boolean;
}

export function shouldResumePlayback(video?: HTMLVideoElement): boolean {
  return !!video && !video.paused && !video.ended;
}

export function resolveSeekDuration(durationFromVideo: number, durationFromContext: number): number {
  return durationFromVideo > 0 ? durationFromVideo : durationFromContext;
}

export function createPlaybackSnapshot(input: {
  currentTime: number;
  playbackRate: number;
  volume: number;
  shouldResume: boolean;
}): PlaybackSnapshot {
  return {
    currentTime: input.currentTime,
    playbackRate: input.playbackRate,
    volume: input.volume,
    shouldResume: input.shouldResume,
  };
}
